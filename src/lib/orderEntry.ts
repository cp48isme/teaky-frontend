import type { Product } from '../types/product';

/** Day 5 (7 Nov 2026), Part C — the catalogue's price now for a quantity: the
 * pricing tier the quantity falls in (the highest tier when it is beyond the
 * last), else the base price. */
export function priceNow(product: Product | undefined, quantity: number): number | null {
  if (!product) return null;
  const tiers = [...(product.pricing_tiers ?? [])].sort((a, b) => a.min_qty - b.min_qty);
  const tier = tiers.filter((t) => quantity >= t.min_qty && (t.max_qty == null || quantity <= t.max_qty)).pop();
  if (tier) return tier.unit_price;
  if (tiers.length) return tiers[tiers.length - 1].unit_price;
  return product.base_price ?? null;
}

export function money(value: number | null | undefined): string {
  return value == null ? '—' : `$${value.toFixed(2)}`;
}
