/**
 * The product categories the staff screens offer, and the one default a new
 * product is born with. One default, one place (visible-defect pass,
 * 2026-10-15): every screen that writes a category to the API imports it from
 * here, so the catalogue of a print broker never defaults to "apparel" again.
 */
export interface ProductCategoryOption {
  value: string;
  label: string;
}

export const PRODUCT_CATEGORIES: ProductCategoryOption[] = [
  { value: 'print', label: 'Print' },
  { value: 'stationery', label: 'Stationery' },
  { value: 'door_hangers', label: 'Door Hangers' },
  { value: 'guest_collateral', label: 'Guest Collateral' },
  { value: 'coupons_tickets', label: 'Coupons & Tickets' },
  { value: 'key_cards', label: 'Key Cards' },
  { value: 'parking', label: 'Parking' },
  { value: 'business_cards', label: 'Business Cards' },
  { value: 'signage', label: 'Signage' },
  { value: 'packaging', label: 'Packaging' },
  { value: 'promotional', label: 'Promotional' },
  { value: 'apparel', label: 'Apparel' },
];

/** What a product is before anyone picks a category. A generic print category, not a vertical. */
export const DEFAULT_PRODUCT_CATEGORY = 'print';

export function categoryLabel(value: string): string {
  return PRODUCT_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
