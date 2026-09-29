import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useReorder, canReorder } from '../useReorder';
import type { Order } from '../../types/order';
import type { Product } from '../../types/product';

// Buyer-journey item 6 (2026-09-25): reorder from any non-cancelled order at the
// product's current tier price, never the price stored on the old order.

const addItem = vi.fn().mockResolvedValue(undefined);
const products = [
  { id: 'prod-pp', name: 'Parking Passes', pricing_tiers: [{ min_qty: 1, max_qty: 999, unit_price: 0.09 }, { min_qty: 1000, max_qty: null, unit_price: 0.08 }] },
] as unknown as Product[];
vi.mock('../../contexts/CartContext', () => ({ useCart: () => ({ addItem }) }));
vi.mock('../../contexts/PortalContext', () => ({ usePortalContext: () => ({ products }) }));

const order = {
  status: 'submitted',
  line_items: [
    { id: 'li1', product_id: 'prod-pp', product_name: 'Parking Passes', quantity: 1000, size: null, color: null, unit_price: 0.07 },
    { id: 'li2', product_id: 'prod-gone', product_name: 'Old Door Hanger', quantity: 200, size: null, color: null, unit_price: 0.5 },
  ],
} as unknown as Order;

describe('useReorder', () => {
  beforeEach(() => addItem.mockClear());

  it('adds each line at the current tier price and reports lines no longer in the catalog', async () => {
    const { result } = renderHook(() => useReorder());
    let outcome: Awaited<ReturnType<typeof result.current.reorder>> | undefined;
    await act(async () => {
      outcome = await result.current.reorder(order);
    });
    expect(addItem).toHaveBeenCalledTimes(1);
    expect(addItem).toHaveBeenCalledWith({ product_id: 'prod-pp', quantity: 1000, size: undefined, color: undefined, unit_price: 0.08 });
    expect(outcome).toEqual({ added: 1, skipped: ['Old Door Hanger'] });
  });

  it('allows reorder for any status except cancelled', () => {
    expect(canReorder({ status: 'submitted' })).toBe(true);
    expect(canReorder({ status: 'in_production' })).toBe(true);
    expect(canReorder({ status: 'completed' })).toBe(true);
    expect(canReorder({ status: 'cancelled' })).toBe(false);
  });
});
