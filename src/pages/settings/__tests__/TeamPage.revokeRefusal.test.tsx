import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import TeamPage from '../TeamPage';

/** Dispatch 27 Nov 2026 evening, A (ActionResult's remaining pages): a
 * refused Revoke answers beside the Revoke that was pressed, as the one
 * result shape every action uses — an alert, the server's words. */

const day = 24 * 60 * 60 * 1000;
const invitations = [
  { id: 'live', invited_email: 'live@example.com', role: 'end_user', expires_at: new Date(Date.now() + 5 * day).toISOString(), accepted_at: null, revoked_at: null },
  { id: 'live2', invited_email: 'other@example.com', role: 'end_user', expires_at: new Date(Date.now() + 5 * day).toISOString(), accepted_at: null, revoked_at: null },
];
const revokeInvitation = vi.fn(() => Promise.reject(new Error('This invitation was accepted a minute ago; it cannot be revoked.')));
vi.mock('../../../api/team', () => ({
  listMembers: vi.fn(() => Promise.resolve([])),
  listInvitations: vi.fn(() => Promise.resolve(invitations)),
  inviteMember: vi.fn(),
  revokeInvitation: () => revokeInvitation(),
  clearExpiredInvitation: vi.fn(),
  updateMember: vi.fn(),
}));

describe('TeamPage — a refused Revoke', () => {
  it('shows the refusal beside the Revoke that was pressed, on that row only', async () => {
    render(
      <MemoryRouter>
        <TeamPage />
      </MemoryRouter>,
    );
    const pending = (await screen.findByText('Pending Invitations')).closest('div')!;
    const rows = within(pending).getAllByRole('button', { name: 'Revoke' });
    expect(rows).toHaveLength(2);
    await userEvent.click(rows[1]);
    const refusal = await within(pending).findByTestId('revoke-refusal');
    expect(refusal).toHaveAttribute('role', 'alert');
    expect(refusal).toHaveAttribute('data-result', 'refused');
    expect(refusal).toHaveTextContent('This invitation was accepted a minute ago; it cannot be revoked.');
    expect(refusal.closest('div[class*="rounded-md"]')!.textContent).toContain('other@example.com');
    expect(within(pending).getAllByTestId('revoke-refusal')).toHaveLength(1);
  });
});
