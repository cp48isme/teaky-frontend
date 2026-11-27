import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BatchPage, { artText, auditText, laneText } from '../BatchPage';
import type { BatchPage as BatchPageFacts } from '../../../types/batchPage';

/** The batch page (overnight dispatch, 26 Nov 2026, item 1): the one place a
 * batch is understood — facts on top, the lines each linking to their order,
 * what goes with it with an action beside any absence, the actions saying
 * where they lead, this batch's proposals, the audit trail newest first. */

const facts: BatchPageFacts = {
  summary: {
    unit_id: 'u-101', batch_number: 101, scan_code: 'TK-101', business_entities: ['SSUS'], tags: ['rush'], stock: 'BC 120#', channel: 'press_run', used: 8, capacity: 24, blanks: 16, half: false, full: false, orders: 3, lines: 8,
    channels: ['taylor'], oldest_line_ref: 'W7001', oldest_line_age_seconds: 2 * 86400, release_state: null, docket_number: null, released_at: null, released_by_id: null, cancelled: false, marked_done_at: null, marked_done_by_id: null,
    fill_candidates: [], fillable_slots: 0, line_item_ids: ['l1', 'l2'],
  },
  lines: [
    { line_item_id: 'l1', order_id: 'o1', order_ref: 'W7001', customer: 'Sprouts', product: 'BC standard', quantity: 2, pack_size: 250, cards: 500, lane: 'press_run', art_files: 1 },
    { line_item_id: 'l2', order_id: 'o2', order_ref: 'W7002', customer: 'Front Desk', product: 'BC premium', quantity: 1, pack_size: 250, cards: 250, lane: 'press_run', art_files: 0 },
  ],
  job_ticket: null,
  sheet: null,
  lines_with_art: 1,
  docket_send_enabled: false,
  docket_host: null,
  audit: [
    { id: 'a2', timestamp: '2026-11-26T12:00:00Z', action: 'release_unit_tags_changed', user_id: 'u-me', details: { tags: ['rush'] } },
    { id: 'a1', timestamp: '2026-11-25T09:00:00Z', action: 'release_unit_created', user_id: null, details: null },
  ],
};

const getBatchPage = vi.fn(() => Promise.resolve(facts));
const openJobTicket = vi.fn(() => Promise.resolve());
const markBatchDone = vi.fn(() => Promise.resolve({ applied: true, reason: 'finished by hand', units: [{ unit_id: 'u-101', batch_number: 101, steps_remaining: 0, steps_skipped: 3, marked_done_at: '2026-11-27T01:00:00Z' }] }));
vi.mock('../../../api/production', () => ({
  getBatchPage: () => getBatchPage(),
  openJobTicket: (...a: unknown[]) => openJobTicket(...(a as [])),
  markBatchDone: (...a: unknown[]) => markBatchDone(...(a as [])),
}));
vi.mock('../../../api/orders', () => ({ listShopTags: vi.fn(() => Promise.resolve({ tags: ['rush', 'hold'] })), listPrinterOrders: vi.fn(() => Promise.resolve([])), updateOrder: vi.fn() }));
vi.mock('../../../api/proposals', () => ({ listProposals: vi.fn(() => Promise.resolve([])), proposeAction: vi.fn(), approveProposal: vi.fn(), declineProposal: vi.fn() }));
vi.mock('../../../api/team', () => ({ listMembers: vi.fn(() => Promise.resolve([])) }));
vi.mock('../../../lib/roles', async (importOriginal) => ({ ...(await importOriginal<typeof import('../../../lib/roles')>()), isShadowReader: () => false, currentUserId: () => 'u-me' }));

function mount(readOnly = false) {
  return render(
    <MemoryRouter initialEntries={['/production/batches/u-101']}>
      <Routes>
        <Route path="/production/batches/:unitId" element={<BatchPage readOnly={readOnly} />} />
        <Route path="/production/batches/:unitId/push-out" element={<div data-testid="confirm-page">confirm for u-101</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  getBatchPage.mockClear();
  openJobTicket.mockClear();
  markBatchDone.mockClear();
});

describe('the batch page', () => {
  it('shows the facts on top, the lines linking to their orders, what goes with it, and the audit trail newest first', async () => {
    mount();
    expect(await screen.findByTestId('batch-title')).toHaveTextContent('Batch 101');
    const top = screen.getByTestId('batch-facts');
    expect(within(top).getByTestId('scan-code')).toHaveTextContent('TK-101');
    expect(within(top).getByTestId('entity')).toHaveTextContent('SSUS');
    expect(top).toHaveTextContent('8 / 24 · 16 blank');
    expect(top).toHaveTextContent('3 · 8');
    expect(within(top).getByTestId('batch-tags')).toHaveTextContent('rush');
    const rows = within(screen.getByTestId('batch-lines')).getAllByTestId('batch-line');
    expect(rows).toHaveLength(2);
    expect(within(rows[0]).getByRole('link', { name: 'W7001' })).toHaveAttribute('href', '/orders/o1');
    expect(within(rows[1]).getByTestId('lane')).toHaveTextContent('Press run');
    expect(within(rows[1]).getByTestId('art')).toHaveTextContent('none');
    const goes = screen.getByTestId('goes-with-it');
    expect(within(goes).getByTestId('art-summary')).toHaveTextContent('1 of 2 lines has art — 1 without');
    expect(within(goes).getByRole('link', { name: /Open All Channel Orders/ })).toHaveAttribute('href', '/production/orders');
    expect(goes).toHaveTextContent('Not generated yet — it is generated on push-out, or now:');
    expect(goes).toHaveTextContent('Imposed on push-out.');
    const entries = within(screen.getByTestId('batch-audit')).getAllByTestId('audit-entry');
    expect(entries).toHaveLength(2);
    expect(entries[0]).toHaveTextContent('release unit tags changed · tags: rush');
    expect(entries[1]).toHaveTextContent('release unit created');
  });

  it('each action says what it does and where it leads; Push out opens the confirm page; Mark done runs its two-step dialog and shows the result here', async () => {
    mount();
    const actions = await screen.findByTestId('batch-actions');
    expect(within(actions).getByTestId('push-out')).toHaveTextContent('Push out → confirm page');
    expect(within(actions).getByTestId('mark-done')).toHaveTextContent('Mark done… → its confirmation');
    expect(within(actions).getByTestId('propose-short-run')).toHaveAttribute('href', '#proposals');
    await userEvent.click(within(actions).getByTestId('mark-done'));
    const dialog = screen.getByRole('dialog', { name: 'Mark Batch 101 done' });
    await userEvent.type(within(dialog).getByLabelText('Reason'), 'finished by hand');
    await userEvent.click(within(dialog).getByTestId('mark-done-next'));
    await userEvent.click(within(dialog).getByTestId('mark-done-confirm'));
    await waitFor(() => expect(markBatchDone).toHaveBeenCalledWith('u-101', 'finished by hand', true));
    expect(await screen.findByTestId('action-result')).toHaveTextContent('Batch 101 marked done; 3 remaining steps skipped.');
    expect(getBatchPage).toHaveBeenCalledTimes(2);
    await userEvent.click(within(actions).getByTestId('push-out'));
    expect(await screen.findByTestId('confirm-page')).toBeInTheDocument();
  });

  it('the job ticket is opened with the session, and the page re-reads once it exists', async () => {
    mount();
    await userEvent.click(await screen.findByTestId('open-ticket'));
    await waitFor(() => expect(openJobTicket).toHaveBeenCalledWith('u-101'));
    await waitFor(() => expect(getBatchPage).toHaveBeenCalledTimes(2));
  });

  it("this batch's proposals are listed on the page, with the batch as the proposal target", async () => {
    mount();
    const form = await screen.findByTestId('propose-form');
    expect(within(form).getByLabelText('Proposal target')).toHaveDisplayValue('Batch 101');
  });

  it('a read-only reader sees the facts, the lines and the trail, and no action', async () => {
    mount(true);
    await screen.findByTestId('batch-title');
    expect(screen.queryByTestId('batch-actions')).toBeNull();
    expect(screen.queryByTestId('open-ticket')).toBeNull();
    expect(screen.getByTestId('goes-with-it')).toHaveTextContent('Generated on push-out.');
    expect(screen.getByTestId('batch-tags')).toHaveTextContent('rush');
    expect(screen.getAllByTestId('batch-line')).toHaveLength(2);
  });
});

describe('the words', () => {
  it('lane, art and audit lines read as words', () => {
    expect(laneText('stocked_goods')).toBe('Stocked goods');
    expect(laneText(null)).toBe('—');
    expect(artText(8, 8)).toBe('8 of 8 lines have art');
    expect(artText(0, 0)).toBe('No lines in this batch yet.');
    expect(auditText({ id: 'x', timestamp: 't', action: 'push_out', user_id: null, details: { outcome: 'recorded', docket_number: '18502' } })).toBe('push out · outcome: recorded · docket number: 18502');
  });
});
