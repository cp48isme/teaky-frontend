import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import AllChannelOrdersPage from '../AllChannelOrdersPage';
import type { Order } from '../../../types/order';

/** Inline tags on each orders row (t08, 19 Nov 2026): staff add and remove
 * a tag on the row, the whole list goes to PATCH /orders/{id}, the row shows
 * the answer; a shadow reader sees chips and no editor. */

const order = (id: string, po: string, tags: string[]): Order =>
  ({
    id, order_number: `ORD-${id}`, po_number: po, placed_at: '2026-11-17T15:00:00Z', release_state: null, tags, channel: 'taylor',
    line_items: [{ id: `${id}-l1`, product_name: 'Business cards', product_sku: 'BC-1', quantity: 1, pack_size: 250 }],
  }) as unknown as Order;

const updateOrder = vi.fn((id: string, data: { tags?: string[] }) => Promise.resolve(order(id, 'W7001234', data.tags ?? [])));
vi.mock('../../../api/orders', () => ({
  listPrinterOrders: vi.fn(() => Promise.resolve([order('o1', 'W7001234', ['Express'])])),
  listShopTags: vi.fn(() => Promise.resolve({ tags: ['Express', 'Rush'] })),
  updateOrder: (id: string, data: { tags?: string[] }) => updateOrder(id, data),
}));
vi.mock('../../../api/production', () => ({ listBatches: vi.fn(() => Promise.resolve([])), listTaylorPool: vi.fn(() => Promise.resolve([])) }));
vi.mock('../../../api/proposals', () => ({ listProposals: vi.fn(() => Promise.resolve([])) }));
vi.mock('../../../api/team', () => ({ listMembers: vi.fn(() => Promise.resolve([])) }));

describe('All Channel Orders — inline tags', () => {
  it('adds from the shop list and removes, PATCHing the whole list each time', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AllChannelOrdersPage readOnly={false} />
      </MemoryRouter>,
    );
    const editor = await screen.findByTestId('tag-editor');
    expect(within(editor).getAllByTestId('row-tag').map((t) => t.textContent)).toEqual(['Express']);
    await user.click(within(editor).getByRole('button', { name: 'Add tag' }));
    await user.selectOptions(within(editor).getByRole('combobox', { name: 'Pick a tag' }), 'Rush');
    await waitFor(() => expect(updateOrder).toHaveBeenLastCalledWith('o1', { tags: ['Express', 'Rush'] }));
    await waitFor(() => expect(within(screen.getByTestId('tag-editor')).getAllByTestId('row-tag').map((t) => t.textContent)).toEqual(['Express', 'Rush']));
    await user.click(screen.getByRole('button', { name: 'Remove tag Express' }));
    await waitFor(() => expect(updateOrder).toHaveBeenLastCalledWith('o1', { tags: ['Rush'] }));
  });

  it('shows chips and no editor to a shadow reader', async () => {
    render(
      <MemoryRouter>
        <AllChannelOrdersPage readOnly />
      </MemoryRouter>,
    );
    await screen.findByRole('navigation', { name: 'Production' });
    expect(screen.queryByTestId('tag-editor')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Add tag' })).toBeNull();
  });
});
