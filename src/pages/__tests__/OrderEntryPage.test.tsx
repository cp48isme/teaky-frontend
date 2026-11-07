import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import OrderEntryPage, { priceNow } from '../OrderEntryPage';

/** Day 5, Part C — Jeni's order entry (board 6) on the widened on-behalf
 * path: a reorder copies the people, the ship-to and the lines with the
 * price last time beside the catalogue's now; needed-by is never copied;
 * save carries the reorder source and no needed_by. */

const product = { id: 'p-bc', name: 'Business cards, 3.5 x 2', sku: 'BC-100', pack_size: 250, lead_time_band: 'days_2_5', pricing_tiers: [{ min_qty: 1, max_qty: null, unit_price: 68 }], base_price: 68 };
const past = {
  id: 'o-10391', order_number: 'T-10391', po_number: 'HIE-4471', portal_id: 'portal-1', placed_at: '2026-10-14T15:00:00Z', needed_by: '2026-10-20', status: 'submitted',
  shipping_address: { name: 'Holiday Inn Express Atlanta Airport North', attention: 'Front desk', line1: '1380 Virginia Ave', city: 'Atlanta', state: 'GA', postal_code: '30344', country: 'US' },
  ordering_contact: { name: 'Pat Buyer', title: 'GM', email: 'pat@example.com', phone: '404-555-0100' },
  for_whom: { name: 'Sam Front', title: 'Front desk', email: null, phone: null },
  line_items: [{ id: 'l1', product_id: 'p-bc', product_name: 'Business cards, 3.5 x 2', quantity: 2, pack_size: 250, unit_price: 62, line_total: 124 }],
};
const createOrderOnBehalf = vi.fn((_request: unknown) => Promise.resolve({ id: 'o-new', order_number: 'T-10443' }));
vi.mock('../../api/orders', () => ({
  getPrinterOrder: vi.fn(() => Promise.resolve(past)),
  createOrderOnBehalf: (...args: unknown[]) => createOrderOnBehalf(...(args as [])),
}));
vi.mock('../../api/portals', () => ({ listPortals: vi.fn(() => Promise.resolve([{ id: 'portal-1', name: 'Holiday Inn Express Atlanta Airport North', slug: 'hie-atl' }])) }));
vi.mock('../../api/products', () => ({ listProducts: vi.fn(() => Promise.resolve([product])) }));

describe('Order entry, the reorder', () => {
  it('leaves needed-by blank on a reorder and saves with the source and no needed_by', async () => {
    render(
      <MemoryRouter initialEntries={['/orders/entry?reorder=o-10391']}>
        <OrderEntryPage />
      </MemoryRouter>,
    );
    expect(await screen.findByTestId('reorder-of')).toHaveTextContent('Reorder of HIE-4471');
    await waitFor(() => expect((screen.getByLabelText('Contact name') as HTMLInputElement).value).toBe('Pat Buyer'));
    expect((screen.getByLabelText('Ship-to name') as HTMLInputElement).value).toBe('Holiday Inn Express Atlanta Airport North');
    expect((screen.getByLabelText('Needed by') as HTMLInputElement).value).toBe('');
    expect((screen.getByLabelText("Hotel's PO (if they gave one)") as HTMLInputElement).value).toBe('');
    await userEvent.click(screen.getByTestId('save-order'));
    await waitFor(() => expect(createOrderOnBehalf).toHaveBeenCalledTimes(1));
    const sent = createOrderOnBehalf.mock.calls[0][0] as Record<string, unknown>;
    expect(sent.reordered_from_order_id).toBe('o-10391');
    expect(sent.needed_by).toBeNull();
    expect(sent.ordering_contact).toEqual({ name: 'Pat Buyer', title: 'GM', email: 'pat@example.com', phone: '404-555-0100' });
    expect(sent.for_whom).toEqual({ name: 'Sam Front', title: 'Front desk', email: null, phone: null });
    expect(sent.channel).toBe('managed');
    expect(await screen.findByRole('status')).toHaveTextContent('Teaky number T-10443');
  });

  it('shows the price last time beside the catalogue price now on a reordered line', async () => {
    render(
      <MemoryRouter initialEntries={['/orders/entry?reorder=o-10391']}>
        <OrderEntryPage />
      </MemoryRouter>,
    );
    const price = await screen.findByTestId('price-0');
    await waitFor(() => expect(price).toHaveTextContent('last time $62.00 · catalogue now $68.00'));
    expect(price).toHaveTextContent('per pack of 250');
    expect(priceNow(product as never, 2)).toBe(68);
    await userEvent.click(screen.getByText('+ lead time'));
    expect(screen.getByTestId('lead-time-0')).toHaveTextContent('Lead time: days 2 5');
  });
});
