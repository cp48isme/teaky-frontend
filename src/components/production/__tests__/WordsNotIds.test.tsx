import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProposalsPanel from '../ProposalsPanel';
import { factsText, refusalWords, targetFact, targetWords, unitWords } from '../../../lib/proposalsCopy';
import type { ActionProposal } from '../../../types/proposals';

/** Dispatch 27 Nov 2026 evening, A: no UUID is ever shown to a person, and a
 * refusal is words beside the button that was pressed — no internal kind
 * (push_short_run), no id. */

const UNIT_ID = '7d1c6f4e-2b3a-4c5d-8e9f-0a1b2c3d4e5f';
const PROPOSAL_ID = '0f9e8d7c-6b5a-4433-8211-00ffeeddccbb';
const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

const facts = (over: Partial<ActionProposal['facts']> = {}): ActionProposal['facts'] => ({
  captured_at: '2026-11-27T01:00:00Z', target_kind: 'release_unit', target_id: UNIT_ID, reference: '101', channel: 'press_run', customer: '', portal_id: null, business_entity_id: null,
  order_status: '', lines: 2, cards: 500, units: [], stock: '80#', slots_used: 12, capacity: 24, half: false, open_holds: [], ...over,
});
const base = (over: Partial<ActionProposal> = {}): ActionProposal => ({
  id: PROPOSAL_ID, organization_id: 'org', kind: 'push_short_run', target_kind: 'release_unit', target_id: UNIT_ID, reason: 'the hotel needs these first', category: null, note: '', facts: facts(), status: 'proposed',
  proposed_by: 'u-unknown', proposed_at: '2026-11-27T01:00:00Z', decided_by: null, decided_at: null, decision_note: '', result: null, failure: '', decision_context_id: null, ...over,
});

let current: ActionProposal[] = [];
const listProposals = vi.fn(() => Promise.resolve(current));
const proposeAction = vi.fn();
vi.mock('../../../api/proposals', () => ({
  listProposals: () => listProposals(),
  proposeAction: (...a: unknown[]) => proposeAction(...a),
  approveProposal: vi.fn(),
  declineProposal: vi.fn(),
}));
// The team list knows nobody: every name falls back, and the fallback is never an id.
vi.mock('../../../api/team', () => ({ listMembers: vi.fn(() => Promise.resolve([])) }));
vi.mock('../../../lib/roles', async (importOriginal) => ({ ...(await importOriginal<typeof import('../../../lib/roles')>()), currentUserId: () => 'u-me' }));

beforeEach(() => {
  current = [];
  listProposals.mockClear();
  proposeAction.mockReset();
});

function mount(targets = [{ target_kind: 'release_unit' as const, target_id: UNIT_ID, label: 'Batch 101' }]) {
  return render(
    <MemoryRouter initialEntries={['/production/batches']}>
      <ProposalsPanel targets={targets} />
    </MemoryRouter>,
  );
}

describe('the words a proposal uses for its target', () => {
  it('a batch number, a scan code, an order number — and "this batch" / "this order" when the backend only had an id', () => {
    expect(targetWords({ target_kind: 'release_unit', reference: '101' })).toBe('Batch 101');
    expect(targetWords({ target_kind: 'release_unit', reference: '5CBHE336' })).toBe('Unit 5CBHE336');
    expect(targetWords({ target_kind: 'order', reference: 'W7001234' })).toBe('W7001234');
    expect(targetFact({ target_kind: 'order', reference: 'W7001234' })).toBe('Order W7001234');
    expect(targetFact({ target_kind: 'order', reference: UNIT_ID })).toBe('this order');
    expect(targetWords({ target_kind: 'release_unit', reference: 'Batch 141' })).toBe('Batch 141');
    expect(targetWords({ target_kind: 'release_unit', reference: UNIT_ID })).toBe('this batch');
    expect(targetWords({ target_kind: 'order', reference: UNIT_ID })).toBe('this order');
    expect(targetWords({ target_kind: 'release_unit', reference: '' })).toBe('this batch');
  });

  it('a unit in the facts is its reference, or its kind in words — never its id', () => {
    expect(unitWords({ reference: 'W1', kind: 'shipment' })).toBe('W1');
    expect(unitWords({ reference: UNIT_ID, kind: 'production' })).toBe('a batch');
    expect(unitWords({ reference: '', kind: 'shipment' })).toBe('a shipment unit');
  });

  it('the facts grid carries no id: Target, Units and the lines going back to the pool', () => {
    const p = base({
      facts: facts({
        reference: UNIT_ID,
        units: [{ unit_id: UNIT_ID, reference: UNIT_ID, kind: 'production', formation: 'batch', release_state: null, pushed_out: false, docket_number: null, cancelled: false }],
        lines_moving: [{ line_item_id: UNIT_ID, order_id: UNIT_ID, order_ref: '', product: 'Key cards', slots: 3, source_created_at: null }],
        slots_kept: 12,
      }),
    });
    const text = factsText(p).map((f) => `${f.label}: ${f.value}`).join('\n');
    expect(text).toContain('Target: this batch');
    expect(text).toContain('Units: a batch');
    expect(text).toContain('an order · Key cards · 3');
    expect(text).not.toMatch(UUID);
  });
});

describe('a refusal in words', () => {
  it('"a push_short_run proposal is already open on this target (<id>)" reads as a sentence about the batch, with no kind and no id', () => {
    const words = refusalWords(`a push_short_run proposal is already open on this target (${PROPOSAL_ID})`, { target_kind: 'release_unit', label: 'Batch 101' });
    expect(words).toBe("A short-run proposal is already open for Batch 101 — it's below.");
    expect(refusalWords('a mark_done proposal is already open on this target (x)', { target_kind: 'order', label: 'Order 48213' })).toBe("A mark-done proposal is already open for Order 48213 — it's below.");
  });

  it('the second-approver refusal loses its setting name; any other sentence keeps its words with ids and kinds replaced', () => {
    expect(refusalWords('a second approver is required: the person who proposed this action cannot approve it (require_second_approver is on)')).toBe('A second approver is required: the person who proposed an action cannot approve it.');
    expect(refusalWords(`the action refused: Batch 141 has 24 slots in use; a half batch holds 12.`)).toBe('the action refused: Batch 141 has 24 slots in use; a half batch holds 12.');
    expect(refusalWords(`push_alone refused for ${UNIT_ID}`)).toBe('push-alone refused for it');
  });

  it('shows beside the Propose button, in words, and nowhere else on the panel', async () => {
    proposeAction.mockRejectedValueOnce(new Error(`a push_short_run proposal is already open on this target (${PROPOSAL_ID})`));
    mount();
    const form = await screen.findByTestId('propose-form');
    await userEvent.type(within(form).getByLabelText('Reason'), 'the hotel needs these first');
    await userEvent.click(within(form).getByTestId('propose'));
    const beside = await within(form).findByTestId('propose-refusal');
    expect(beside).toHaveAttribute('role', 'alert');
    expect(beside).toHaveTextContent("A short-run proposal is already open for Batch 101 — it's below.");
    // one alert, on the form — the panel's top line is for a load that failed
    expect(screen.getAllByRole('alert')).toHaveLength(1);
    const panel = screen.getByTestId('proposals-panel').textContent ?? '';
    expect(panel).not.toContain('push_short_run');
    expect(panel).not.toMatch(UUID);
  });
});

describe('a proposal whose only references are ids', () => {
  it('reads the name the screen has for the target ("Unit RHTF48RG") and "a staff member"; no UUID anywhere on the panel', async () => {
    current = [base({ facts: facts({ reference: UNIT_ID, units: [{ unit_id: UNIT_ID, reference: UNIT_ID, kind: 'production', formation: 'batch', release_state: null, pushed_out: false, docket_number: null, cancelled: false }] }) })];
    mount([{ target_kind: 'release_unit', target_id: UNIT_ID, label: 'Unit RHTF48RG' }]);
    const card = await screen.findByTestId('proposal-push_short_run');
    expect(within(card).getByTestId('proposal-title')).toHaveTextContent('Push a short run (half batch) for Unit RHTF48RG');
    expect(within(card).getByTestId('proposal-facts')).toHaveTextContent('Unit RHTF48RG');
    expect(within(card).getByTestId('proposed-by')).toHaveTextContent('a staff member');
    expect(screen.getByLabelText('Filter by batch or order')).toHaveTextContent('Unit RHTF48RG');
    expect(screen.getByTestId('proposals-panel').textContent ?? '').not.toMatch(UUID);
  });

  it('reads "this batch" when the screen has no name for it either', async () => {
    current = [base({ facts: facts({ reference: UNIT_ID }) })];
    mount([{ target_kind: 'release_unit', target_id: 'some-other-unit', label: 'Batch 7' }]);
    const card = await screen.findByTestId('proposal-push_short_run');
    expect(within(card).getByTestId('proposal-title')).toHaveTextContent('Push a short run (half batch) for this batch');
    expect(screen.getByTestId('proposals-panel').textContent ?? '').not.toMatch(UUID);
  });
});
