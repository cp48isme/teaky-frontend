import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiRequest, ApiError, clearSession, getAccessToken, isSessionEstablishingPath, sessionNavigation, setSession } from '../client';

// 29 Oct 2026: a login's 401 is a failed sign-in, not a session expiry. Both
// halves are asserted here — no bearer on the session-establishing endpoints,
// and no refresh-and-redirect on their 401 — plus the genuine expiry path,
// which must keep working. Cookie cut-over (19 Nov 2026): the access token
// lives in memory (setSession / getAccessToken), the refresh token is the
// browser's HttpOnly cookie — never in storage, never in a body.

const STALE = { access_token: 'stale.access.token', token_type: 'bearer', expires_in: 900 };
const fresh = (access_token: string) => ({ access_token, token_type: 'bearer', expires_in: 900 });

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

// Snapshot per call: apiRequest reuses one headers object across its retry, so
// reading mock.calls afterwards would show the retried value on the first call.
let recorded: { url: string; authorization: string | undefined; credentials: RequestCredentials | undefined; body: unknown }[] = [];
const responses = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>();
function recordingFetch(): typeof fetch {
  return ((url: string, init?: RequestInit) => {
    recorded.push({
      url,
      authorization: (init?.headers as Record<string, string> | undefined)?.['Authorization'],
      credentials: init?.credentials,
      body: init?.body,
    });
    return responses(url, init);
  }) as unknown as typeof fetch;
}
function calls(): { url: string; authorization: string | undefined }[] {
  return recorded.map(({ url, authorization }) => ({ url, authorization }));
}

describe('isSessionEstablishingPath', () => {
  it('names login, register and refresh, and nothing that consumes a session', () => {
    expect(isSessionEstablishingPath('/auth/login')).toBe(true);
    expect(isSessionEstablishingPath('/auth/register')).toBe(true);
    expect(isSessionEstablishingPath('/auth/refresh')).toBe(true);
    expect(isSessionEstablishingPath('/auth/login?next=/p/raphael')).toBe(true);
    expect(isSessionEstablishingPath('/team/invitations/register')).toBe(true);
    expect(isSessionEstablishingPath('/p/raphael/register')).toBe(true);
    expect(isSessionEstablishingPath('/auth/password-reset/request')).toBe(true);
    expect(isSessionEstablishingPath('/auth/password-reset/confirm')).toBe(true);
    expect(isSessionEstablishingPath('/auth/password-reset/other')).toBe(false);
    expect(isSessionEstablishingPath('/auth/logout')).toBe(false);
    expect(isSessionEstablishingPath('/team/invitations/preview')).toBe(false);
    expect(isSessionEstablishingPath('/team/invitations/accept')).toBe(false);
    expect(isSessionEstablishingPath('/p/raphael/cart')).toBe(false);
    expect(isSessionEstablishingPath('/orders')).toBe(false);
  });
});

describe('apiRequest and the session-establishing endpoints', () => {
  let toLogin: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    localStorage.clear();
    clearSession();
    recorded = [];
    responses.mockReset();
    vi.stubGlobal('fetch', recordingFetch());
    toLogin = vi.spyOn(sessionNavigation, 'toLogin').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    toLogin.mockRestore();
  });

  it('sends no bearer to /auth/login even when a token is held', async () => {
    setSession(STALE);
    responses.mockResolvedValueOnce(jsonResponse(200, fresh('new')));

    const tokens = await apiRequest<{ access_token: string }>('/auth/login', { method: 'POST', body: '{}' });

    expect(tokens.access_token).toBe('new');
    expect(calls()).toEqual([{ url: '/api/auth/login', authorization: undefined }]);
  });

  it('sends no bearer when taking up an invitation with a new password, and its 401 is not an expiry', async () => {
    setSession(STALE);
    responses.mockResolvedValueOnce(jsonResponse(401, { detail: 'Invitation not found' }));

    await expect(apiRequest('/team/invitations/register', { method: 'POST', body: '{}' })).rejects.toMatchObject({ status: 401, message: 'Invitation not found' });

    expect(calls()).toEqual([{ url: '/api/team/invitations/register', authorization: undefined }]);
    expect(toLogin).not.toHaveBeenCalled();
    expect(getAccessToken()).toBe(STALE.access_token);
  });

  it('sends no bearer to /auth/register either', async () => {
    setSession(STALE);
    responses.mockResolvedValueOnce(jsonResponse(201, fresh('new')));

    await apiRequest('/auth/register', { method: 'POST', body: '{}' });

    expect(calls()).toEqual([{ url: '/api/auth/register', authorization: undefined }]);
  });

  it('treats a 401 from /auth/login as a failed sign-in: no refresh, no redirect, the held token untouched, the detail thrown', async () => {
    setSession(STALE);
    responses.mockResolvedValueOnce(jsonResponse(401, { detail: 'Invalid email or password' }));

    await expect(apiRequest('/auth/login', { method: 'POST', body: '{}' })).rejects.toMatchObject({
      name: 'ApiError',
      status: 401,
      message: 'Invalid email or password',
    });

    expect(calls()).toEqual([{ url: '/api/auth/login', authorization: undefined }]);
    expect(toLogin).not.toHaveBeenCalled();
    expect(getAccessToken()).toBe(STALE.access_token);
  });

  it('still carries the bearer on an ordinary request and retries once after a successful refresh', async () => {
    setSession(fresh('expired.access.token'));
    responses
      .mockResolvedValueOnce(jsonResponse(401, { detail: 'Could not validate credentials' }))
      .mockResolvedValueOnce(jsonResponse(200, fresh('fresh')))
      .mockResolvedValueOnce(jsonResponse(200, [{ id: 'o1' }]));

    const orders = await apiRequest<{ id: string }[]>('/orders');

    expect(orders).toEqual([{ id: 'o1' }]);
    expect(calls()).toEqual([
      { url: '/api/orders', authorization: 'Bearer expired.access.token' },
      { url: '/api/auth/refresh', authorization: undefined },
      { url: '/api/orders', authorization: 'Bearer fresh' },
    ]);
    expect(toLogin).not.toHaveBeenCalled();
    // The refresh carried the cookie and no body token.
    const refresh = recorded[1]!;
    expect(refresh.credentials).toBe('include');
    expect(JSON.parse(String(refresh.body))).not.toHaveProperty('refresh_token');
  });

  it('four parallel 401s share one refresh and all four retry with the new token (672f)', async () => {
    setSession(STALE);
    let releaseRefresh: (r: Response) => void = () => undefined;
    const refreshGate = new Promise<Response>((resolve) => {
      releaseRefresh = resolve;
    });
    responses.mockImplementation((url: string, init?: RequestInit) => {
      if (url === '/api/auth/refresh') return refreshGate;
      const auth = (init?.headers as Record<string, string> | undefined)?.['Authorization'];
      if (auth === `Bearer ${STALE.access_token}`) return Promise.resolve(jsonResponse(401, { detail: 'Access token has expired' }));
      return Promise.resolve(jsonResponse(200, { ok: url }));
    });

    const paths = ['/portals', '/analytics/summary', '/organizations/x/equipment', '/notifications/unread-count'];
    const pending = paths.map((p) => apiRequest<{ ok: string }>(p));
    await new Promise((r) => setTimeout(r, 0));
    releaseRefresh(jsonResponse(200, fresh('fresh')));
    const results = await Promise.all(pending);

    expect(results.map((r) => r.ok)).toEqual(paths.map((p) => `/api${p}`));
    expect(calls().filter((c) => c.url === '/api/auth/refresh')).toHaveLength(1);
    expect(calls().filter((c) => c.authorization === 'Bearer fresh')).toHaveLength(4);
    expect(toLogin).not.toHaveBeenCalled();
    expect(getAccessToken()).toBe('fresh');
  });

  it('a 401 on a token another refresh has already replaced retries without refreshing', async () => {
    setSession(STALE);
    responses.mockImplementation((url: string, init?: RequestInit) => {
      const auth = (init?.headers as Record<string, string> | undefined)?.['Authorization'];
      if (auth === `Bearer ${STALE.access_token}`) {
        // Someone else's refresh landed while this request was in flight.
        setSession(fresh('fresh'));
        return Promise.resolve(jsonResponse(401, { detail: 'Access token has expired' }));
      }
      return Promise.resolve(jsonResponse(200, { ok: url }));
    });

    const result = await apiRequest<{ ok: string }>('/orders');

    expect(result.ok).toBe('/api/orders');
    expect(calls().map((c) => c.url)).toEqual(['/api/orders', '/api/orders']);
    expect(calls()[1]?.authorization).toBe('Bearer fresh');
  });

  it('when the shared refresh fails, every waiting caller is sent to sign in once each and nothing retries', async () => {
    setSession(STALE);
    responses.mockImplementation((url: string) => {
      if (url === '/api/auth/refresh') return Promise.resolve(jsonResponse(401, { detail: 'Invalid or expired refresh token' }));
      return Promise.resolve(jsonResponse(401, { detail: 'Access token has expired' }));
    });

    const outcomes = await Promise.allSettled([apiRequest('/portals'), apiRequest('/orders')]);

    expect(outcomes.map((o) => o.status)).toEqual(['rejected', 'rejected']);
    expect(calls().filter((c) => c.url === '/api/auth/refresh')).toHaveLength(1);
    expect(getAccessToken()).toBeNull();
  });

  it('genuine expiry — the refresh itself 401s: the session dropped, sent to sign in, "Session expired" thrown', async () => {
    setSession(fresh('expired.access.token'));
    responses
      .mockResolvedValueOnce(jsonResponse(401, { detail: 'Could not validate credentials' }))
      .mockResolvedValueOnce(jsonResponse(401, { detail: 'Invalid or expired refresh token' }));

    await expect(apiRequest('/orders')).rejects.toThrow('Session expired');

    expect(calls().map((c) => c.url)).toEqual(['/api/orders', '/api/auth/refresh']);
    expect(toLogin).toHaveBeenCalledTimes(1);
    expect(getAccessToken()).toBeNull();
  });

  it('a 401 with no token at all is an ordinary ApiError, not an expiry', async () => {
    responses.mockResolvedValueOnce(jsonResponse(401, { detail: 'Not authenticated' }));

    await expect(apiRequest('/orders')).rejects.toBeInstanceOf(ApiError);
    expect(calls()).toEqual([{ url: '/api/orders', authorization: undefined }]);
    expect(toLogin).not.toHaveBeenCalled();
  });
});
