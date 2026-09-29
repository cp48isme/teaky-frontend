import { useCallback, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { usePortalContext } from '../contexts/PortalContext';
import { unitPriceFor } from '../lib/pricing';
import type { Order } from '../types/order';

export interface ReorderResult {
  added: number;
  /** Product names that could not be re-added: no longer in the catalog or unpriced. */
  skipped: string[];
}

/**
 * Re-adds an order's lines to the cart at the product's current price. Works
 * for any order that was not cancelled; the old order's status and its stored
 * unit price play no part (buyer-journey item 6, 2026-09-25).
 */
export function useReorder() {
  const { addItem } = useCart();
  const { products } = usePortalContext();
  const [reordering, setReordering] = useState(false);

  const reorder = useCallback(
    async (order: Order): Promise<ReorderResult> => {
      setReordering(true);
      const result: ReorderResult = { added: 0, skipped: [] };
      try {
        for (const item of order.line_items) {
          const product = products.find((p) => p.id === item.product_id);
          const price = product ? unitPriceFor(product, item.quantity) : null;
          if (!product || price == null) {
            result.skipped.push(item.product_name);
            continue;
          }
          await addItem({
            product_id: item.product_id,
            quantity: item.quantity,
            size: item.size || undefined,
            color: item.color || undefined,
            unit_price: price,
          });
          result.added += 1;
        }
      } finally {
        setReordering(false);
      }
      return result;
    },
    [addItem, products],
  );

  return { reorder, reordering };
}

export function canReorder(order: Pick<Order, 'status'>): boolean {
  return order.status !== 'cancelled';
}
