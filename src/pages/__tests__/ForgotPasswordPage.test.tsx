import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ForgotPasswordPage from '../ForgotPasswordPage';

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ForgotPasswordPage />
    </MemoryRouter>,
  );
}

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('fetch', vi.fn());
  });
  afterEach(() => vi.unstubAllGlobals());

  it('prefills the address, sends the portal context, and shows one sentence whatever the answer', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(202, { detail: 'If that address has an account, a reset link is on its way.' }));
    renderAt('/forgot-password?email=jeni%40example.com&next=%2Fp%2Fraphael');
    expect(screen.getByLabelText('Email')).toHaveValue('jeni@example.com');
    fireEvent.click(screen.getByRole('button', { name: 'Email me a reset link' }));

    expect(await screen.findByText(/a reset link is on its way/)).toBeInTheDocument();
    const [url, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/auth/password-reset/request');
    expect(JSON.parse(init.body as string)).toEqual({ email: 'jeni@example.com', portal_slug: 'raphael' });
    expect(screen.getByRole('link', { name: 'Back to sign in' })).toHaveAttribute('href', '/login?next=%2Fp%2Fraphael');
  });

  it('says nothing different for an unknown address', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(202, { detail: 'If that address has an account, a reset link is on its way.' }));
    renderAt('/forgot-password');
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'nobody@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Email me a reset link' }));
    expect(await screen.findByText(/a reset link is on its way/)).toBeInTheDocument();
    expect(screen.queryByText(/no account/i)).not.toBeInTheDocument();
  });
});
