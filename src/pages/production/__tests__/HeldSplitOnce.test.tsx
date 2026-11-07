import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import HeldPage from '../HeldPage';
import type { HeldQueueEntry } from '../../../types/releaseUnit';

/** Day 4, Part E: the one-time split. Pressing "Split by stock" on a
 * mixed-stock hold calls the split route for that hold with the resolution;
 * the shop setting is not written. */

const held: HeldQueueEntry = {
  unit_id: 'u-2', kind: 'shipment', source_order_id: 'o2', order_number: 'ORD-2', reference: 'W597589', release_state: null, age_seconds: 7200,
  open_holds: [{ hold_id: 'h-2', reason: 'stock_mixed', detail: 'lines need different stocks: 100#, 80#', line_item_id: 'l2', case_key: 'order:o2', prior_decision: null }],
};
const splitHoldOnce = vi.fn(() => Promise.resolve({}));
const updateProductionSettings = vi.fn();
vi.mock('../../../api/releaseUnits', () => ({
  listHeldQueue: vi.fn(() => Promise.resolve([held])),
  clearUnitHold: vi.fn(),
  splitHoldOnce: (...args: unknown[]) => splitHoldOnce(...(args as [])),
}));
vi.mock('../../../api/orders', () => ({
  listPrinterOrders: vi.fn(() => Promise.resolve([{ id: 'o2', order_number: 'ORD-2', po_number: 'W597589', line_items: [{ id: 'l2', product_name: 'Business card, standard', product_sku: 'BB-STD-BC', quantity: 2, pack_size: 250 }] }])),
}));
vi.mock('../../../api/production', () => ({
  listTaylorPool: vi.fn(() => Promise.resolve([])),
  getProductionSettings: vi.fn(() => Promise.resolve({ split_when_unplaceable: false, gang_whole_orders: true, auto_push_when_full: false, hold_age_days: 2, shop_name: 'Single Source', timezone: 'America/Chicago' })),
  updateProductionSettings: (...args: unknown[]) => updateProductionSettings(...(args as [])),
  getSpecSuggestion: vi.fn(),
  pullTaylorNow: vi.fn(),
}));

describe('Held, the one-time split', () => {
  it('splits the mixed-stock order once through the split route and leaves the shop rule alone', async () => {
    render(
      <MemoryRouter>
        <HeldPage />
      </MemoryRouter>,
    );
    const button = await screen.findByTestId('split-once');
    expect(button).toHaveTextContent('Split by stock');
    expect(button).not.toBeDisabled();
    await userEvent.click(button);
    await waitFor(() => expect(splitHoldOnce).toHaveBeenCalledTimes(1));
    const [unitId, holdId, resolution] = (splitHoldOnce.mock.calls[0] as unknown as [string, string, { evidence_kind: string; evidence_note: string; answer: string }]);
    expect(unitId).toBe('u-2');
    expect(holdId).toBe('h-2');
    expect(resolution.answer).toBe('split once');
    expect(resolution.evidence_note).toContain('one batch per stock');
    expect(updateProductionSettings).not.toHaveBeenCalled();
    expect(await screen.findByText(/split once — its lines are placed; the shop rule is unchanged/)).toBeTruthy();
  });
});
