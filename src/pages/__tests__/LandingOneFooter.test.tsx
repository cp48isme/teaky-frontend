import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import LandingPage from '../LandingPage';

/** Dispatch 27 Nov 2026 evening, A: the landing page carried two footers —
 * its own Privacy / Terms / Contact row and the site footer under it. One
 * footer now: the site footer's five links, the mark and the copyright. */

vi.mock('../../api/auth', () => ({ getSignupAvailability: () => Promise.resolve({ public_signup_enabled: false }) }));
vi.mock('../../contexts/AuthContext', () => ({ useAuth: () => ({ login: vi.fn() }) }));
vi.mock('../../hooks/usePostLoginRedirect', () => ({ usePostLoginRedirect: () => vi.fn() }));
vi.mock('../../api/client', async (importOriginal) => ({ ...(await importOriginal<typeof import('../../api/client')>()), isAuthenticated: () => false }));

describe('the landing page footer', () => {
  it('has one Privacy, one Terms and one Contact link, all in the site footer', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <LandingPage />
      </MemoryRouter>,
    );
    expect(screen.getAllByTestId('site-footer')).toHaveLength(1);
    expect(screen.getAllByRole('link', { name: 'Privacy' })).toHaveLength(1);
    expect(screen.getAllByRole('link', { name: 'Terms' })).toHaveLength(1);
    expect(screen.getAllByRole('link', { name: /Contact/ })).toHaveLength(1);
    const footer = screen.getByTestId('site-footer');
    expect(Array.from(footer.querySelectorAll('a')).map((a) => a.textContent)).toEqual(['Privacy', 'Terms', 'Help', 'Contact Teaky', 'Report a bug']);
  });
});
