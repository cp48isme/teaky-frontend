import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TeamPage from '../TeamPage';

/** Walk of rev 46 (23 Nov 2026, t10 b): the Team page no longer removes a
 * member directly — removing, deactivating and changing a role are proposals
 * with a reason on the Admin page, which each row links to. */

const updateMember = vi.fn();
vi.mock('../../../api/team', () => ({
  listMembers: vi.fn(() => Promise.resolve([{ user_id: 'u-other', email: 'other@example.com', display_name: 'Other Person', roles: ['sales_rep'], portal_assignments: [] }])),
  listInvitations: vi.fn(() => Promise.resolve([])),
  inviteMember: vi.fn(),
  revokeInvitation: vi.fn(),
  updateMember: (...args: unknown[]) => updateMember(...args),
}));

describe('TeamPage — member acts', () => {
  beforeEach(() => updateMember.mockReset().mockResolvedValue({}));

  // Ruled 26 Nov 2026 (evening): the direct member routes that duplicate
  // Settings → Admin are closed; Edit changes the display name only and the
  // role is a link to Settings → Admin.
  it('Edit changes the display name only; the role is a link to Settings → Admin, and nothing sends a role', async () => {
    render(
      <MemoryRouter>
        <TeamPage />
      </MemoryRouter>,
    );
    const row = (await screen.findByText('other@example.com')).closest('tr')!;
    await userEvent.click(within(row).getByRole('button', { name: 'Edit' }));
    expect(within(row).queryByRole('combobox')).not.toBeInTheDocument();
    expect(within(row).getByTestId('change-role-in-admin-u-other')).toHaveAttribute('href', '/settings/admin');
    expect(within(row).getByText('Sales rep')).toBeInTheDocument();
    const name = within(row).getByRole('textbox');
    await userEvent.clear(name);
    await userEvent.type(name, 'Someone Else');
    await userEvent.click(within(row).getByRole('button', { name: 'Save' }));
    expect(updateMember).toHaveBeenCalledWith('u-other', { display_name: 'Someone Else' });
  });

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
