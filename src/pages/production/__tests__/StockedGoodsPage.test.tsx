import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import StockedGoodsPage from '../StockedGoodsPage';
import { rowsFromOrders } from '../AllChannelOrdersPage';
import { resetProductionShell } from '../../../hooks/useProductionShell';
import type { Order } from '../../../types/order';
import type { StockedGoodsUnit } from '../../../types/production';

/** Stocked goods end to end (dispatch 23 Nov 2026, item 1): the units listed
 * oldest first with their picked state; Mark picked is two steps — the plan
 * (confirm false) then the confirm — and names the PO; a mixed PO's note is
 * shown; a read-only reader gets no act; the written row is offered as a
 * file; All Channel Orders reads a portal line's stored lane. */

const unit = (over: Partial<StockedGoodsUnit>): StockedGoodsUnit => ({
  unit_id: 'u-sg-1', order_id: 'o1', po: 'W700002', order_number: 'ORD-1', customer: 'Sprouts', received_at: '2026-11-20T10:00:00Z', age_seconds: 3 * 86400,
  lines: [{ line_item_id: 'l1', product: 'PLU1020', product_name: 'Plush bear, 6 pack', quantity: 1, pack_size: 6 }],
  mixed_po: false, picked_at: null, picked_by_id: null, shipping_csv: null, ...over,
});
const waiting = unit({});
const mixed = unit({ unit_id: 'u-sg-2', po: 'W700003', mixed_po: true });
const picked = unit({ unit_id: 'u-sg-3', po: 'W700001', picked_at: '2026-11-23T18:00:00Z', picked_by_id: 'u-me', shipping_csv: { file_id: 'f1', filename: 'ALLORDER-W700001.csv', sha256: 'abc', size_bytes: 300, generated_at: '2026-11-23T18:00:00Z' } });

const listStockedGoodsUnits = vi.fn(() => Promise.resolve([waiting, mixed, picked]));
const markPicked = vi.fn((unitId: string, confirm: boolean) => {
  const target = [waiting, mixed].find((u) => u.unit_id === unitId)!;
  return Promise.resolve({ applied: confirm, unit: confirm ? { ...target, picked_at: '2026-11-23T19:00:00Z' } : target, shipping_rows: 1, mixed_po_note: target.mixed_po ? 'Stocked goods — ships separately from the press-run lines of PO W700003 (mixed PO; the ship-together rule waits on Andrew)' : null });
});
const downloadShippingCsv = vi.fn((_unitId: string, _filename: string) => Promise.resolve());
vi.mock('../../../api/production', () => ({
  listStockedGoodsUnits: () => listStockedGoodsUnits(),
  markPicked: (...a: unknown[]) => markPicked(...(a as [string, boolean])),
  downloadShippingCsv: (...a: unknown[]) => downloadShippingCsv(...(a as [string, string])),
  listBatches: vi.fn(() => Promise.resolve([])),
  listTaylorPool: vi.fn(() => Promise.resolve([])),
  getProductionSettings: vi.fn(() => Promise.resolve({ production_view: 'cards' })),
}));
vi.mock('../../../api/organizations', () => ({ getMyOrganization: vi.fn(() => Promise.resolve(null)), getProductionShell: vi.fn(() => Promise.resolve({ organization_id: 'o', name: 'Single Source US', mark: { url: 'https://app.example/logo.png', alt: 'Single Source US', source: 'shop_profile' } })) }));
vi.mock('../../../hooks/useSelfServeOnboarding', () => ({ useSelfServeOnboarding: () => ({ selfServe: false }) }));

beforeEach(() => {
  resetProductionShell();
  listStockedGoodsUnits.mockClear();
  markPicked.mockClear();
  downloadShippingCsv.mockClear();
});

describe('the stocked goods page', () => {
  it('lists the units to pick first, then the picked, with the mixed PO flagged and the row offered as a file', async () => {
    render(
      <MemoryRouter>
        <StockedGoodsPage readOnly={false} />
      </MemoryRouter>,
    );
    await screen.findByTestId('stocked-unit-u-sg-1');
    const cards = screen.getAllByTestId(/stocked-unit-/).map((c) => c.getAttribute('data-picked'));
    expect(cards).toEqual(['no', 'no', 'yes']);
    expect(within(screen.getByTestId('stocked-unit-u-sg-2')).getByTestId('mixed-po')).toHaveTextContent('ships separately');
    expect(within(screen.getByTestId('stocked-unit-u-sg-3')).queryByTestId('mark-picked')).toBeNull();
    await userEvent.click(within(screen.getByTestId('stocked-unit-u-sg-3')).getByTestId('shipping-csv'));
    expect(downloadShippingCsv).toHaveBeenCalledWith('u-sg-3', 'ALLORDER-W700001.csv');
  });

  it('Mark picked is two steps: the plan names the PO and writes nothing; the confirm writes', async () => {
    render(
      <MemoryRouter>
        <StockedGoodsPage readOnly={false} />
      </MemoryRouter>,
    );
    await userEvent.click(within(await screen.findByTestId('stocked-unit-u-sg-2')).getByTestId('mark-picked'));
    expect(markPicked).toHaveBeenCalledWith('u-sg-2', false);
    const dialog = await screen.findByTestId('mark-picked-dialog');
    expect(dialog).toHaveTextContent('Mark PO W700003 picked');
    expect(within(dialog).getByTestId('mixed-po-note')).toHaveTextContent('ships separately from the press-run lines of PO W700003');
    expect(markPicked).toHaveBeenCalledTimes(1);
    await userEvent.click(within(dialog).getByTestId('mark-picked-confirm'));
    await waitFor(() => expect(markPicked).toHaveBeenCalledWith('u-sg-2', true));
    expect(await screen.findByRole('status')).toHaveTextContent('PO W700003 marked picked; its shipping row is written (1 row).');
    expect(listStockedGoodsUnits).toHaveBeenCalledTimes(2);
  });

  it('a read-only reader sees the state and no act', async () => {
    render(
      <MemoryRouter>
        <StockedGoodsPage readOnly />
      </MemoryRouter>,
    );
    await screen.findByTestId('stocked-unit-u-sg-1');
    expect(screen.queryByTestId('mark-picked')).toBeNull();
  });
});

describe('All Channel Orders reads the stored lane', () => {
  it('a portal line with lane stocked_goods is on that lane; one without a lane is a press run', () => {
    const order = {
      id: 'o1', order_number: 'ORD-9', po_number: null, placed_at: '2026-11-20T10:00:00Z', release_state: null, tags: [], for_whom: null,
      line_items: [
        { id: 'l1', product_name: 'Plush bear', product_sku: 'PLU1020', quantity: 1, pack_size: 6, lane: 'stocked_goods' },
        { id: 'l2', product_name: 'Business cards', product_sku: 'PHC_BC', quantity: 2, pack_size: 500, lane: null },
      ],
    } as unknown as Order;
    const rows = rowsFromOrders([order], [], new Date('2026-11-23T10:00:00Z'));
    expect(rows.map((r) => r.lane)).toEqual(['stocked_goods', 'press_run']);
  });
});
