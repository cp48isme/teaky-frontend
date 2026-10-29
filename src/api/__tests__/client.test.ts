import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiRequest, ApiError, isSessionEstablishingPath, sessionNavigation } from '../client';

// 29 Oct 2026: a login's 401 is a failed sign-in, not a session expiry. Both
// halves are asserted here — no bearer on the session-establishing endpoints,
// and no refresh-and-redirect on their 401 — plus the genuine expiry path,
// which must keep working.

const STALE = { access_token: 'stale.access.token', refresh_token: 'stale-refresh' };

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

// Snapshot per call: apiRequest reuses one headers object across its retry, so
// reading mock.calls afterwards would show the retried value on the first call.
let recorded: { url: string; authorization: string | undefined }[] = [];
const responses = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>();
function recordingFetch(): typeof fetch {
  return ((url: string, init?: RequestInit) => {
    recorded.push({ url, authorization: (init?.headers as Record<string, string> | undefined)?.['Authorization'] });
    return responses(url, init);
  }) as unknown as typeof fetch;
}
function calls(): { url: string; authorization: string | undefined }[] {
  return recorded;
}

describe('isSessionEstablishingPath', () => {
  it('names login, register and refresh, and nothing that consumes a session', () => {
    expect(isSessionEstablishingPath('/auth/login')).toBe(true);
    expect(isSessionEstablishingPath('/auth/register')).toBe(true);
    expect(isSessionEstablishingPath('/auth/refresh')).toBe(true);
    expect(isSessionEstablishingPath('/auth/login?next=/p/raphael')).toBe(true);
    expect(isSessionEstablishingPath('/auth/logout')).toBe(false);
    expect(isSessionEstablishingPath('/orders')).toBe(false);
  });
});

describe('apiRequest and the session-establishing endpoints', () => {
  let toLogin: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    localStorage.clear();
    recorded = [];
    responses.mockReset();
    vi.stubGlobal('fetch', recordingFetch());
    toLogin = vi.spyOn(sessionNavigation, 'toLogin').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    toLogin.mockRestore();
  });

  it('sends no bearer to /auth/login even when a token sits in localStorage', async () => {
    localStorage.setItem('access_token', STALE.access_token);
    localStorage.setItem('refresh_token', STALE.refresh_token);
    responses.mockResolvedValueOnce(jsonResponse(200, { access_token: 'new', refresh_token: 'new-r', token_type: 'bearer', expires_in: 900 }));

    const tokens = await apiRequest<{ access_token: string }>('/auth/login', { method: 'POST', body: '{}' });

    expect(tokens.access_token).toBe('new');
    expect(calls()).toEqual([{ url: '/api/auth/login', authorization: undefined }]);
  });

  it('sends no bearer to /auth/register either', async () => {
    localStorage.setItem('access_token', STALE.access_token);
    responses.mockResolvedValueOnce(jsonResponse(201, { access_token: 'new', refresh_token: 'new-r', token_type: 'bearer', expires_in: 900 }));

    await apiRequest('/auth/register', { method: 'POST', body: '{}' });

    expect(calls()).toEqual([{ url: '/api/auth/register', authorization: undefined }]);
  });

  it('treats a 401 from /auth/login as a failed sign-in: no refresh, no redirect, storage untouched, the detail thrown', async () => {
    localStorage.setItem('access_token', STALE.access_token);
    localStorage.setItem('refresh_token', STALE.refresh_token);
    responses.mockResolvedValueOnce(jsonResponse(401, { detail: 'Invalid email or password' }));

    await expect(apiRequest('/auth/login', { method: 'POST', body: '{}' })).rejects.toMatchObject({
      name: 'ApiError',
      status: 401,
      message: 'Invalid email or password',
    });

    expect(calls()).toEqual([{ url: '/api/auth/login', authorization: undefined }]);
    expect(toLogin).not.toHaveBeenCalled();
    expect(localStorage.getItem('access_token')).toBe(STALE.access_token);
    expect(localStorage.getItem('refresh_token')).toBe(STALE.refresh_token);
  });

  it('still carries the bearer on an ordinary request and retries once after a successful refresh', async () => {
    localStorage.setItem('access_token', 'expired.access.token');
    localStorage.setItem('refresh_token', 'good-refresh');
    responses
      .mockResolvedValueOnce(jsonResponse(401, { detail: 'Could not validate credentials' }))
      .mockResolvedValueOnce(jsonResponse(200, { access_token: 'fresh', refresh_token: 'fresh-r', token_type: 'bearer', expires_in: 900 }))
      .mockResolvedValueOnce(jsonResponse(200, [{ id: 'o1' }]));

    const orders = await apiRequest<{ id: string }[]>('/orders');

    expect(orders).toEqual([{ id: 'o1' }]);
    expect(calls()).toEqual([
      { url: '/api/orders', authorization: 'Bearer expired.access.token' },
      { url: '/api/auth/refresh', authorization: undefined },
      { url: '/api/orders', authorization: 'Bearer fresh' },
    ]);
    expect(toLogin).not.toHaveBeenCalled();
  });

  it('genuine expiry — the refresh itself 401s: storage cleared, sent to sign in, "Session expired" thrown', async () => {
    localStorage.setItem('access_token', 'expired.access.token');
    localStorage.setItem('refresh_token', 'revoked-refresh');
    responses
      .mockResolvedValueOnce(jsonResponse(401, { detail: 'Could not validate credentials' }))
      .mockResolvedValueOnce(jsonResponse(401, { detail: 'Invalid or expired refresh token' }));

    await expect(apiRequest('/orders')).rejects.toThrow('Session expired');

    expect(calls().map((c) => c.url)).toEqual(['/api/orders', '/api/auth/refresh']);
    expect(toLogin).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
  });

  it('a 401 with no token at all is an ordinary ApiError, not an expiry', async () => {
    responses.mockResolvedValueOnce(jsonResponse(401, { detail: 'Not authenticated' }));

    await expect(apiRequest('/orders')).rejects.toBeInstanceOf(ApiError);
    expect(calls()).toEqual([{ url: '/api/orders', authorization: undefined }]);
    expect(toLogin).not.toHaveBeenCalled();
  });
});
