import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import AllChannelOrdersPage from '../AllChannelOrdersPage';
import type { Order } from '../../../types/order';

/** Order tags on All Channel Orders (Andrew, 17 Nov 2026; ruling 18 Nov
 * 2026): every tag the orders carry is a chip; one press keeps only those
 * orders, a second hides them — Sprouts' Express orders out of the view — and
 * each order row links to the order's whereabouts. */

const order = (id: string, po: string, tags: string[]): Order =>
  ({
    id, order_number: `ORD-${id}`, po_number: po, placed_at: '2026-11-17T15:00:00Z', release_state: null, tags, channel: 'taylor',
    line_items: [{ id: `${id}-l1`, product_name: 'Business cards', product_sku: 'BC-1', quantity: 1, pack_size: 250 }],
  }) as unknown as Order;

vi.mock('../../../api/orders', () => ({
  listPrinterOrders: vi.fn(() => Promise.resolve([order('o1', 'W7001234', ['Express']), order('o2', 'W7001235', []), order('o3', 'W7001236', ['Express', 'Rush'])])),
  // t08 (19 Nov 2026): the page loads the shop's tag list for the inline editor; a mock, no assertion changed.
  listShopTags: vi.fn(() => Promise.resolve({ tags: ['Express', 'Rush'] })),
  updateOrder: vi.fn(),
}));
vi.mock('../../../api/production', () => ({ listBatches: vi.fn(() => Promise.resolve([])), listTaylorPool: vi.fn(() => Promise.resolve([])) }));
vi.mock('../../../api/proposals', () => ({ listProposals: vi.fn(() => Promise.resolve([])) }));
vi.mock('../../../api/team', () => ({ listMembers: vi.fn(() => Promise.resolve([])) }));

function rows() {
  return screen.getAllByTestId('whereabouts-link').map((a) => a.textContent);
}

describe('All Channel Orders — tags and the whereabouts link', () => {
  it('shows a chip per tag; one press keeps only those orders, a second hides them, a third clears', async () => {
    render(
      <MemoryRouter>
        <AllChannelOrdersPage readOnly={false} />
      </MemoryRouter>,
    );
    const chips = await screen.findByTestId('tag-chips');
    expect(within(chips).getByRole('button', { name: 'Express' })).toBeInTheDocument();
    expect(within(chips).getByRole('button', { name: 'Rush' })).toBeInTheDocument();
    expect(rows()).toEqual(['W7001234', 'W7001235', 'W7001236']);
    expect(screen.getAllByTestId('row-tag').map((t) => t.textContent)).toEqual(['Express', 'Express', 'Rush']);

    await userEvent.click(within(chips).getByRole('button', { name: 'Express' }));
    expect(rows()).toEqual(['W7001234', 'W7001236']);
    expect(screen.getByTestId('tag-filter-text')).toHaveTextContent('only Express');

    await userEvent.click(within(chips).getByRole('button', { name: 'only Express' }));
    expect(rows()).toEqual(['W7001235']);
    expect(screen.getByTestId('tag-filter-text')).toHaveTextContent('without Express');

    await userEvent.click(within(chips).getByRole('button', { name: 'no Express' }));
    expect(rows()).toEqual(['W7001234', 'W7001235', 'W7001236']);
    expect(screen.queryByTestId('tag-filter-text')).toBeNull();
  });

  it('each order row links to the order’s whereabouts', async () => {
    render(
      <MemoryRouter>
        <AllChannelOrdersPage readOnly={false} />
      </MemoryRouter>,
    );
    const links = await screen.findAllByTestId('whereabouts-link');
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/production/orders/o1/whereabouts', '/production/orders/o2/whereabouts', '/production/orders/o3/whereabouts']);
    expect(links[0]).toHaveAttribute('title', 'Where did this order go');
  });
});
