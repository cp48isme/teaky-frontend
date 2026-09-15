export interface SizeOption {
  label: string;
  price_adjustment: number;
}

export interface ColorOption {
  name: string;
  hex_code: string | null;
  image_url: string | null;
}

export interface PricingTier {
  min_qty: number;
  max_qty: number | null;
  unit_price: number;
}

export interface Product {
  id: string;
  portal_id: string;
  sku: string | null;
  name: string;
  description: string | null;
  category: string;
  category_id: string | null;
  sizes: SizeOption[];
  colors: ColorOption[];
  pricing_tiers: PricingTier[];
  mockup_urls: string[];
  min_order_qty: number;
  /** Default retail unit price. JSON number (MoneyDecimal serializes as float). */
  base_price?: number | null;
  /** Supplier cost at quantity one. */
  base_cost?: number | null;
  /** Markup applied to base_cost to derive base_price. Serialized as a decimal string. */
  margin_percent?: string | null;
  /** A human set base_price by hand; bulk reprice skips it unless told otherwise. */
  price_locked?: boolean;
  cost_source?: string | null;
  cost_source_url?: string | null;
  cost_updated_at?: string | null;
  source_tier?: string | null;
  proof_required: boolean;
  safe_order_eligible: boolean;
  dm_external_id: string | null;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProductRequest {
  name: string;
  sku?: string;
  description?: string;
  category: string;
  sizes?: SizeOption[];
  colors?: ColorOption[];
  pricing_tiers?: PricingTier[];
  mockup_urls?: string[];
  min_order_qty?: number;
  base_price?: number;
  base_cost?: number;
  margin_percent?: string | number;
  price_locked?: boolean;
  cost_source?: string;
  cost_source_url?: string;
  proof_required?: boolean;
  safe_order_eligible?: boolean;
}

export interface UpdateProductRequest {
  name?: string;
  sku?: string;
  description?: string;
  category?: string;
  category_id?: string | null;
  sizes?: SizeOption[];
  colors?: ColorOption[];
  pricing_tiers?: PricingTier[];
  mockup_urls?: string[];
  min_order_qty?: number;
  base_price?: number;
  base_cost?: number;
  margin_percent?: string | number;
  price_locked?: boolean;
  cost_source?: string;
  cost_source_url?: string;
  proof_required?: boolean;
  safe_order_eligible?: boolean;
  dm_external_id?: string | null;
  status?: string;
  sort_order?: number;
}

/** POST /portals/{portal_id}/products/reprice */
export interface RepriceRequest {
  margin_percent: string | number;
  category?: string | null;
  include_locked?: boolean;
  /** Defaults to true on the server: preview only, writes nothing. */
  dry_run?: boolean;
}

export type RepriceSkipReason = 'no_base_cost' | 'price_locked';

export interface RepriceLine {
  product_id: string;
  sku: string | null;
  name: string;
  category: string;
  base_cost: number | null;
  old_price: number | null;
  new_price: number | null;
  skipped: RepriceSkipReason | null;
}

export interface RepriceResult {
  dry_run: boolean;
  margin_percent: string;
  category: string | null;
  matched: number;
  repriced: number;
  skipped: number;
  lines: RepriceLine[];
}

/** GET /portals/{portal_id}/products/category-margins */
export interface CategoryMargin {
  category: string;
  default_margin_percent: string;
  sample_size: number;
}
