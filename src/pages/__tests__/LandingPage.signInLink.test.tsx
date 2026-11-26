import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import LandingPage from '../LandingPage';

// Ruling 26 Nov 2026 item 10(b), bead hasx: one sign-in, one route. The landing
// page carries no sign-in form of its own; every "Sign in" on it is a link to /login.

vi.mock('../../hooks/usePostLoginRedirect', () => ({ usePostLoginRedirect: () => vi.fn() }));
vi.mock('../../hooks/useSignupAvailability', () => ({ useSignupAvailability: () => false }));
vi.mock('../../api/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../api/client')>()),
  isAuthenticated: () => false,
}));

describe('LandingPage — signed out', () => {
  it('renders no sign-in form', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );
    expect(screen.queryByTestId('sign-in-form')).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
  });

  it('links every "Sign in" to /login', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );
    const links = screen.getAllByRole('link', { name: /^sign in$/i });
    expect(links.length).toBeGreaterThanOrEqual(1);
    for (const link of links) expect(link).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('button', { name: /sign in/i })).not.toBeInTheDocument();
  });
});
