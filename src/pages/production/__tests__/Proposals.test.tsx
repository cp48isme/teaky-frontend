import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProposalsPanel from '../../../components/production/ProposalsPanel';
import type { ActionProposal, ProposeActionRequest } from '../../../types/proposals';
import { ApiError } from '../../../api/client';

/** The four proposal actions on the production screens (dispatch 17–18 Nov
 * 2026, item 1): the list shows each proposal's facts and who proposed it;
 * approve and decline call the routes; one's own proposal offers "Withdraw";
 * "mark done" sits behind a second confirmation on propose and on approve;
 * a read-only sign-in (#265, ruling 18 Nov 2026) sees the proposals and no action. */

const facts = (over: Partial<ActionProposal['facts']> = {}): ActionProposal['facts'] => ({
  captured_at: '2026-11-18T01:00:00Z', target_kind: 'order', target_id: 'o1', reference: 'W7001234', channel: 'taylor', customer: 'Sprouts', portal_id: null, business_entity_id: null,
  order_status: 'submitted', lines: 2, cards: 500, units: [{ unit_id: 'u1', reference: 'Batch 141', kind: 'production', formation: 'gang', release_state: null, pushed_out: false, docket_number: null, cancelled: false }],
  stock: '80#', slots_used: 12, capacity: 24, half: false, open_holds: ['art_missing'], ...over,
});
const base = (over: Partial<ActionProposal>): ActionProposal => ({
  id: 'p1', organization_id: 'org', kind: 'push_alone', target_kind: 'order', target_id: 'o1', reason: 'customer needs it Friday', category: 'rush', note: '',
  facts: facts(), status: 'proposed', proposed_by: 'u-dana', proposed_at: '2026-11-18T01:00:00Z', decided_by: null, decided_at: null, decision_note: '', result: null, failure: '', decision_context_id: null, ...over,
});
const theirs = base({});
const mine = base({ id: 'p2', kind: 'mark_done', target_kind: 'release_unit', target_id: 'u1', reason: 'finished by hand on the old press', category: null, proposed_by: 'u-me', facts: facts({ target_kind: 'release_unit', target_id: 'u1', reference: 'Batch 141' }) });
const declined = base({ id: 'p3', status: 'declined', decided_by: 'u-me', decided_at: '2026-11-18T02:00:00Z', decision_note: 'not this week' });

const listProposals = vi.fn(() => Promise.resolve([theirs, mine, declined]));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const proposeAction = vi.fn((_body: ProposeActionRequest) => Promise.resolve(theirs));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const approveProposal = vi.fn((_id: string, _note: string) => Promise.resolve({ ...theirs, status: 'approved' }));
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const declineProposal = vi.fn((_id: string, _note: string) => Promise.resolve({ ...theirs, status: 'declined' }));
vi.mock('../../../api/proposals', () => ({
  listProposals: (...a: unknown[]) => listProposals(...(a as [])),
  proposeAction: (...a: unknown[]) => proposeAction(...(a as [ProposeActionRequest])),
  approveProposal: (...a: unknown[]) => approveProposal(...(a as [string, string])),
  declineProposal: (...a: unknown[]) => declineProposal(...(a as [string, string])),
}));
const listMembers = vi.fn(() => Promise.resolve([{ user_id: 'u-me', email: 'me@shop.example', display_name: 'Clayton' }, { user_id: 'u-dana', email: 'dana@shop.example', display_name: 'Dana' }]));
vi.mock('../../../api/team', () => ({ listMembers: () => listMembers() }));
vi.mock('../../../lib/roles', async (importOriginal) => ({ ...(await importOriginal<typeof import('../../../lib/roles')>()), currentUserId: () => 'u-me' }));

const targets = [
  { target_kind: 'release_unit' as const, target_id: 'u1', label: 'Batch 141' },
  { target_kind: 'order' as const, target_id: 'o1', label: 'Order W7001234' },
];

function mount(readOnly = false) {
  return render(
    <MemoryRouter>
      <ProposalsPanel targets={targets} readOnly={readOnly} />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  listProposals.mockClear();
  proposeAction.mockClear();
  approveProposal.mockClear();
  declineProposal.mockClear();
  listMembers.mockClear();
});

describe('the proposals panel', () => {
  it('lists open proposals with their facts and who proposed them; decided ones behind a toggle', async () => {
    mount();
    const card = await screen.findByTestId('proposal-push_alone');
    expect(card).toHaveTextContent('Push this order alone');
    expect(within(card).getByTestId('proposed-by')).toHaveTextContent('Dana');
    expect(within(card).getByTestId('proposal-reason')).toHaveTextContent('customer needs it Friday');
    const f = within(card).getByTestId('proposal-facts');
    expect(f).toHaveTextContent('Order W7001234');
    expect(f).toHaveTextContent('taylor');
    expect(f).toHaveTextContent('Sprouts');
    expect(f).toHaveTextContent('2 · 500');
    expect(f).toHaveTextContent('12 / 24 · 80#');
    expect(f).toHaveTextContent('art_missing');
    expect(f).toHaveTextContent('Batch 141');
    expect(screen.getByText('2 waiting for a decision · 1 decided.', { exact: false })).toBeInTheDocument();
    expect(screen.queryByText('not this week', { exact: false })).toBeNull();
    await userEvent.click(screen.getByTestId('toggle-decided'));
    expect(await screen.findByText(/Decided by Clayton/)).toHaveTextContent('not this week');
  });

  it("offers Decline on another person's proposal and Withdraw on one's own", async () => {
    mount();
    const theirsCard = await screen.findByTestId('proposal-push_alone');
    expect(within(theirsCard).getByTestId('decline')).toHaveTextContent('Decline');
    const mineCard = screen.getByTestId('proposal-mark_done');
    expect(within(mineCard).getByTestId('decline')).toHaveTextContent('Withdraw');
    await userEvent.type(within(theirsCard).getByLabelText('Decision note'), 'rush not justified');
    await userEvent.click(within(theirsCard).getByTestId('decline'));
    await waitFor(() => expect(declineProposal).toHaveBeenCalledWith('p1', 'rush not justified'));
  });

  it('approves another kind in one press, and mark done only after a second confirmation', async () => {
    mount();
    const theirsCard = await screen.findByTestId('proposal-push_alone');
    await userEvent.click(within(theirsCard).getByTestId('approve'));
    await waitFor(() => expect(approveProposal).toHaveBeenCalledWith('p1', ''));
    const mineCard = screen.getByTestId('proposal-mark_done');
    expect(within(mineCard).queryByTestId('approve')).toBeNull();
    await userEvent.click(within(mineCard).getByTestId('approve-first'));
    expect(approveProposal).toHaveBeenCalledTimes(1);
    expect(within(mineCard).getByTestId('approve-confirm-note')).toHaveTextContent('every remaining route step is skipped');
    await userEvent.click(within(mineCard).getByTestId('approve'));
    await waitFor(() => expect(approveProposal).toHaveBeenCalledWith('p2', ''));
  });

  it("mark done's second step is a modal naming the batch; the card says it awaits confirmation until then (ruling 20 Nov 2026, a27)", async () => {
    mount();
    const mineCard = await screen.findByTestId('proposal-mark_done');
    expect(within(mineCard).queryByTestId('awaiting-confirmation')).toBeNull();
    expect(screen.queryByRole('dialog')).toBeNull();
    await userEvent.click(within(mineCard).getByTestId('approve-first'));
    expect(within(mineCard).getByTestId('awaiting-confirmation')).toHaveTextContent('awaiting your confirmation');
    const dialog = screen.getByRole('dialog', { name: 'Mark Batch 141 done?' });
    expect(within(dialog).getByRole('button', { name: /Yes, mark Batch 141 done/ })).toBeTruthy();
    expect(approveProposal).not.toHaveBeenCalled();
    await userEvent.click(within(dialog).getByTestId('approve-cancel'));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(within(mineCard).queryByTestId('awaiting-confirmation')).toBeNull();
    expect(within(mineCard).getByTestId('approve-first')).toBeTruthy();
    expect(approveProposal).not.toHaveBeenCalled();
  });

  it('proposes with a reason; push alone carries its category; the proposal applies nothing', async () => {
    mount();
    await screen.findByTestId('propose-form');
    await userEvent.selectOptions(screen.getByLabelText('Proposal target'), 'order:o1');
    await userEvent.selectOptions(screen.getByLabelText('Proposed action'), 'push_alone');
    await userEvent.selectOptions(screen.getByLabelText('Push-alone category'), 'stock');
    expect(screen.getByTestId('propose')).toBeDisabled();
    await userEvent.type(screen.getByLabelText('Reason'), 'only 80# in the building this week');
    await userEvent.click(screen.getByTestId('propose'));
    await waitFor(() => expect(proposeAction).toHaveBeenCalledTimes(1));
    expect(proposeAction.mock.calls[0]?.[0]).toEqual({ kind: 'push_alone', target_kind: 'order', target_id: 'o1', reason: 'only 80# in the building this week', category: 'stock', note: '' });
  });

  it('proposing mark done takes a second press after the warning', async () => {
    mount();
    await screen.findByTestId('propose-form');
    await userEvent.selectOptions(screen.getByLabelText('Proposal target'), 'release_unit:u1');
    await userEvent.selectOptions(screen.getByLabelText('Proposed action'), 'mark_done');
    await userEvent.type(screen.getByLabelText('Reason'), 'finished on the old press');
    expect(screen.getByTestId('propose')).toHaveTextContent('Propose mark done…');
    await userEvent.click(screen.getByTestId('propose'));
    expect(proposeAction).not.toHaveBeenCalled();
    expect(screen.getByTestId('propose-confirm-note')).toHaveTextContent('skips every remaining route step for Batch 141');
    expect(screen.getByTestId('propose')).toHaveTextContent('Yes, propose mark done');
    await userEvent.click(screen.getByTestId('propose'));
    await waitFor(() => expect(proposeAction).toHaveBeenCalledTimes(1));
    expect(proposeAction.mock.calls[0]?.[0]).toMatchObject({ kind: 'mark_done', target_kind: 'release_unit', target_id: 'u1', reason: 'finished on the old press' });
  });

  it('a read-only sign-in sees the proposals, their facts and who waits on them, and no action (#265: the reads answer the role, the writes refuse it)', async () => {
    mount(true);
    await waitFor(() => expect(screen.getAllByTestId('proposal-facts').length).toBe(2));
    expect(listProposals).toHaveBeenCalledTimes(1);
    expect(listMembers).not.toHaveBeenCalled();
    expect(screen.getByTestId('proposals-read-only-note')).toBeTruthy();
    expect(screen.getAllByTestId('proposed-by').map((n) => n.textContent)).toEqual(['a staff member', 'a staff member']);
    expect(screen.getAllByTestId('waiting-for-a-decision').length).toBe(2);
    expect(screen.queryByTestId('propose-form')).toBeNull();
    expect(screen.queryByTestId('approve')).toBeNull();
    expect(screen.queryByTestId('approve-first')).toBeNull();
    expect(screen.queryByTestId('decline')).toBeNull();
    expect(screen.queryByLabelText('Decision note')).toBeNull();
    // The one button is the decided toggle; the decided card shows its decision, no control.
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['Show 1 decided']);
    expect(proposeAction).not.toHaveBeenCalled();
    expect(approveProposal).not.toHaveBeenCalled();
    expect(declineProposal).not.toHaveBeenCalled();
  });

  describe('every refusal shows its reason on the card (a27 item 1, 20 Nov 2026)', () => {
    const shortRun = base({ id: 'p4', kind: 'push_short_run', target_kind: 'release_unit', target_id: 'u1', reason: 'the hotel needs these first', category: null, proposed_by: 'u-dana', facts: facts({ target_kind: 'release_unit', target_id: 'u1', reference: 'Batch 141', slots_used: 24 }) });
    const voidOrder = base({ id: 'p5', kind: 'void_order', target_kind: 'order', target_id: 'o1', reason: 'customer cancelled by phone', category: null, proposed_by: 'u-dana' });
    const cases: Array<[string, ActionProposal, string, boolean]> = [
      ['push_short_run', shortRun, 'the action refused: Batch 141 has 24 slots in use; a half batch holds 12.', false],
      ['push_alone', theirs, 'the action refused: This order has no lines in the pool; nothing to push out alone.', false],
      ['void_order', voidOrder, 'the action refused: This order is already void.', false],
      ['mark_done', mine, 'the action refused: Batch 141 was already marked done on 2026-11-20.', true],
    ];
    for (const [kind, proposal, reason, twoStep] of cases) {
      it(`${kind}: the reason sits on the card and the card stays in view`, async () => {
        listProposals.mockResolvedValueOnce([proposal]).mockResolvedValue([{ ...proposal, status: 'failed', failure: reason.replace('the action refused: ', ''), decided_by: 'u-me', decided_at: '2026-11-20T15:00:00Z' }]);
        approveProposal.mockRejectedValueOnce(new ApiError(409, reason));
        mount();
        const card = await screen.findByTestId(`proposal-${kind}`);
        if (twoStep) {
          await userEvent.click(within(card).getByTestId('approve-first'));
          await userEvent.click(within(card).getByTestId('approve'));
        } else {
          await userEvent.click(within(card).getByTestId('approve'));
        }
        const onCard = await screen.findByTestId('card-refusal');
        expect(onCard).toHaveTextContent(`Refused: ${reason}`);
        // after the reload the server says failed; the card is still in view, not behind the decided toggle
        await waitFor(() => expect(screen.getByTestId(`proposal-${kind}`)).toHaveAttribute('data-status', 'failed'));
        expect(within(screen.getByTestId(`proposal-${kind}`)).getByTestId('card-refusal')).toBeInTheDocument();
      });
    }
  });

  it('a short run on a full batch lists the lines that go back to the pool, and what stays (a27 item 2, 20 Nov 2026)', async () => {
    const full = base({
      id: 'p6', kind: 'push_short_run', target_kind: 'release_unit', target_id: 'u1', reason: 'the oldest two need to go today', category: null, proposed_by: 'u-dana',
      facts: facts({
        target_kind: 'release_unit', target_id: 'u1', reference: 'Batch 141', slots_used: 24, capacity: 24, slots_kept: 12,
        lines_moving: [{ line_item_id: 'l-c', order_id: 'o-c', order_ref: 'W-C', product: 'Business card, standard', slots: 12, source_created_at: '2026-11-16T00:00:00Z' }],
      }),
    });
    listProposals.mockResolvedValue([full]);
    mount();
    const card = await screen.findByTestId('proposal-push_short_run');
    const factsBox = within(card).getByTestId('proposal-facts');
    expect(factsBox).toHaveTextContent('Stays (oldest that fit)');
    expect(factsBox).toHaveTextContent('12 slots');
    expect(factsBox).toHaveTextContent('Back to the pool on approval (1 line, 12 slots)');
    expect(factsBox).toHaveTextContent('W-C · Business card, standard · 12');
  });
});

