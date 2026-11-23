import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiRequest, bootstrapSession, clearSession, getAccessToken, isAuthenticated, setSession } from '../client';
import { logout } from '../auth';
import { AuthProvider } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

/** The cookie half of the session cut-over (review 19 Nov 2026, item 6;
 * backend #279): the access token lives in memory only; every request to the
 * API carries the cookie (`credentials: 'include'`); the refresh sends no
 * token in its body — the cookie is the token; on load one silent refresh
 * decides signed-in or not; a browser holding only the old storage tokens has
 * no cookie and signs in once; sign-out drops the memory token and calls the
 * cookie logout with no body. No code path reads the refresh token. */

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}
const session = (access_token: string) => ({ access_token, token_type: 'bearer', expires_in: 900 });

type Call = { url: string; init: RequestInit | undefined };
let calls: Call[] = [];
const responses = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>();

beforeEach(() => {
  localStorage.clear();
  clearSession();
  calls = [];
  responses.mockReset();
  vi.stubGlobal('fetch', ((url: string, init?: RequestInit) => {
    calls.push({ url, init });
    return responses(url, init);
  }) as unknown as typeof fetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('the session after the cookie cut-over', () => {
  it('keeps the access token in memory only: nothing in localStorage or sessionStorage', () => {
    setSession(session('in.memory.only'));
    expect(getAccessToken()).toBe('in.memory.only');
    expect(isAuthenticated()).toBe(true);
    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
    clearSession();
    expect(getAccessToken()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });

  it("every request to the API carries credentials: 'include'", async () => {
    setSession(session('held'));
    responses.mockImplementation(() => Promise.resolve(jsonResponse(200, { ok: true })));
    await apiRequest('/orders');
    await apiRequest('/auth/login', { method: 'POST', body: '{}' });
    expect(calls.map((c) => c.init?.credentials)).toEqual(['include', 'include']);
  });

  it('the refresh sends no token in its body: the cookie is the token', async () => {
    setSession(session('expired'));
    responses
      .mockResolvedValueOnce(jsonResponse(401, { detail: 'expired' }))
      .mockResolvedValueOnce(jsonResponse(200, session('renewed')))
      .mockResolvedValueOnce(jsonResponse(200, { ok: true }));
    await apiRequest('/orders');
    const refresh = calls.find((c) => c.url === '/api/auth/refresh');
    expect(refresh).toBeDefined();
    expect(refresh?.init?.credentials).toBe('include');
    const body = JSON.parse(String(refresh?.init?.body));
    expect(Object.keys(body)).toEqual(['organization_id']);
    expect(JSON.stringify(refresh?.init)).not.toContain('refresh_token');
    expect(getAccessToken()).toBe('renewed');
  });

  it('on load, one silent refresh decides: a cookie that answers makes the browser signed in', async () => {
    responses.mockResolvedValueOnce(jsonResponse(200, session('from.cookie')));
    expect(await bootstrapSession()).toBe(true);
    expect(calls.map((c) => c.url)).toEqual(['/api/auth/refresh']);
    expect(calls[0]?.init?.credentials).toBe('include');
    expect(getAccessToken()).toBe('from.cookie');
  });

  it('the forced sign-in: a browser holding only the old storage tokens has no cookie, is not signed in, and lands on /login once', async () => {
    localStorage.setItem('access_token', 'old.stored.access');
    localStorage.setItem('refresh_token', 'old-stored-refresh');
    responses.mockResolvedValueOnce(jsonResponse(401, { detail: 'Invalid or expired refresh token' }));
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>dashboard</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>login route</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );
    expect(await screen.findByText('login route')).toBeInTheDocument();
    // Exactly one refresh was tried, with the cookie jar and no stored token in it.
    expect(calls.map((c) => c.url)).toEqual(['/api/auth/refresh']);
    expect(JSON.stringify(calls[0]?.init)).not.toContain('old-stored-refresh');
    expect(getAccessToken()).toBeNull();
    // The old keys are gone and were never read.
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(localStorage.getItem('refresh_token')).toBeNull();
  });

  it('on load with a cookie, the guarded route renders without a hop through /login', async () => {
    responses.mockResolvedValueOnce(jsonResponse(200, session('from.cookie')));
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <AuthProvider>
          <Routes>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <div>dashboard</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>login route</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>,
    );
    expect(await screen.findByText('dashboard')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByText('login route')).toBeNull());
  });

  it('logout drops the memory token and calls the cookie logout with no body', async () => {
    setSession(session('held'));
    responses.mockResolvedValueOnce(new Response(null, { status: 204 }));
    await logout();
    expect(getAccessToken()).toBeNull();
    expect(calls.map((c) => c.url)).toEqual(['/api/auth/logout']);
    expect(calls[0]?.init?.method).toBe('POST');
    expect(calls[0]?.init?.credentials).toBe('include');
    expect(calls[0]?.init?.body).toBeUndefined();
    expect((calls[0]?.init?.headers as Record<string, string>)['Authorization']).toBe('Bearer held');
  });
});
