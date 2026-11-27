import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProposalsPanel, { approvalHref } from '../../../components/production/ProposalsPanel';
import { heldOrderTargets } from '../BatchesPage';
import type { ActionProposal } from '../../../types/proposals';
import type { HeldQueueEntry } from '../../../types/releaseUnit';

/** Proposals, one home (overnight dispatch 26 Nov 2026, item 3): a decision
 * shows on the card in place — the card stays where it was, wearing its new
 * status — and the Held page's orders become targets on the Batches page,
 * where every proposal of the shop is decided. */

const facts: ActionProposal['facts'] = {
  captured_at: '2026-11-26T01:00:00Z', target_kind: 'release_unit', target_id: 'u1', reference: 'Batch 141', channel: 'press_run', customer: '', portal_id: null, business_entity_id: null,
  order_status: '', lines: 2, cards: 500, units: [], stock: '80#', slots_used: 12, capacity: 24, half: false, open_holds: [],
};
const theirs: ActionProposal = { id: 'p1', organization_id: 'org', kind: 'push_short_run', target_kind: 'release_unit', target_id: 'u1', reason: 'the hotel needs these first', category: null, note: '', facts, status: 'proposed', proposed_by: 'u-dana', proposed_at: '2026-11-26T01:00:00Z', decided_by: null, decided_at: null, decision_note: '', result: null, failure: '', decision_context_id: null };
const mine: ActionProposal = { ...theirs, id: 'p2', kind: 'mark_done', reason: 'finished by hand', proposed_by: 'u-me' };

let current: ActionProposal[] = [theirs, mine];
const listProposals = vi.fn(() => Promise.resolve(current));
const approveProposal = vi.fn((id: string) => {
  current = current.map((p) => (p.id === id ? { ...p, status: 'approved' as const, decided_by: 'u-me', decided_at: '2026-11-27T01:00:00Z' } : p));
  return Promise.resolve(current.find((p) => p.id === id)!);
});
const declineProposal = vi.fn((id: string) => {
  current = current.map((p) => (p.id === id ? { ...p, status: (p.proposed_by === 'u-me' ? 'withdrawn' : 'declined') as ActionProposal['status'], decided_by: 'u-me', decided_at: '2026-11-27T01:00:00Z' } : p));
  return Promise.resolve(current.find((p) => p.id === id)!);
});
vi.mock('../../../api/proposals', () => ({
  listProposals: () => listProposals(),
  proposeAction: vi.fn(),
  approveProposal: (...a: unknown[]) => approveProposal(...(a as [string])),
  declineProposal: (...a: unknown[]) => declineProposal(...(a as [string])),
}));
vi.mock('../../../api/team', () => ({ listMembers: vi.fn(() => Promise.resolve([{ user_id: 'u-me', email: 'me@shop.example', display_name: 'Clayton' }, { user_id: 'u-dana', email: 'dana@shop.example', display_name: 'Dana' }])) }));
vi.mock('../../../lib/roles', async (importOriginal) => ({ ...(await importOriginal<typeof import('../../../lib/roles')>()), currentUserId: () => 'u-me' }));

beforeEach(() => {
  current = [theirs, mine];
  listProposals.mockClear();
  approveProposal.mockClear();
  declineProposal.mockClear();
});

describe('a decision shows on the card in place', () => {
  it('Approve: the card stays where it was, now "approved and applied", with who decided', async () => {
    render(
      <MemoryRouter initialEntries={['/production/batches']}>
        <ProposalsPanel targets={[{ target_kind: 'release_unit', target_id: 'u1', label: 'Batch 141' }]} />
      </MemoryRouter>,
    );
    const card = await screen.findByTestId('proposal-push_short_run');
    await userEvent.click(within(card).getByTestId('approve'));
    await waitFor(() => expect(approveProposal).toHaveBeenCalledWith('p1', ''));
    await waitFor(() => expect(screen.getByTestId('proposal-push_short_run')).toHaveAttribute('data-status', 'approved'));
    const after = screen.getByTestId('proposal-push_short_run');
    expect(after).toHaveTextContent('approved and applied');
    expect(after).toHaveTextContent('Decided by Clayton');
    expect(within(after).queryByTestId('approve')).toBeNull();
    // Not hidden behind the decided toggle: the toggle counts the other decided ones only.
    expect(screen.queryByTestId('toggle-decided')).toBeNull();
  });

  it("Withdraw: one's own card stays, marked withdrawn by the proposer", async () => {
    render(
      <MemoryRouter initialEntries={['/production/batches']}>
        <ProposalsPanel targets={[{ target_kind: 'release_unit', target_id: 'u1', label: 'Batch 141' }]} />
      </MemoryRouter>,
    );
    const card = await screen.findByTestId('proposal-mark_done');
    expect(within(card).getByTestId('decline')).toHaveTextContent('Withdraw');
    await userEvent.click(within(card).getByTestId('decline'));
    await waitFor(() => expect(screen.getByTestId('proposal-mark_done')).toHaveAttribute('data-status', 'withdrawn'));
    expect(screen.getByTestId('proposal-mark_done')).toHaveTextContent('withdrawn by the proposer');
  });
});

describe('one home', () => {
  it('every proposal is decided on the Batches page, orders included', () => {
    expect(approvalHref('order')).toBe('/production/batches#proposals');
    expect(approvalHref('release_unit')).toBe('/production/batches#proposals');
  });

  it("the held queue's orders are targets on Batches, each once", () => {
    const entry = (over: Partial<HeldQueueEntry>): HeldQueueEntry => ({ unit_id: 'x', kind: 'shipment', source_order_id: 'o1', order_number: 'W7001', reference: 'S-1', ...over }) as unknown as HeldQueueEntry;
    const targets = heldOrderTargets([entry({ unit_id: 'a' }), entry({ unit_id: 'b', reference: 'S-2' }), entry({ unit_id: 'c', source_order_id: 'o2', order_number: null, reference: 'S-3' }), entry({ unit_id: 'd', source_order_id: null })]);
    expect(targets).toEqual([
      { target_kind: 'order', target_id: 'o1', label: 'Order W7001' },
      { target_kind: 'order', target_id: 'o2', label: 'Order S-3' },
    ]);
  });
});
