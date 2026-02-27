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
  sizes: SizeOption[];
  colors: ColorOption[];
  pricing_tiers: PricingTier[];
  mockup_urls: string[];
  min_order_qty: number;
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
}

export interface UpdateProductRequest {
  name?: string;
  sku?: string;
  description?: string;
  category?: string;
  sizes?: SizeOption[];
  colors?: ColorOption[];
  pricing_tiers?: PricingTier[];
  mockup_urls?: string[];
  min_order_qty?: number;
  status?: string;
  sort_order?: number;
}
