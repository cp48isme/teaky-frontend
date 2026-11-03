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
vi.mock('../../../api/team', () => ({
  listMembers: vi.fn(() => Promise.resolve([])),
  listInvitations: vi.fn(() => Promise.resolve(invitations)),
  inviteMember: vi.fn(),
  revokeInvitation: (...args: unknown[]) => revokeInvitation(...args),
  removeMember: vi.fn(),
  updateMember: vi.fn(),
}));

describe('TeamPage — invitations', () => {
  beforeEach(() => revokeInvitation.mockClear());

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
