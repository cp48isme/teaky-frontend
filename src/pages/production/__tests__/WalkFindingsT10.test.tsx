import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AccountPage from '../../AccountPage';
import AllChannelOrdersPage from '../AllChannelOrdersPage';
import BatchesPage from '../BatchesPage';
import ProductionLayout from '../../../components/production/ProductionLayout';
import ProposalsPanel from '../../../components/production/ProposalsPanel';
import { clearSession, setSession } from '../../../api/client';
import { resetCurrentUser } from '../../../lib/currentUser';
import { resetProductionShell } from '../../../hooks/useProductionShell';
import type { BatchSummary, PushOutPreview, TaylorPoolLine } from '../../../types/production';
import type { ActionProposal } from '../../../types/proposals';

/** Walk of rev 46 (23 Nov 2026, t10): (a) the production layout's account
 * menu shows the person's initials and name, and the account page's Back
 * returns to the previous page; (c) a proposal's notice names where it is
 * decided and links there, and an action can be proposed from inside a
 * batch; (d) a mark done applied elsewhere returns to Batches with its
 * notice; (e) a Lane column and filter on All Channel Orders; (f) proposals
 * named in words, filtered by action and by batch or order. */

function token(sub: string, roles: string[]): string {
  const b64 = (s: string) => btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${b64('{"alg":"none"}')}.${b64(JSON.stringify({ sub, roles }))}.sig`;
}

function batch(over: Partial<BatchSummary>): BatchSummary {
  return {
    unit_id: 'u-143', batch_number: 143, stock: '16 C2S', channel: 'press_run', used: 9, capacity: 24, blanks: 15, full: false, orders: 2, lines: 2, channels: ['press_run'],
    oldest_line_ref: 'W621723', oldest_line_age_seconds: 7 * 86400, release_state: null, docket_number: null, released_at: null, released_by_id: null, cancelled: false,
    fill_candidates: [], fillable_slots: 0, line_item_ids: [], ...over,
  };
}
const taylorLine = (over: Partial<TaylorPoolLine>): TaylorPoolLine =>
  ({
    id: 'l1', po: 'W7001', line_no: 1, product: 'PLU1020 Plus Book', quantity: 2, pack: 1, cards: 2, source_created_at: '2026-11-20T10:00:00Z', received_at: '2026-11-20T10:05:00Z',
    art_state: 'not_needed', art_error: null, lane: '', customer: 'Sprouts', held_by: [], stock: '', line_item_id: null, order_number: null, canonical_state: 'raw', canonical_error: null, ...over,
  }) as unknown as TaylorPoolLine;

const facts = (over: Partial<ActionProposal['facts']> = {}): ActionProposal['facts'] =>
  ({
    captured_at: '2026-11-23T01:00:00Z', target_kind: 'release_unit', target_id: 'u-143', reference: 'Batch 143', channel: 'press_run', customer: '', portal_id: null, business_entity_id: null,
    order_status: '', lines: 2, cards: 500, units: [], stock: '16 C2S', slots_used: 9, capacity: 24, half: false, open_holds: [], ...over,
  }) as ActionProposal['facts'];
const proposal = (over: Partial<ActionProposal>): ActionProposal =>
  ({
    id: 'p-done', organization_id: 'org', kind: 'mark_done', target_kind: 'release_unit', target_id: 'u-143', reason: 'finished by hand', category: null, note: '', facts: facts(), status: 'proposed',
    proposed_by: 'u-dana', proposed_at: '2026-11-23T01:00:00Z', decided_by: null, decided_at: null, decision_note: '', result: null, failure: '', ...over,
  }) as ActionProposal;
const markDone = proposal({});
const pushAlone = proposal({ id: 'p-alone', kind: 'push_alone', target_kind: 'order', target_id: 'o1', category: 'rush', reason: 'customer needs it Friday', facts: facts({ target_kind: 'order', target_id: 'o1', reference: 'W7001234' }) });

const listProposals = vi.fn(() => Promise.resolve([markDone, pushAlone]));
const proposeAction = vi.fn(() => Promise.resolve(pushAlone));
const approveProposal = vi.fn(() => Promise.resolve({ ...markDone, status: 'approved' }));
vi.mock('../../../api/proposals', () => ({
  listProposals: () => listProposals(),
  proposeAction: (...a: unknown[]) => proposeAction(...(a as [])),
  approveProposal: (...a: unknown[]) => approveProposal(...(a as [])),
  declineProposal: vi.fn(),
}));
vi.mock('../../../api/team', () => ({ listMembers: vi.fn(() => Promise.resolve([{ user_id: 'u-dana', email: 'dana@shop.example', display_name: 'Dana' }])) }));
const listTaylorPool = vi.fn(() => Promise.resolve([taylorLine({}), taylorLine({ id: 'l2', po: 'W7002', product: 'TAG-0042 Hang tag', lane: 'stocked_goods' })]));
vi.mock('../../../api/production', () => ({
  getProductionSettings: vi.fn(() => Promise.resolve({ production_view: 'cards' })),
  listBatches: vi.fn(() => Promise.resolve([batch({})])),
  listShopTags: vi.fn(() => Promise.resolve([])),
  markHalfBatch: vi.fn(),
  markBatchDone: vi.fn(() => Promise.resolve({ applied: true, reason: 'finished', units: [{ unit_id: 'u-143', batch_number: 143, steps_remaining: 0, steps_skipped: 1, marked_done_at: 'now' }] })),
  listTaylorPool: () => listTaylorPool(),
  getPushOutPreview: vi.fn(() =>
    Promise.resolve({
      unit_id: 'u-143', batch_number: 143, stock: '16 C2S', used: 24, capacity: 24, blanks: 0, orders: 7, lines: 9, docket_send_enabled: false, docket_host: null, existing_docket_number: null,
      payload: null, payload_xml: null, payload_sha256: null, payload_problem: 'docket customer not configured', files: [],
    } as unknown as PushOutPreview),
  ),
  pushOut: vi.fn(),
  updateOrder: vi.fn(),
}));
vi.mock('../../../api/orders', () => ({ listPrinterOrders: vi.fn(() => Promise.resolve([])), listShopTags: vi.fn(() => Promise.resolve([])), updateOrder: vi.fn() }));
vi.mock('../../../api/organizations', () => ({ getMyOrganization: vi.fn(() => Promise.resolve(null)), getProductionShell: vi.fn(() => Promise.resolve({ organization_id: 'o', name: 'Single Source US', mark: { url: 'https://app.example/logo.png', alt: 'Single Source US', source: 'shop_profile' } })) }));
vi.mock('../../../hooks/useSelfServeOnboarding', () => ({ useSelfServeOnboarding: () => ({ selfServe: false }) }));
const logout = vi.fn(() => Promise.resolve());
vi.mock('../../../contexts/AuthContext', () => ({ useAuth: () => ({ logout, ready: true, authenticated: true }), useOptionalAuth: () => ({ logout, ready: true, authenticated: true }) }));
vi.mock('../../../api/auth', () => ({
  getMe: () => Promise.resolve({ id: 'u-me', email: 'staff@example.com', display_name: 'Shop Staff', organization_id: 'o', roles: ['printer_admin'] }),
  logout: () => Promise.resolve(),
  listSessions: () => Promise.resolve([]),
  changePassword: vi.fn(),
  logoutAll: () => Promise.resolve(),
}));

function WhereAmI() {
  const location = useLocation();
  return <div data-testid="where">{location.pathname} · {(location.state as { notice?: string } | null)?.notice ?? ''}</div>;
}

beforeEach(() => {
  localStorage.clear();
  clearSession();
  resetCurrentUser();
  resetProductionShell();
  setSession({ access_token: token('u-me', ['printer_admin']), token_type: 'bearer', expires_in: 900 });
  listProposals.mockClear();
  proposeAction.mockClear();
  approveProposal.mockClear();
});

describe('(a) the production layout names the person; Back returns to the previous page', () => {
  it('shows the initials on the avatar and the name in the menu, from /auth/me', async () => {
    render(
      <MemoryRouter>
        <ProductionLayout readOnly={false}>
          <div>body</div>
        </ProductionLayout>
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getByTestId('account-avatar')).toHaveTextContent('SS'));
    await userEvent.click(screen.getByTestId('account-avatar'));
    expect(screen.getByTestId('account-menu-name')).toHaveTextContent('Shop Staff');
  });

  it('Back goes to the page the person came from, and to the root only when opened directly', async () => {
    render(
      <MemoryRouter initialEntries={['/production/batches', '/account']} initialIndex={1}>
        <Routes>
          <Route path="/production/batches" element={<div>batches body</div>} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/" element={<div>root body</div>} />
        </Routes>
      </MemoryRouter>,
    );
    await userEvent.click(await screen.findByTestId('account-back'));
    expect(await screen.findByText('batches body')).toBeInTheDocument();
  });

  it('Back from a directly opened account page goes to the root', async () => {
    render(
      <MemoryRouter initialEntries={['/account']}>
        <Routes>
          <Route path="/account" element={<AccountPage />} />
          <Route path="/" element={<div>root body</div>} />
        </Routes>
      </MemoryRouter>,
    );
    await userEvent.click(await screen.findByTestId('account-back'));
    expect(await screen.findByText('root body')).toBeInTheDocument();
  });
});

describe('(c) proposals say where they are decided (the push-out page carries no panel since 27 Nov 2026 — one home, item 3)', () => {
  it('the notice after a propose links to the Proposals section of the Batches page from inside a batch', async () => {
    render(
      <MemoryRouter initialEntries={['/production/batches/u-143/push-out']}>
        <ProposalsPanel targets={[{ target_kind: 'release_unit', target_id: 'u-143', label: 'Batch 143' }]} focusTargetId="u-143" />
      </MemoryRouter>,
    );
    await screen.findByTestId('proposal-mark_done');
    await userEvent.selectOptions(screen.getByLabelText('Proposed action'), 'push_short_run');
    await userEvent.type(screen.getByLabelText('Reason'), 'the hotel needs these first');
    await userEvent.click(screen.getByTestId('propose'));
    const where = await screen.findByTestId('approve-where');
    expect(where).toHaveAttribute('href', '/production/batches#proposals');
    expect(where).toHaveTextContent('Approve or decline it under Proposals on the Batches page');
  });
});

describe('(d) a mark done returns to Batches', () => {
  it('approving a mark done on the Held page lands on Batches with the notice', async () => {
    render(
      <MemoryRouter initialEntries={['/production/held']}>
        <Routes>
          <Route path="/production/held" element={<ProposalsPanel targets={[{ target_kind: 'release_unit', target_id: 'u-143', label: 'Batch 143' }]} />} />
          <Route path="/production/batches" element={<WhereAmI />} />
        </Routes>
      </MemoryRouter>,
    );
    const card = await screen.findByTestId('proposal-mark_done');
    await userEvent.click(within(card).getByTestId('approve-first'));
    await userEvent.click(within(screen.getByTestId('mark-done-dialog')).getByTestId('approve'));
    expect(await screen.findByTestId('where')).toHaveTextContent('/production/batches · Mark done (skip the remaining steps) for Batch 143: approved and applied.');
  });

  it('the Batches page shows a notice carried to it', async () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: '/production/batches', state: { notice: 'Batch 143 marked done.' } }]}>
        <BatchesPage />
      </MemoryRouter>,
    );
    expect(await screen.findByText('Batch 143 marked done.')).toBeInTheDocument();
  });
});

describe('(e) the Lane column and filter on All Channel Orders', () => {
  it('every row shows its lane; the filter keeps the stocked goods alone', async () => {
    render(
      <MemoryRouter>
        <AllChannelOrdersPage />
      </MemoryRouter>,
    );
    await waitFor(() => expect(screen.getAllByTestId('lane').length).toBe(2));
    expect(screen.getByRole('columnheader', { name: /Lane/ })).toBeInTheDocument();
    expect(screen.getAllByTestId('lane').map((e) => e.textContent).sort()).toEqual(['Press run', 'Stocked goods']);
    await userEvent.selectOptions(screen.getByLabelText('Lane'), 'Stocked goods');
    expect(screen.getAllByTestId('lane').map((e) => e.textContent)).toEqual(['Stocked goods']);
    await userEvent.selectOptions(screen.getByLabelText('Lane'), 'Press run');
    expect(screen.getAllByTestId('lane').map((e) => e.textContent)).toEqual(['Press run']);
  });
});

describe('(f) proposals named in words, filtered by action and by batch or order', () => {
  it('each card is titled "<action> for <batch or order>"; the two filters narrow the list', async () => {
    render(
      <MemoryRouter initialEntries={['/production/batches']}>
        <ProposalsPanel targets={[{ target_kind: 'release_unit', target_id: 'u-143', label: 'Batch 143' }]} />
      </MemoryRouter>,
    );
    const done = await screen.findByTestId('proposal-mark_done');
    expect(within(done).getByTestId('proposal-title')).toHaveTextContent('Mark done (skip the remaining steps) for Batch 143');
    expect(within(screen.getByTestId('proposal-push_alone')).getByTestId('proposal-title')).toHaveTextContent('Push this order alone for W7001234');
    await userEvent.selectOptions(screen.getByLabelText('Filter by action'), 'push_alone');
    expect(screen.queryByTestId('proposal-mark_done')).not.toBeInTheDocument();
    expect(screen.getByTestId('proposal-push_alone')).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText('Filter by action'), 'all');
    await userEvent.selectOptions(screen.getByLabelText('Filter by batch or order'), 'u-143');
    expect(screen.getByTestId('proposal-mark_done')).toBeInTheDocument();
    expect(screen.queryByTestId('proposal-push_alone')).not.toBeInTheDocument();
  });
});
