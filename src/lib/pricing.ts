import type { Product } from '../types/product';

/**
 * The product's current unit price for a quantity: the pricing tier whose
 * range contains the quantity, else the first tier. Reorders use this rather
 * than the price stored on the old order (buyer-journey item 6, 2026-09-25).
 */
export function unitPriceFor(product: Pick<Product, 'pricing_tiers'>, quantity: number): number | null {
  const tiers = product.pricing_tiers;
  if (!tiers || tiers.length === 0) return null;
  const match = tiers.find(
    (t) => quantity >= t.min_qty && (t.max_qty == null || quantity <= t.max_qty),
  );
  return Number((match ?? tiers[0]).unit_price);
}
