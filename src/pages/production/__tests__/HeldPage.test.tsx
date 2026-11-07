import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import HeldPage from '../HeldPage';
import type { HeldQueueEntry } from '../../../types/releaseUnit';

/** The one-press answer: pressing the suggested stock calls the clear-hold
 * route with that stock as the answer and the evidence rows as the note;
 * the server writes the spec row with source=person (proven on the backend). */

const held: HeldQueueEntry = {
  unit_id: 'u-1', kind: 'production', source_order_id: 'o1', order_number: 'ORD-1', reference: '13361-02', release_state: null, age_seconds: 172800,
  open_holds: [{ hold_id: 'h-1', reason: 'stock_unknown', detail: 'stock unknown for KU-MED-BC2', line_item_id: 'l1', case_key: 'product_key:KU-MED-BC2', prior_decision: null }],
};
const clearUnitHold = vi.fn(() => Promise.resolve({}));
vi.mock('../../../api/releaseUnits', () => ({
  listHeldQueue: vi.fn(() => Promise.resolve([held])),
  clearUnitHold: (...args: unknown[]) => clearUnitHold(...(args as [])),
}));
vi.mock('../../../api/orders', () => ({
  listPrinterOrders: vi.fn(() => Promise.resolve([{ id: 'o1', order_number: 'ORD-1', po_number: '13361-02', line_items: [{ id: 'l1', product_name: 'KU Med BC', product_sku: 'KU-MED-BC2', quantity: 1, pack_size: 250 }] }])),
}));
vi.mock('../../../api/production', () => ({
  listTaylorPool: vi.fn(() => Promise.resolve([])),
  getProductionSettings: vi.fn(() => Promise.resolve({ split_when_unplaceable: false, gang_whole_orders: true, hold_age_days: 2, shop_name: 'Single Source', timezone: 'America/Chicago' })),
  updateProductionSettings: vi.fn(),
  getSpecSuggestion: vi.fn(() =>
    Promise.resolve({
      product_key: 'KU-MED-BC2', library: null, proposals: [],
      history: [{ stock: '100#', evidence: [{ kind: 'customer_products', stock: '100#', detail: "KU-MED-BC (the same customer's other card) ran on 11 batches" }] }],
      leading_source: 'history', leading_value: '100#', agrees: null,
    }),
  ),
  pullTaylorNow: vi.fn(),
}));

describe('Held, the one press', () => {
  it('puts the stock-unknown hold under Needs a decision and answers it with one press', async () => {
    render(
      <MemoryRouter>
        <HeldPage />
      </MemoryRouter>,
    );
    const card = await screen.findByTestId('decision-stock_unknown');
    expect(card).toHaveTextContent('Stock unknown');
    expect(card).toHaveTextContent('13361-02');
    expect(screen.getByText('Nothing is waiting for a fact.')).toBeInTheDocument();
    const press = await screen.findByRole('button', { name: '100# — answer and place it' });
    await userEvent.click(press);
    await waitFor(() => expect(clearUnitHold).toHaveBeenCalledTimes(1));
    const [unitId, holdId, resolution] = clearUnitHold.mock.calls[0] as unknown as [string, string, { answer: string; evidence_kind: string; evidence_note: string }];
    expect(unitId).toBe('u-1');
    expect(holdId).toBe('h-1');
    expect(resolution.answer).toBe('100#');
    expect(resolution.evidence_kind).toBe('other');
    expect(resolution.evidence_note).toContain('ran on 11 batches');
  });
});
