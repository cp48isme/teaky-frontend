import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import LandingPage from '../LandingPage';

/** hasx, the one case (overnight dispatch 26 Nov 2026, item 5): the landing
 * page carries no sign-in card; its primary "Sign in" is a button-styled link
 * to /login; the placeholder page is gone with its routes, so the footer
 * names only pages that exist (Privacy, Terms, Contact, and the site footer's
 * own links) — no About, no Security. */

vi.mock('../../hooks/usePostLoginRedirect', () => ({ usePostLoginRedirect: () => vi.fn() }));
vi.mock('../../hooks/useSignupAvailability', () => ({ useSignupAvailability: () => false }));
vi.mock('../../api/client', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../api/client')>()),
  isAuthenticated: () => false,
}));

describe('hasx: one sign-in, one route, no placeholder', () => {
  it('no sign-in card; "Sign in" goes to /login; the footer links only to pages that exist', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );
    expect(screen.queryByTestId('sign-in-form')).toBeNull();
    expect(screen.queryByLabelText(/password/i)).toBeNull();
    const signIns = screen.getAllByRole('link', { name: /^sign in$/i });
    expect(signIns.length).toBeGreaterThanOrEqual(1);
    for (const link of signIns) expect(link).toHaveAttribute('href', '/login');
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(hrefs).not.toContain('/about');
    expect(hrefs).not.toContain('/security');
    for (const page of ['/privacy', '/terms', '/contact']) expect(hrefs).toContain(page);
  });
});
