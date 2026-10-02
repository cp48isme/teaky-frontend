/**
 * Price and quantity labels for pack products. The server sets every price
 * (product.pack_price, cart/order unit_price); nothing here computes one.
 * A product with pack_size 1 reads as before ("$5.75 each", "3").
 */

const count = (n: number) => n.toLocaleString('en-US');
const money = (n: number) => `$${Number(n).toFixed(2)}`;

/** "$420.00 per 2,000" for a pack of 2,000; "$5.75 each" for a pack of one. */
export function packPriceLabel(price: number, packSize: number = 1): string {
  return packSize > 1 ? `${money(price)} per ${count(packSize)}` : `${money(price)} each`;
}

/** "2 × pack of 2,000 (4,000 pcs)" for packs; "3" for a pack of one. */
export function packQuantityLabel(packs: number, packSize: number = 1): string {
  return packSize > 1
    ? `${count(packs)} × pack of ${count(packSize)} (${count(packs * packSize)} pcs)`
    : count(packs);
}
