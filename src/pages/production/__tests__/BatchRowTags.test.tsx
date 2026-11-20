import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import BatchesTable from '../../../components/production/BatchesTable';
import { confirmText, planFor } from '../../../components/production/BatchTagEditor';
import type { Order } from '../../../types/order';
import type { BatchSummary } from '../../../types/production';

/** Tags on a batch row (ruling 19 Nov 2026 on t08): a bulk action — the
 * confirmation names the exact count, cancel writes nothing, confirm PATCHes
 * every order in the batch once with its full list, a failure stops the run
 * and says which were changed; a read-only row has no editor. */

const batch = (over: Partial<BatchSummary>): BatchSummary => ({
  unit_id: 'u-101', batch_number: 101, scan_code: 'K7M2Q9XA', business_entities: ['single_source'], stock: '120#', channel: 'press_run',
  used: 24, capacity: 24, blanks: 0, full: true, orders: 3, lines: 3, channels: ['press_run'], oldest_line_ref: 'W1', oldest_line_age_seconds: 100,
  release_state: null, docket_number: null, released_at: null, released_by_id: null, cancelled: false, fill_candidates: [], fillable_slots: 0, line_item_ids: ['l1', 'l2', 'l3'], tags: ['Express'], ...over,
});
const order = (id: string, po: string, lines: string[], tags: string[]): Order =>
  ({ id, order_number: `ORD-${id}`, po_number: po, placed_at: '2026-11-17T15:00:00Z', tags, line_items: lines.map((l) => ({ id: l, product_name: 'BC', quantity: 1, pack_size: 250 })) }) as unknown as Order;
// o1 and o2 are in the batch (o1 already Express); o3 is in the batch and untagged; o9 is another batch's.
const orders = [order('o1', 'W1', ['l1'], ['Express']), order('o2', 'W2', ['l2'], []), order('o3', 'W3', ['l3'], ['Express']), order('o9', 'W9', ['l9'], [])];

const updateOrder = vi.fn((id: string, data: { tags?: string[] }) => Promise.resolve(order(id, id, [], data.tags ?? [])));
const listPrinterOrders = vi.fn(() => Promise.resolve(orders));
vi.mock('../../../api/orders', () => ({
  listPrinterOrders: () => listPrinterOrders(),
  updateOrder: (id: string, data: { tags?: string[] }) => updateOrder(id, data),
}));

function mount(readOnly = false, onTagsWritten = vi.fn()) {
  render(
    <MemoryRouter>
      <BatchesTable batches={[batch({})]} readOnly={readOnly} shopTags={['Express', 'Rush']} onTagsWritten={onTagsWritten} sort={{ key: 'oldest', direction: 'desc' }} onSort={() => {}} />
    </MemoryRouter>,
  );
  return onTagsWritten;
}

beforeEach(() => {
  updateOrder.mockClear();
  listPrinterOrders.mockClear();
});

describe('batch row tags — a bulk action', () => {
  it('names the count on add, writes nothing on cancel, PATCHes each order once on confirm', async () => {
    const user = userEvent.setup();
    const written = mount();
    const editor = screen.getByTestId('batch-tag-editor');
    await user.click(within(editor).getByRole('button', { name: 'Add tag' }));
    await user.selectOptions(within(editor).getByRole('combobox', { name: 'Pick a tag' }), 'Rush');
    const dialog = await screen.findByRole('dialog', { name: 'Tag 3 orders with Rush' });
    expect(within(dialog).getByTestId('batch-tag-confirm-text')).toHaveTextContent('Tag 3 orders with Rush');
    expect(updateOrder).not.toHaveBeenCalled();
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(updateOrder).not.toHaveBeenCalled();
    expect(written).not.toHaveBeenCalled();

    await user.click(within(editor).getByRole('button', { name: 'Add tag' }));
    await user.selectOptions(within(editor).getByRole('combobox', { name: 'Pick a tag' }), 'Rush');
    await user.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Confirm' }));
    await waitFor(() => expect(updateOrder).toHaveBeenCalledTimes(3));
    expect(updateOrder.mock.calls).toEqual([
      ['o1', { tags: ['Express', 'Rush'] }],
      ['o2', { tags: ['Rush'] }],
      ['o3', { tags: ['Express', 'Rush'] }],
    ]);
    expect(await screen.findByTestId('batch-tag-notice')).toHaveTextContent('Tagged 3 orders with Rush.');
    expect(written).toHaveBeenCalledTimes(1);
  });

  it('on remove counts only the orders carrying the tag; a failed PATCH stops the run and says which changed', async () => {
    const user = userEvent.setup();
    updateOrder.mockImplementationOnce((id: string, data: { tags?: string[] }) => Promise.resolve(order(id, id, [], data.tags ?? []))).mockImplementationOnce(() => Promise.reject(new Error('Order not found')));
    const written = mount();
    await user.click(screen.getByRole('button', { name: 'Remove tag Express' }));
    const dialog = await screen.findByRole('dialog', { name: 'Remove Express from 2 orders' });
    await user.click(within(dialog).getByRole('button', { name: 'Confirm' }));
    await waitFor(() => expect(updateOrder).toHaveBeenCalledTimes(2));
    expect(updateOrder.mock.calls).toEqual([
      ['o1', { tags: [] }],
      ['o3', { tags: [] }],
    ]);
    expect(await screen.findByTestId('batch-tag-notice')).toHaveTextContent('Stopped: Order not found. Changed: W1. Not changed: W3.');
    expect(written).toHaveBeenCalledTimes(1);
    // The plan is pure: the same facts without a component.
    const plan = planFor(batch({}), orders, ['Express'], []);
    expect(plan && confirmText(plan)).toBe('Remove Express from 2 orders');
    expect(planFor(batch({ tags: [] }), orders, [], ['Hotel'])?.orders.map((x) => x.order.id)).toEqual(['o1', 'o2', 'o3']);
  });

  it('is chips only on a read-only row', () => {
    mount(true);
    expect(screen.queryByTestId('batch-tag-editor')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Add tag' })).toBeNull();
    expect(screen.getByTestId('batch-row')).toHaveTextContent('Express');
    expect(listPrinterOrders).not.toHaveBeenCalled();
  });
});
