import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import StockedGoodsPage, { packText, piecesText, refusalText } from '../StockedGoodsPage';
import { ApiError } from '../../../api/client';
import { resetProductionShell } from '../../../hooks/useProductionShell';
import type { MarkPickedResult, StockedGoodsUnit } from '../../../types/production';

/** Walk C2 (26 Nov 2026): the pick lines are the most legible thing on the
 * card and say the item, the pieces and the catalogue code in words; the
 * confirm's result renders in place on the card (picked badge, the shipping
 * row as a file); every refusal shows its reason on the card; no undo is
 * offered because the server has no undo route. */

const unit = (over: Partial<StockedGoodsUnit>): StockedGoodsUnit => ({
  unit_id: 'u-1', order_id: 'o1', po: 'W700002', order_number: 'ORD-1', customer: 'Sprouts', received_at: '2026-11-20T10:00:00Z', age_seconds: 3 * 86400,
  lines: [{ line_item_id: 'l1', product: 'PLU1090', product_name: 'Plush bear, 6 pack', quantity: 1, pack_size: 6 }],
  mixed_po: false, picked_at: null, picked_by_id: null, shipping_csv: null, ...over,
});
const waiting = unit({});
const loose = unit({
  unit_id: 'u-2', po: 'W700004',
  lines: [
    { line_item_id: 'l2', product: 'SFM100', product_name: 'Sticker, matte', quantity: 12, pack_size: 1 },
    { line_item_id: 'l3', product: 'PLU1020', product_name: '', quantity: 2, pack_size: 6 },
  ],
});
const csv = { file_id: 'f1', filename: 'ALLORDER-W700002.csv', sha256: 'abc', size_bytes: 300, generated_at: '2026-11-26T18:00:00Z' };

let rows: StockedGoodsUnit[] = [];
const listStockedGoodsUnits = vi.fn(() => Promise.resolve(rows));
const markPicked = vi.fn<(unitId: string, confirm: boolean) => Promise<MarkPickedResult>>();
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

function renderPage() {
  return render(
    <MemoryRouter>
      <StockedGoodsPage readOnly={false} />
    </MemoryRouter>,
  );
}

/** The two-step answer: the plan echoes the unit; the confirm returns it picked with the row written. */
function answerBothSteps(target: StockedGoodsUnit) {
  markPicked.mockImplementation((unitId, confirm) => {
    if (unitId !== target.unit_id) return Promise.reject(new ApiError(404, 'no such unit'));
    return Promise.resolve({
      applied: confirm,
      unit: confirm ? { ...target, picked_at: '2026-11-26T18:00:00Z', picked_by_id: 'u-me', shipping_csv: csv } : target,
      shipping_rows: 1,
      mixed_po_note: null,
    });
  });
}

function inlineFontSize(el: Element): number {
  const size = (el as HTMLElement).style?.fontSize ?? '';
  return size.endsWith('px') ? Number.parseFloat(size) : 0;
}

beforeEach(() => {
  resetProductionShell();
  rows = [waiting, loose];
  listStockedGoodsUnits.mockClear();
  markPicked.mockReset();
  downloadShippingCsv.mockClear();
});

describe('the words on a pick line', () => {
  it('pieces are packs times the pack size; the packing reads in words; a loose line has no packing', () => {
    expect(piecesText({ quantity: 1, pack_size: 6 })).toBe('6 pieces');
    expect(piecesText({ quantity: 2, pack_size: 6 })).toBe('12 pieces');
    expect(piecesText({ quantity: 1, pack_size: 1 })).toBe('1 piece');
    expect(packText({ quantity: 1, pack_size: 6 })).toBe('1 pack of 6');
    expect(packText({ quantity: 2, pack_size: 6 })).toBe('2 packs of 6');
    expect(packText({ quantity: 12, pack_size: 1 })).toBe('');
  });

  it('a refusal names what refused it', () => {
    expect(refusalText(new ApiError(409, 'PO W700002 is already picked'))).toBe('Not marked — PO W700002 is already picked');
    expect(refusalText(new ApiError(403, 'production:rules is required'))).toBe('Not allowed — production:rules is required');
    expect(refusalText(new TypeError('Failed to fetch'))).toBe('Could not reach the server — Failed to fetch. Nothing was marked.');
  });
});

describe('the stocked goods card', () => {
  it('says in one sentence what the page is for', async () => {
    renderPage();
    await screen.findByTestId('stocked-unit-u-1');
    expect(screen.getByTestId('page-purpose')).toHaveTextContent(/picks and packs goods from the shelf/);
  });

  it('the pick line is the card heading, the largest and a proportional face, and reads in plain words', async () => {
    renderPage();
    const card = await screen.findByTestId('stocked-unit-u-1');
    const heading = within(card).getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Plush bear, 6 pack — 6 pieces');
    expect(within(card).getByTestId('pick-line')).toHaveTextContent('Catalogue code PLU1090 · 1 pack of 6');
    expect(card.textContent).not.toMatch(/1 × 6/);
    expect(heading.style.fontFamily).toBe('');
    expect(heading.style.color).not.toBe('');
    const largest = Math.max(...Array.from(card.querySelectorAll('*')).map(inlineFontSize));
    expect(inlineFontSize(heading)).toBe(largest);
    expect(inlineFontSize(heading)).toBeGreaterThan(14);
  });

  it('a loose line reads as pieces with no packing; a line without a name reads by its code', async () => {
    renderPage();
    const card = await screen.findByTestId('stocked-unit-u-2');
    const [sticker, bear] = within(card).getAllByTestId('pick-line');
    expect(within(sticker!).getByRole('heading', { level: 2 })).toHaveTextContent('Sticker, matte — 12 pieces');
    expect(sticker).toHaveTextContent('Catalogue code SFM100');
    expect(sticker!.textContent).not.toMatch(/pack/);
    expect(within(bear!).getByRole('heading', { level: 2 })).toHaveTextContent('PLU1020 — 12 pieces');
    expect(bear).toHaveTextContent('Catalogue code PLU1020 · 2 packs of 6');
  });

  it('after the confirm the result renders in place on the card: picked by you, the row as a file, no undo', async () => {
    answerBothSteps(waiting);
    renderPage();
    const card = await screen.findByTestId('stocked-unit-u-1');
    await userEvent.click(within(card).getByTestId('mark-picked'));
    await userEvent.click(within(await screen.findByTestId('mark-picked-dialog')).getByTestId('mark-picked-confirm'));
    await waitFor(() => expect(markPicked).toHaveBeenCalledWith('u-1', true));
    const after = screen.getByTestId('stocked-unit-u-1');
    expect(after).toHaveAttribute('data-picked', 'yes');
    expect(within(after).getByTestId('picked-badge')).toHaveTextContent(/^Picked .* by you$/);
    const result = within(after).getByTestId('mark-picked-result');
    expect(result).toHaveAttribute('role', 'status');
    expect(result).toHaveTextContent('PO W700002 marked picked; its shipping row is written (1 row).');
    expect(result).toHaveTextContent('Shipping row written — ALLORDER-W700002.csv');
    expect(within(after).getByTestId('shipping-csv')).toHaveTextContent('ALLORDER-W700002.csv');
    expect(within(after).queryByTestId('mark-picked')).toBeNull();
    expect(screen.queryByRole('button', { name: /undo/i })).toBeNull();
    // The result is on the card, not only at the top of the page.
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(after.contains(screen.getByRole('status'))).toBe(true);
    await userEvent.click(within(after).getByTestId('shipping-csv'));
    expect(downloadShippingCsv).toHaveBeenCalledWith('u-1', 'ALLORDER-W700002.csv');
  });

  it('a 409 at the plan shows its reason on the card and opens no dialog', async () => {
    markPicked.mockRejectedValue(new ApiError(409, 'PO W700002 is already picked'));
    renderPage();
    const card = await screen.findByTestId('stocked-unit-u-1');
    await userEvent.click(within(card).getByTestId('mark-picked'));
    const refusal = await within(card).findByTestId('mark-picked-refusal');
    expect(refusal).toHaveAttribute('role', 'alert');
    expect(refusal).toHaveTextContent('Not marked — PO W700002 is already picked');
    expect(screen.queryByTestId('mark-picked-dialog')).toBeNull();
    expect(within(screen.getByTestId('stocked-unit-u-2')).queryByTestId('mark-picked-refusal')).toBeNull();
  });

  it('a 403 and a network failure at the confirm close the dialog and show the reason on the card', async () => {
    markPicked.mockImplementation((unitId, confirm) => {
      if (!confirm) return Promise.resolve({ applied: false, unit: unitId === 'u-1' ? waiting : loose, shipping_rows: 0, mixed_po_note: null });
      return Promise.reject(unitId === 'u-1' ? new ApiError(403, 'production:rules is required') : new TypeError('Failed to fetch'));
    });
    renderPage();
    const first = await screen.findByTestId('stocked-unit-u-1');
    await userEvent.click(within(first).getByTestId('mark-picked'));
    await userEvent.click(within(await screen.findByTestId('mark-picked-dialog')).getByTestId('mark-picked-confirm'));
    expect(await within(first).findByTestId('mark-picked-refusal')).toHaveTextContent('Not allowed — production:rules is required');
    expect(screen.queryByTestId('mark-picked-dialog')).toBeNull();
    expect(first).toHaveAttribute('data-picked', 'no');
    const second = screen.getByTestId('stocked-unit-u-2');
    await userEvent.click(within(second).getByTestId('mark-picked'));
    await userEvent.click(within(await screen.findByTestId('mark-picked-dialog')).getByTestId('mark-picked-confirm'));
    expect(await within(second).findByTestId('mark-picked-refusal')).toHaveTextContent('Could not reach the server — Failed to fetch. Nothing was marked.');
  });
});
