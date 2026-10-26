import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../LoginPage';

// Ruling 2026-10-26 (item 4): the sign-in page a hotel buyer reaches from a
// portal carries no "create a free account" offer; the print-shop entry
// point keeps it.

let remembered: string | null = null;
vi.mock('../../contexts/AuthContext', () => ({ useAuth: () => ({ login: vi.fn() }) }));
vi.mock('../../hooks/usePostLoginRedirect', () => ({ usePostLoginRedirect: () => vi.fn() }));
vi.mock('../../lib/portalSession', async () => {
  const actual = await vi.importActual<typeof import('../../lib/portalSession')>('../../lib/portalSession');
  return { ...actual, lastPortalSlug: () => remembered, rememberSignedInEmail: vi.fn() };
});

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LoginPage />
    </MemoryRouter>,
  );
}

describe('LoginPage signup offer', () => {
  beforeEach(() => {
    remembered = null;
  });

  it('is hidden when the buyer arrives from a portal', () => {
    renderAt('/login?next=/p/raphael');
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.queryByText(/New to Teaky/)).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Create a free account' })).not.toBeInTheDocument();
  });

  it('is hidden when a portal is remembered from an earlier visit', () => {
    remembered = 'raphael';
    renderAt('/login');
    expect(screen.queryByRole('link', { name: 'Create a free account' })).not.toBeInTheDocument();
  });

  it('stays for a visitor with no portal context', () => {
    renderAt('/login');
    expect(screen.getByRole('link', { name: 'Create a free account' })).toHaveAttribute('href', '/register');
  });
});
