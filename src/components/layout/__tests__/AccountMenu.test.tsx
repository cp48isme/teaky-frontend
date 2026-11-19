import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AccountMenu from '../AccountMenu';
import { forgetSignedInDisplayName, forgetSignedInEmail, rememberSignedInDisplayName, rememberSignedInEmail } from '../../../lib/portalSession';

/** The avatar menu shows the person — display name and initials, else the
 * email — never the user id (dispatch 19 Nov 2026, account surface). */

const logout = vi.fn().mockResolvedValue(undefined);
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});
vi.mock('../../../contexts/AuthContext', () => ({ useAuth: () => ({ logout }), useOptionalAuth: () => ({ logout }) }));

const USER_ID = '9fb16ebc-7eb2-4504-ad2f-f67978c15785';
// An access token whose `sub` is the user id, as the real one is.
const TOKEN = `h.${btoa(JSON.stringify({ sub: USER_ID, org: 'o', roles: ['printer_admin'] }))}.s`;

function mount(showSettings = true) {
  return render(
    <MemoryRouter>
      <AccountMenu showSettings={showSettings} />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.setItem('access_token', TOKEN);
  forgetSignedInEmail();
  forgetSignedInDisplayName();
  logout.mockClear();
  mockNavigate.mockClear();
});

describe('the account menu', () => {
  it('shows the display name and its initials, with the email beneath, and never the user id', async () => {
    rememberSignedInEmail('andrew@example.com');
    rememberSignedInDisplayName('Andrew Hanlin');
    mount();
    expect(screen.getByTestId('account-avatar')).toHaveTextContent('AH');
    await userEvent.click(screen.getByTestId('account-avatar'));
    expect(screen.getByTestId('account-menu-name')).toHaveTextContent('Andrew Hanlin');
    expect(screen.getByTestId('account-menu-email')).toHaveTextContent('andrew@example.com');
    expect(document.body.textContent).not.toContain(USER_ID);
    expect(document.body.textContent).not.toContain('9fb16ebc');
  });

  it("falls back to the email's local part when no name is known, and still never the id", async () => {
    rememberSignedInEmail('front.desk@example.com');
    mount();
    expect(screen.getByTestId('account-avatar')).toHaveTextContent('FD');
    await userEvent.click(screen.getByTestId('account-avatar'));
    expect(screen.getByTestId('account-menu-name')).toHaveTextContent('front.desk');
    expect(screen.queryByTestId('account-menu-email')).toBeNull();
    expect(document.body.textContent).not.toContain(USER_ID);
  });

  it('with nothing remembered shows "?" and "Signed in", not the token subject', async () => {
    mount();
    expect(screen.getByTestId('account-avatar')).toHaveTextContent('?');
    await userEvent.click(screen.getByTestId('account-avatar'));
    expect(screen.getByTestId('account-menu-name')).toHaveTextContent('Signed in');
    expect(document.body.textContent).not.toContain(USER_ID);
  });

  it('offers Account, Settings and Sign out; Sign out ends the session and goes to /login', async () => {
    rememberSignedInEmail('staff@example.com');
    mount();
    await userEvent.click(screen.getByTestId('account-avatar'));
    expect(screen.getByRole('menuitem', { name: 'Account' })).toHaveAttribute('href', '/account');
    expect(screen.getByRole('menuitem', { name: 'Settings' })).toHaveAttribute('href', '/settings/team');
    await userEvent.click(screen.getByRole('menuitem', { name: 'Sign out' }));
    expect(logout).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('hides Settings when the shell says so (a read-only reader)', async () => {
    rememberSignedInEmail('reader@example.com');
    mount(false);
    await userEvent.click(screen.getByTestId('account-avatar'));
    expect(screen.getByRole('menuitem', { name: 'Account' })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: 'Settings' })).toBeNull();
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toBeInTheDocument();
  });
});
