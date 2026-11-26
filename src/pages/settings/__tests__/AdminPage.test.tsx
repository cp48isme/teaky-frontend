import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ApiError, clearSession, setSession } from '../../../api/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminPage from '../AdminPage';
import SettingsLayout from '../SettingsLayout';
import type { AdminMember, AdminProposal, AdminSettings } from '../../../types/adminSurface';

// The shop admin surface (t03, ruled 19 Nov 2026): every act is a proposal
// with a reason; never on oneself; the guards' refusals are shown as the
// server words them; the two switches; nothing for a non-admin.
// Walk C6 (26 Nov 2026): a refusal is shown beside the Propose button and the
// form stays; an expired invitation reads Expired with a one-click Clear.

const ME = 'u-me';
const OTHER = 'u-other';

function token(roles: string[], sub = ME): string {
  const payload = btoa(JSON.stringify({ sub, roles, org: 'o1' })).replace(/=+$/, '');
  return `h.${payload}.s`;
}

const members: AdminMember[] = [
  { user_id: ME, email: 'me@shop.test', display_name: 'Me Admin', roles: ['printer_admin'], portal_assignments: [], reports_to: null, assigned_at: '2026-11-01T00:00:00Z', is_active: true, last_sign_in_at: '2026-11-19T10:00:00Z', open_sessions: 1 },
  { user_id: OTHER, email: 'other@shop.test', display_name: 'Other Person', roles: ['sales_rep'], portal_assignments: [], reports_to: null, assigned_at: '2026-11-02T00:00:00Z', is_active: true, last_sign_in_at: null, open_sessions: 0 },
];
const invitations = [
  { id: 'inv-1', organization_id: 'o1', invited_email: 'pending@shop.test', invited_by: ME, role: 'sales_rep', portal_ids: [], expires_at: '2099-01-01T00:00:00Z', accepted_at: null, revoked_at: null, created_at: '2026-11-19T00:00:00Z', updated_at: '2026-11-19T00:00:00Z' },
  { id: 'inv-2', organization_id: 'o1', invited_email: 'expired@shop.test', invited_by: ME, role: 'sales_rep', portal_ids: [], expires_at: '2026-10-15T09:00:00Z', accepted_at: null, revoked_at: null, created_at: '2026-10-08T00:00:00Z', updated_at: '2026-10-08T00:00:00Z' },
];
const EXPIRED_REFUSAL = 'This invitation expired on 2026-10-15; clear it from the Team page (an expired invitation needs no proposal to revoke it)';
let settings: AdminSettings = { require_second_approver_floor: false, require_second_approver_admin: false };
let proposals: AdminProposal[] = [];

const api = {
  listAdminMembers: vi.fn(() => Promise.resolve(members)),
  getAdminSettings: vi.fn(() => Promise.resolve(settings)),
  updateAdminSettings: vi.fn((body: AdminSettings) => { settings = body; return Promise.resolve(body); }),
  listAdminProposals: vi.fn(() => Promise.resolve(proposals)),
  proposeAdminAction: vi.fn(),
  approveAdminProposal: vi.fn(),
  declineAdminProposal: vi.fn(),
};
vi.mock('../../../api/adminSurface', () => ({
  listAdminMembers: (...a: unknown[]) => api.listAdminMembers(...(a as [])),
  getAdminSettings: (...a: unknown[]) => api.getAdminSettings(...(a as [])),
  updateAdminSettings: (...a: unknown[]) => api.updateAdminSettings(...(a as [AdminSettings])),
  listAdminProposals: (...a: unknown[]) => api.listAdminProposals(...(a as [])),
  proposeAdminAction: (...a: unknown[]) => api.proposeAdminAction(...(a as [])),
  approveAdminProposal: (...a: unknown[]) => api.approveAdminProposal(...(a as [])),
  declineAdminProposal: (...a: unknown[]) => api.declineAdminProposal(...(a as [])),
}));
const teamApi = {
  clearExpiredInvitation: vi.fn(),
};
vi.mock('../../../api/team', () => ({
  listInvitations: vi.fn(() => Promise.resolve(invitations)),
  clearExpiredInvitation: (...a: unknown[]) => teamApi.clearExpiredInvitation(...(a as [string])),
}));

function proposal(overrides: Partial<AdminProposal> = {}): AdminProposal {
  return {
    id: 'p-1', organization_id: 'o1', kind: 'deactivate_member', target_kind: 'member', target_id: OTHER,
    reason: 'left the company', note: '', new_role: null,
    facts: { captured_at: '2026-11-19T11:00:00Z', target_kind: 'member', target_id: OTHER, member: { user_id: OTHER, email: 'other@shop.test', display_name: 'Other Person', roles: ['sales_rep'], is_active: true, last_sign_in_at: null, open_sessions: 0 }, invitation: null, new_role: null },
    status: 'proposed', proposed_by: ME, proposed_at: '2026-11-19T11:00:00Z', decided_by: null, decided_at: null, decision_note: '', result: null, failure: '',
    ...overrides,
  };
}

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/settings/admin']}>
      <AdminPage />
    </MemoryRouter>,
  );
}

describe('AdminPage', () => {
  beforeEach(() => {
  clearSession();
    setSession({ access_token: token(['printer_admin']), token_type: 'bearer', expires_in: 900 });
    settings = { require_second_approver_floor: false, require_second_approver_admin: false };
    proposals = [];
    Object.values(api).forEach((fn) => fn.mockClear());
    api.proposeAdminAction.mockResolvedValue(proposal());
    api.approveAdminProposal.mockResolvedValue(proposal({ status: 'approved' }));
    teamApi.clearExpiredInvitation.mockReset().mockImplementation((id: string) =>
      Promise.resolve({ ...invitations.find((inv) => inv.id === id)!, revoked_at: '2026-11-26T16:13:00Z' }),
    );
    api.declineAdminProposal.mockResolvedValue(proposal({ status: 'declined' }));
  });

  it('shows members with roles, active state, last sign-in and sessions, and never offers acts on oneself', async () => {
    renderPage();
    const me = within(await screen.findByTestId(`member-${ME}`));
    expect(me.getByText('Me Admin (you)')).toBeInTheDocument();
    expect(me.getByTestId('never-on-oneself')).toBeInTheDocument();
    expect(me.queryByRole('button', { name: 'Deactivate' })).not.toBeInTheDocument();
    const other = within(screen.getByTestId(`member-${OTHER}`));
    expect(other.getByText('sales_rep')).toBeInTheDocument();
    expect(other.getByText('Yes')).toBeInTheDocument();
    expect(other.getByText('—')).toBeInTheDocument(); // no sign-in yet
    expect(other.getByRole('button', { name: 'Deactivate' })).toBeInTheDocument();
    expect(other.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
    expect(other.getByRole('button', { name: 'Change role' })).toBeInTheDocument();
  });

  it('a deactivate is a proposal with a reason; nothing is sent before the reason and the click', async () => {
    renderPage();
    await userEvent.click(within(await screen.findByTestId(`member-${OTHER}`)).getByRole('button', { name: 'Deactivate' }));
    const form = within(screen.getByTestId('propose-form'));
    expect(form.getByText(/Deactivate: Other Person/)).toBeInTheDocument();
    expect(form.getByText(/ends every session now and blocks sign-in/)).toBeInTheDocument();
    expect(form.getByTestId('propose-submit')).toBeDisabled();
    expect(api.proposeAdminAction).not.toHaveBeenCalled();
    await userEvent.type(form.getByLabelText('Reason'), 'left the company');
    await userEvent.click(form.getByTestId('propose-submit'));
    expect(api.proposeAdminAction).toHaveBeenCalledWith({ kind: 'deactivate_member', target_kind: 'member', target_id: OTHER, reason: 'left the company' });
  });

  it('a role change names the new role; an invitation resend and revoke are proposals too', async () => {
    renderPage();
    await userEvent.click(within(await screen.findByTestId(`member-${OTHER}`)).getByRole('button', { name: 'Change role' }));
    await userEvent.selectOptions(screen.getByLabelText('New role'), 'sales_team_lead');
    await userEvent.type(screen.getByLabelText('Reason'), 'promoted');
    await userEvent.click(screen.getByTestId('propose-submit'));
    expect(api.proposeAdminAction).toHaveBeenLastCalledWith({ kind: 'change_role', target_kind: 'member', target_id: OTHER, reason: 'promoted', new_role: 'sales_team_lead' });
    await userEvent.click(within(screen.getByTestId('invitation-inv-1')).getByRole('button', { name: 'Resend' }));
    await userEvent.type(screen.getByLabelText('Reason'), 'bounced');
    await userEvent.click(screen.getByTestId('propose-submit'));
    expect(api.proposeAdminAction).toHaveBeenLastCalledWith({ kind: 'resend_invitation', target_kind: 'invitation', target_id: 'inv-1', reason: 'bounced' });
    await userEvent.click(within(screen.getByTestId('invitation-inv-1')).getByRole('button', { name: 'Revoke' }));
    await userEvent.type(screen.getByLabelText('Reason'), 'wrong address');
    await userEvent.click(screen.getByTestId('propose-submit'));
    expect(api.proposeAdminAction).toHaveBeenLastCalledWith({ kind: 'revoke_invitation', target_kind: 'invitation', target_id: 'inv-1', reason: 'wrong address' });
  });

  it("shows the guards' refusals as the server words them", async () => {
    api.proposeAdminAction.mockRejectedValueOnce(new Error("the shop's last printer_admin cannot be removed, deactivated or demoted"));
    renderPage();
    await userEvent.click(within(await screen.findByTestId(`member-${OTHER}`)).getByRole('button', { name: 'Remove' }));
    await userEvent.type(screen.getByLabelText('Reason'), 'leaving');
    await userEvent.click(screen.getByTestId('propose-submit'));
    expect(await screen.findByRole('alert')).toHaveTextContent("last printer_admin cannot be removed, deactivated or demoted");
  });

  it('a 409 is shown beside the Propose button in the server\'s words, and the form and reason stay', async () => {
    api.proposeAdminAction.mockRejectedValueOnce(new ApiError(409, EXPIRED_REFUSAL));
    renderPage();
    await userEvent.click(within(await screen.findByTestId(`member-${OTHER}`)).getByRole('button', { name: 'Remove' }));
    const form = within(screen.getByTestId('propose-form'));
    await userEvent.type(form.getByLabelText('Reason'), 'leaving');
    await userEvent.click(form.getByTestId('propose-submit'));
    expect(await form.findByTestId('propose-error')).toHaveTextContent(EXPIRED_REFUSAL);
    expect(screen.getByTestId('propose-form')).toBeInTheDocument();
    expect(form.getByLabelText('Reason')).toHaveValue('leaving');
    // A new attempt starts clean: the refusal goes when the form is opened again.
    await userEvent.click(form.getByRole('button', { name: 'Cancel' }));
    await userEvent.click(within(screen.getByTestId(`member-${OTHER}`)).getByRole('button', { name: 'Remove' }));
    expect(screen.queryByTestId('propose-error')).not.toBeInTheDocument();
  });

  it('a proposal that succeeds closes the form and clears the reason', async () => {
    renderPage();
    await userEvent.click(within(await screen.findByTestId(`member-${OTHER}`)).getByRole('button', { name: 'Deactivate' }));
    await userEvent.type(screen.getByLabelText('Reason'), 'left the company');
    await userEvent.click(screen.getByTestId('propose-submit'));
    await waitFor(() => expect(screen.queryByTestId('propose-form')).not.toBeInTheDocument());
    await userEvent.click(within(screen.getByTestId(`member-${OTHER}`)).getByRole('button', { name: 'Deactivate' }));
    expect(screen.getByLabelText('Reason')).toHaveValue('');
    expect(screen.queryByTestId('propose-error')).not.toBeInTheDocument();
  });

  it('an expired invitation reads Expired with Clear, not Resend or Revoke; Clear calls the route and the row reads Cleared', async () => {
    renderPage();
    const expired = within(await screen.findByTestId('invitation-inv-2'));
    expect(expired.getByText('Expired')).toBeInTheDocument();
    expect(expired.queryByRole('button', { name: 'Resend' })).not.toBeInTheDocument();
    expect(expired.queryByRole('button', { name: 'Revoke' })).not.toBeInTheDocument();
    const live = within(screen.getByTestId('invitation-inv-1'));
    expect(live.getByRole('button', { name: 'Resend' })).toBeInTheDocument();
    expect(live.getByRole('button', { name: 'Revoke' })).toBeInTheDocument();
    await userEvent.click(expired.getByRole('button', { name: 'Clear' }));
    expect(teamApi.clearExpiredInvitation).toHaveBeenCalledWith('inv-2');
    expect(await expired.findByTestId('cleared-inv-2')).toHaveTextContent('Cleared');
    expect(expired.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
    expect(api.proposeAdminAction).not.toHaveBeenCalled();
  });

  it('a Clear the server refuses says why on the row', async () => {
    teamApi.clearExpiredInvitation.mockRejectedValueOnce(new ApiError(409, 'This invitation is still live (it expires on 2026-12-03); revoke it through a proposal on the Admin page'));
    renderPage();
    const expired = within(await screen.findByTestId('invitation-inv-2'));
    await userEvent.click(expired.getByRole('button', { name: 'Clear' }));
    expect(await expired.findByRole('alert')).toHaveTextContent('still live');
    expect(expired.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('the ledger approves and declines; under the admin switch the proposer sees Withdraw', async () => {
    proposals = [proposal()];
    renderPage();
    const row = within(await screen.findByTestId('proposal-p-1'));
    expect(row.getByText(/Deactivate: Other Person/)).toBeInTheDocument();
    expect(row.getByText(/"left the company"/)).toBeInTheDocument();
    expect(row.getByTestId('decline')).toHaveTextContent('Decline');
    await userEvent.click(row.getByTestId('approve'));
    expect(api.approveAdminProposal).toHaveBeenCalledWith('p-1', '');
    settings = { require_second_approver_floor: false, require_second_approver_admin: true };
    proposals = [proposal({ id: 'p-2' })];
    renderPage();
    const mine = within(await screen.findByTestId('proposal-p-2'));
    expect(mine.getByTestId('decline')).toHaveTextContent('Withdraw');
    await userEvent.click(mine.getByTestId('decline'));
    expect(api.declineAdminProposal).toHaveBeenCalledWith('p-2', '');
  });

  it('the two switches are off by default and each saves on its own', async () => {
    renderPage();
    const floor = await screen.findByLabelText('Require a second approver on the floor');
    const admin = screen.getByLabelText('Require a second approver on admin acts');
    expect(floor).not.toBeChecked();
    expect(admin).not.toBeChecked();
    await userEvent.click(admin);
    expect(api.updateAdminSettings).toHaveBeenCalledWith({ require_second_approver_floor: false, require_second_approver_admin: true });
    await waitFor(() => expect(screen.getByLabelText('Require a second approver on admin acts')).toBeChecked());
  });

  it('a non-admin gets a line and no page; the Admin tab is hidden for them and shown for an admin', async () => {
    setSession({ access_token: token(['shadow_reader'], 'u-shadow'), token_type: 'bearer', expires_in: 900 });
    renderPage();
    expect(await screen.findByTestId('admin-no-access')).toBeInTheDocument();
    expect(screen.queryByTestId('admin-page')).not.toBeInTheDocument();
    expect(api.listAdminMembers).not.toHaveBeenCalled();
    render(<MemoryRouter initialEntries={['/settings/team']}><SettingsLayout /></MemoryRouter>);
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument();
    setSession({ access_token: token(['printer_admin']), token_type: 'bearer', expires_in: 900 });
    render(<MemoryRouter initialEntries={['/settings/team']}><SettingsLayout /></MemoryRouter>);
    expect(screen.getByRole('link', { name: 'Admin' })).toBeInTheDocument();
  });
});
