import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TeamPage from '../TeamPage';

// Cause 3 (30 Oct 2026): an invitation past its expiry rendered as Pending
// with a Revoke button. It is now listed apart as expired, with no button.

const day = 24 * 60 * 60 * 1000;
const invitations = [
  { id: 'live', invited_email: 'live@example.com', role: 'end_user', expires_at: new Date(Date.now() + 5 * day).toISOString(), accepted_at: null, revoked_at: null },
  { id: 'old', invited_email: 'old@example.com', role: 'end_user', expires_at: new Date(Date.now() - 9 * day).toISOString(), accepted_at: null, revoked_at: null },
  { id: 'done', invited_email: 'done@example.com', role: 'end_user', expires_at: new Date(Date.now() + 5 * day).toISOString(), accepted_at: '2026-10-20T00:00:00Z', revoked_at: null },
];
const revokeInvitation = vi.fn().mockResolvedValue(undefined);
const clearExpiredInvitation = vi.fn();
vi.mock('../../../api/team', () => ({
  listMembers: vi.fn(() => Promise.resolve([])),
  listInvitations: vi.fn(() => Promise.resolve(invitations)),
  inviteMember: vi.fn(),
  revokeInvitation: (...args: unknown[]) => revokeInvitation(...args),
  clearExpiredInvitation: (...args: unknown[]) => clearExpiredInvitation(...args),
  updateMember: vi.fn(),
}));

describe('TeamPage — invitations', () => {
  beforeEach(() => {
    revokeInvitation.mockClear();
    clearExpiredInvitation.mockReset().mockImplementation((id: string) =>
      Promise.resolve({ ...invitations.find((inv) => inv.id === id)!, revoked_at: '2026-11-26T16:13:00Z' }),
    );
  });

  // Walk C6 (26 Nov 2026): an expired invitation needs no proposal — one click clears it.
  it('clears an expired invitation in one click and the row reads Cleared', async () => {
    render(
      <MemoryRouter>
        <TeamPage />
      </MemoryRouter>,
    );
    const expired = (await screen.findByText('Expired Invitations')).closest('div')!;
    await userEvent.click(within(expired).getByRole('button', { name: 'Clear' }));
    expect(clearExpiredInvitation).toHaveBeenCalledWith('old');
    expect(await within(expired).findByTestId('cleared-old')).toHaveTextContent('Cleared');
    expect(within(expired).queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
    expect(revokeInvitation).not.toHaveBeenCalled();
  });

  it('lists a live invitation as pending with Revoke, and an expired one apart with no button', async () => {
    render(
      <MemoryRouter>
        <TeamPage />
      </MemoryRouter>,
    );
    const pending = (await screen.findByText('Pending Invitations')).closest('div')!;
    expect(within(pending).getByText('live@example.com')).toBeInTheDocument();
    expect(within(pending).queryByText('old@example.com')).not.toBeInTheDocument();
    expect(within(pending).getByRole('button', { name: 'Revoke' })).toBeInTheDocument();

    const expired = screen.getByText('Expired Invitations').closest('div')!;
    expect(within(expired).getByText('old@example.com')).toBeInTheDocument();
    expect(within(expired).queryByRole('button', { name: 'Revoke' })).not.toBeInTheDocument();
    expect(within(expired).getByText('Expired')).toBeInTheDocument();
    expect(screen.queryByText('done@example.com')).not.toBeInTheDocument();
  });

  it('revokes a pending invitation through the action', async () => {
    render(
      <MemoryRouter>
        <TeamPage />
      </MemoryRouter>,
    );
    await userEvent.click(await screen.findByRole('button', { name: 'Revoke' }));
    expect(revokeInvitation).toHaveBeenCalledWith('live');
  });
});
