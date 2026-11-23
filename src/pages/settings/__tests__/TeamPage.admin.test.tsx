import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import TeamPage from '../TeamPage';

/** Walk of rev 46 (23 Nov 2026, t10 b): the Team page no longer removes a
 * member directly — removing, deactivating and changing a role are proposals
 * with a reason on the Admin page, which each row links to. */

vi.mock('../../../api/team', () => ({
  listMembers: vi.fn(() => Promise.resolve([{ user_id: 'u-other', email: 'other@example.com', display_name: 'Other Person', roles: ['sales_rep'], portal_assignments: [] }])),
  listInvitations: vi.fn(() => Promise.resolve([])),
  inviteMember: vi.fn(),
  revokeInvitation: vi.fn(),
  updateMember: vi.fn(),
}));

describe('TeamPage — member acts', () => {
  it('offers no direct Remove; the row links to the Admin page instead', async () => {
    render(
      <MemoryRouter>
        <TeamPage />
      </MemoryRouter>,
    );
    expect(await screen.findByText('other@example.com')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument();
    expect(screen.getByTestId('manage-in-admin-u-other')).toHaveAttribute('href', '/settings/admin');
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
  });
});
