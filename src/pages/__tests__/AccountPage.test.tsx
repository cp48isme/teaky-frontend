import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AccountPage from '../AccountPage';

/** /account (t01, 18 Nov 2026): the sessions list, change password through
 * the route with the fresh tokens kept, sign out, sign out everywhere. */

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => ({ ...(await vi.importActual<typeof import('react-router-dom')>('react-router-dom')), useNavigate: () => mockNavigate }));
const logout = vi.fn(() => Promise.resolve());
vi.mock('../../contexts/AuthContext', () => ({ useAuth: () => ({ logout }) }));
const listSessions = vi.fn(() => Promise.resolve([{ id: 's1', created_at: new Date(Date.now() - 120000).toISOString(), expires_at: '2026-11-25T10:00:00Z', current: false }, { id: 's2', created_at: new Date().toISOString(), expires_at: '2026-11-25T11:00:00Z', current: true }]));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const changePassword = vi.fn((_c: string, _n: string) => Promise.resolve({ access_token: 'a', refresh_token: 'r', token_type: 'bearer', expires_in: 900, other_sessions_ended: 1, credentials_changed_at: '2026-11-18T23:00:00Z' }));
const logoutAll = vi.fn(() => Promise.resolve());
vi.mock('../../api/auth', () => ({
  listSessions: () => listSessions(),
  changePassword: (...a: unknown[]) => changePassword(...(a as [string, string])),
  logoutAll: () => logoutAll(),
}));

function mount() {
  return render(
    <MemoryRouter initialEntries={['/account']}>
      <AccountPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('the account page', () => {
  it('lists the sessions and changes the password through the route, keeping this session', async () => {
    const user = userEvent.setup();
    mount();
    await waitFor(() => expect(screen.getByTestId('sessions').querySelectorAll('li').length).toBe(2));
    // The request's own session is marked (ruling 18 Nov 2026 evening), and only it.
    expect(Array.from(screen.getByTestId('sessions').querySelectorAll('li')).map((li) => li.getAttribute('data-current'))).toEqual(['false', 'true']);
    expect(screen.getByText('This session')).toBeTruthy();
    await user.type(screen.getByLabelText('Current password'), 'old-one');
    await user.type(screen.getByLabelText('New password'), 'Different-2026!y');
    await user.type(screen.getByLabelText('New password, again'), 'Different-2026!y');
    await user.click(screen.getByRole('button', { name: 'Change password' }));
    await waitFor(() => expect(changePassword).toHaveBeenCalledWith('old-one', 'Different-2026!y'));
    expect(await screen.findByRole('status')).toHaveTextContent('1 other session ended; this one keeps going');
    expect(listSessions).toHaveBeenCalledTimes(2);
  });

  it('refuses a confirmation that differs before calling anything', async () => {
    const user = userEvent.setup();
    mount();
    await user.type(screen.getByLabelText('Current password'), 'old-one');
    await user.type(screen.getByLabelText('New password'), 'Different-2026!y');
    await user.type(screen.getByLabelText('New password, again'), 'Different-2026!z');
    await user.click(screen.getByRole('button', { name: 'Change password' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('differ');
    expect(changePassword).not.toHaveBeenCalled();
  });

  it('signs out, and signs out everywhere, then lands on /login', async () => {
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole('button', { name: 'Sign out' }));
    await waitFor(() => expect(logout).toHaveBeenCalledTimes(1));
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    await user.click(screen.getByRole('button', { name: 'Sign out everywhere' }));
    await waitFor(() => expect(logoutAll).toHaveBeenCalledTimes(1));
  });
});
