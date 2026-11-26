import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AdminPage, { invitationExpired } from '../AdminPage';
import { clearSession, setSession } from '../../../api/client';
import { roleLabel } from '../../../lib/roles';
import type { AdminMember, AdminSettings } from '../../../types/adminSurface';
import type { Invitation } from '../../../types/team';

/** Walk C5 (26 Nov 2026): the sandbox's three expired invitations (15 and 20
 * Oct, never accepted, never revoked) rendered as pending with Resend and
 * Revoke; roles rendered as codes. An invitation past expires_at is Expired
 * with no proposal buttons; every role reads in words. */

const ME = 'u-me';

function token(roles: string[], sub = ME): string {
  const payload = btoa(JSON.stringify({ sub, roles, org: 'o1' })).replace(/=+$/, '');
  return `h.${payload}.s`;
}

const members: AdminMember[] = [
  { user_id: ME, email: 'me@shop.test', display_name: 'Me Admin', roles: ['printer_admin'], portal_assignments: [], reports_to: null, assigned_at: '2026-11-01T00:00:00Z', is_active: true, last_sign_in_at: '2026-11-19T10:00:00Z', open_sessions: 1 },
  { user_id: 'u-buyer', email: 'buyer@hotel.test', display_name: 'A Buyer', roles: ['end_user'], portal_assignments: [], reports_to: null, assigned_at: '2026-11-02T00:00:00Z', is_active: true, last_sign_in_at: null, open_sessions: 0 },
  { user_id: 'u-shadow', email: 'shadow@teaky.test', display_name: 'Shadow', roles: ['shadow_reader', 'sales_team_lead'], portal_assignments: [], reports_to: null, assigned_at: '2026-11-02T00:00:00Z', is_active: true, last_sign_in_at: null, open_sessions: 0 },
];

const invitation = (over: Partial<Invitation>): Invitation => ({
  id: 'inv-live', organization_id: 'o1', invited_email: 'live@shop.test', invited_by: ME, role: 'sales_rep', portal_ids: [],
  expires_at: '2099-01-01T00:00:00Z', accepted_at: null, revoked_at: null, created_at: '2026-11-19T00:00:00Z', updated_at: '2026-11-19T00:00:00Z', ...over,
});
const invitations: Invitation[] = [
  invitation({}),
  invitation({ id: 'inv-old-1', invited_email: 'buyer1@hotel.test', role: 'end_user', expires_at: '2026-10-15T00:00:00Z', created_at: '2026-10-08T00:00:00Z' }),
  invitation({ id: 'inv-old-2', invited_email: 'buyer2@hotel.test', role: 'end_user', expires_at: '2026-10-15T00:00:00Z', created_at: '2026-10-08T00:00:00Z' }),
  invitation({ id: 'inv-old-3', invited_email: 'reader@teaky.test', role: 'shadow_reader', expires_at: '2026-10-20T00:00:00Z', created_at: '2026-10-13T00:00:00Z' }),
];
const settings: AdminSettings = { require_second_approver_floor: false, require_second_approver_admin: false };

vi.mock('../../../api/adminSurface', () => ({
  listAdminMembers: vi.fn(() => Promise.resolve(members)),
  getAdminSettings: vi.fn(() => Promise.resolve(settings)),
  updateAdminSettings: vi.fn((body: AdminSettings) => Promise.resolve(body)),
  listAdminProposals: vi.fn(() => Promise.resolve([])),
  proposeAdminAction: vi.fn(),
  approveAdminProposal: vi.fn(),
  declineAdminProposal: vi.fn(),
}));
vi.mock('../../../api/team', () => ({
  listInvitations: vi.fn(() => Promise.resolve(invitations)),
}));

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/settings/admin']}>
      <AdminPage />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  clearSession();
  setSession({ access_token: token(['printer_admin']), token_type: 'bearer', expires_in: 900 });
});

describe('role words', () => {
  it('every role code reads as words; an unknown code reads as its words', () => {
    expect(roleLabel('end_user')).toBe('Buyer');
    expect(roleLabel('portal_admin')).toBe('Portal admin');
    expect(roleLabel('sub_portal_admin')).toBe('Portal sub-admin');
    expect(roleLabel('printer_admin')).toBe('Printer admin');
    expect(roleLabel('sales_rep')).toBe('Sales rep');
    expect(roleLabel('sales_team_lead')).toBe('Sales team lead');
    expect(roleLabel('store_creator')).toBe('Store creator');
    expect(roleLabel('shadow_reader')).toBe('Shadow reader');
    expect(roleLabel('billing_contact')).toBe('Billing contact');
    expect(roleLabel('super_admin')).toBe('Teaky admin');
    expect(roleLabel('some_new_role')).toBe('some new role');
    expect(roleLabel(null)).toBe('—');
  });

  it('an invitation is expired once expires_at is at or before now', () => {
    const now = Date.parse('2026-11-26T12:00:00Z');
    expect(invitationExpired({ expires_at: '2026-10-15T00:00:00Z' }, now)).toBe(true);
    expect(invitationExpired({ expires_at: '2026-11-26T12:00:00Z' }, now)).toBe(true);
    expect(invitationExpired({ expires_at: '2026-11-27T00:00:00Z' }, now)).toBe(false);
    expect(invitationExpired({ expires_at: 'not a date' }, now)).toBe(false);
  });
});

describe('the Admin page states', () => {
  it('says in one sentence what the page is for', async () => {
    renderPage();
    expect(await screen.findByTestId('admin-purpose')).toHaveTextContent(/proposed with a reason and takes effect when approved/);
  });

  it('an expired invitation renders as Expired with no Resend or Revoke; the live one keeps both', async () => {
    renderPage();
    const live = within(await screen.findByTestId('invitation-inv-live'));
    expect(live.getByRole('button', { name: 'Resend' })).toBeInTheDocument();
    expect(live.getByRole('button', { name: 'Revoke' })).toBeInTheDocument();
    expect(screen.getByTestId('invitation-inv-live')).toHaveAttribute('data-state', 'pending');
    expect(screen.getByTestId('admin-invitations')).not.toContainElement(screen.getByTestId('invitation-inv-old-1'));
    for (const id of ['inv-old-1', 'inv-old-2', 'inv-old-3']) {
      const row = screen.getByTestId(`invitation-${id}`);
      expect(row).toHaveAttribute('data-state', 'expired');
      expect(within(row).getByText('Expired')).toBeInTheDocument();
      expect(within(row).queryByRole('button', { name: /resend|revoke/i })).toBeNull();
    }
    expect(screen.getByTestId('admin-expired-invitations')).toHaveTextContent(/nothing to resend or revoke/);
    // Ruled 26 Nov afternoon (item 5): one-click Clear per C6, once per expired row.
    expect(screen.getAllByRole('button', { name: 'Clear' })).toHaveLength(3);
  });

  it('roles read as words on the invitations and in the members list', async () => {
    renderPage();
    expect(within(await screen.findByTestId('invitation-inv-live')).getByText('Sales rep')).toBeInTheDocument();
    expect(within(screen.getByTestId('invitation-inv-old-1')).getByText('Buyer')).toBeInTheDocument();
    expect(within(screen.getByTestId('invitation-inv-old-3')).getByText('Shadow reader')).toBeInTheDocument();
    expect(within(screen.getByTestId('member-u-me')).getByTestId('member-roles')).toHaveTextContent('Printer admin');
    expect(within(screen.getByTestId('member-u-buyer')).getByTestId('member-roles')).toHaveTextContent('Buyer');
    expect(within(screen.getByTestId('member-u-shadow')).getByTestId('member-roles')).toHaveTextContent('Shadow reader, Sales team lead');
  });
});
