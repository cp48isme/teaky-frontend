import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ResetPasswordPage from '../ResetPasswordPage';
import { readResetFragment } from '../../lib/resetLink';

// Forgot-password step two (29 Oct 2026): the token comes from the fragment,
// a good token sets the password, and an expired link offers a fresh one in
// one click with nothing retyped.

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

function calls() {
  return vi.mocked(fetch).mock.calls.map((c) => {
    const [url, init] = c as [string, RequestInit];
    return { url, body: JSON.parse((init.body as string) || '{}'), authorization: (init.headers as Record<string, string>)['Authorization'] };
  });
}

function renderWithHash(hash: string) {
  window.location.hash = hash;
  return render(
    <MemoryRouter initialEntries={['/reset-password']}>
      <ResetPasswordPage />
    </MemoryRouter>,
  );
}

describe('readResetFragment', () => {
  it('reads token, email and portal from the fragment', () => {
    expect(readResetFragment('#token=abc&email=a%40b.c&portal=raphael')).toEqual({ token: 'abc', email: 'a@b.c', portal: 'raphael' });
    expect(readResetFragment('')).toEqual({ token: '', email: '', portal: '' });
  });
});

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('access_token', 'stale.access.token');
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    window.location.hash = '';
  });

  it('sets the password with the fragment token, sends no bearer, and says other devices sign out', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(200, { detail: 'Your password is updated. Any other device signs out within 15 minutes and cannot sign back in without the new password.', sessions_ended: 2 }));
    renderWithHash('#token=good-token-value-1234&email=jeni%40example.com&portal=raphael');
    fireEvent.change(screen.getByLabelText('New password'), { target: { value: 'new-password-9' } });
    fireEvent.change(screen.getByLabelText('Confirm new password'), { target: { value: 'new-password-9' } });
    fireEvent.click(screen.getByRole('button', { name: 'Set new password' }));

    expect(await screen.findByText('Password updated')).toBeInTheDocument();
    expect(screen.getByText(/Any other device signs out within 15 minutes/)).toBeInTheDocument();
    expect(calls()).toEqual([{ url: '/api/auth/password-reset/confirm', body: { token: 'good-token-value-1234', new_password: 'new-password-9' }, authorization: undefined }]);
    expect(screen.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/login?next=%2Fp%2Fraphael');
  });

  it('refuses mismatched passwords before calling anything', () => {
    renderWithHash('#token=good-token-value-1234&email=jeni%40example.com');
    fireEvent.change(screen.getByLabelText('New password'), { target: { value: 'new-password-9' } });
    fireEvent.change(screen.getByLabelText('Confirm new password'), { target: { value: 'different-9' } });
    fireEvent.click(screen.getByRole('button', { name: 'Set new password' }));
    expect(screen.getByText('The two passwords do not match.')).toBeInTheDocument();
    expect(calls()).toEqual([]);
  });

  it('an expired link offers a fresh one in one click, with nothing retyped', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(jsonResponse(400, { detail: 'This reset link is invalid or has expired.' }))
      .mockResolvedValueOnce(jsonResponse(202, { detail: 'If that address has an account, a reset link is on its way.' }));
    renderWithHash('#token=old-token-value-1234&email=jeni%40example.com&portal=raphael');
    fireEvent.change(screen.getByLabelText('New password'), { target: { value: 'new-password-9' } });
    fireEvent.change(screen.getByLabelText('Confirm new password'), { target: { value: 'new-password-9' } });
    fireEvent.click(screen.getByRole('button', { name: 'Set new password' }));

    const resend = await screen.findByRole('button', { name: 'Send me a new link' });
    expect(screen.getByText('This link has expired')).toBeInTheDocument();
    fireEvent.click(resend);

    await waitFor(() => expect(screen.getByText('A new link is on its way')).toBeInTheDocument());
    expect(calls()[1]).toEqual({ url: '/api/auth/password-reset/request', body: { email: 'jeni@example.com', portal_slug: 'raphael' }, authorization: undefined });
  });

  it('with no token in the fragment it sends the person to request one', () => {
    renderWithHash('');
    expect(screen.getByText('This link has expired')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Request a new link' })).toHaveAttribute('href', '/forgot-password');
  });
});
