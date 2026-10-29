import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import LoginPage from '../LoginPage';
import { AuthProvider } from '../../contexts/AuthContext';
import { sessionNavigation } from '../../api/client';

// 29 Oct 2026 launch blocker: the four sign-in scenarios measured on rev 17,
// run through the real AuthContext, api/auth and api/client against a mocked
// fetch. The one that mattered: a stale token in localStorage plus a wrong
// password must render the red error and leave the fields alone, instead of
// a silent reload to a blank form.

const redirect = vi.fn();
vi.mock('../../hooks/usePostLoginRedirect', () => ({ usePostLoginRedirect: () => redirect }));

const EMAIL = 'buyer@example.com';
const TOKENS = { access_token: 'new.access.token', refresh_token: 'new-refresh', token_type: 'bearer', expires_in: 900 };

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>,
  );
}

function submit(password: string) {
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: EMAIL } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: password } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
}

function loginCalls() {
  return vi.mocked(fetch).mock.calls.map((c) => {
    const [url, init] = c as [string, RequestInit];
    return { url, authorization: (init.headers as Record<string, string>)['Authorization'], body: init.body };
  });
}

describe('LoginPage sign-in flow', () => {
  let toLogin: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    localStorage.clear();
    redirect.mockReset();
    vi.stubGlobal('fetch', vi.fn());
    toLogin = vi.spyOn(sessionNavigation, 'toLogin').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    toLogin.mockRestore();
  });

  it('clean browser, correct password: signs in and hands off to the post-login redirect', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(200, TOKENS));
    renderLogin();
    submit('correct-horse');

    await waitFor(() => expect(redirect).toHaveBeenCalledTimes(1));
    expect(localStorage.getItem('access_token')).toBe(TOKENS.access_token);
    expect(loginCalls()).toEqual([{ url: '/api/auth/login', authorization: undefined, body: JSON.stringify({ email: EMAIL, password: 'correct-horse' }) }]);
    expect(screen.queryByText('Invalid email or password')).not.toBeInTheDocument();
  });

  it('clean browser, wrong password: the red error renders and the button comes back', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(401, { detail: 'Invalid email or password' }));
    renderLogin();
    submit('wrong');

    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeEnabled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('stale token in localStorage, correct password: no bearer on the login, signs in', async () => {
    localStorage.setItem('access_token', 'stale.access.token');
    localStorage.setItem('refresh_token', 'stale-refresh');
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(200, TOKENS));
    renderLogin();
    submit('correct-horse');

    await waitFor(() => expect(redirect).toHaveBeenCalledTimes(1));
    expect(loginCalls()).toHaveLength(1);
    expect(loginCalls()[0]).toMatchObject({ url: '/api/auth/login', authorization: undefined });
    expect(localStorage.getItem('access_token')).toBe(TOKENS.access_token);
  });

  it('stale token in localStorage, wrong password: the red error renders, the fields are not cleared, no refresh, no reload', async () => {
    localStorage.setItem('access_token', 'stale.access.token');
    localStorage.setItem('refresh_token', 'stale-refresh');
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(401, { detail: 'Invalid email or password' }));
    renderLogin();
    submit('wrong');

    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveValue(EMAIL);
    expect(screen.getByLabelText(/password/i)).toHaveValue('wrong');
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeEnabled();
    expect(loginCalls().map((c) => c.url)).toEqual(['/api/auth/login']);
    expect(toLogin).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });
});
