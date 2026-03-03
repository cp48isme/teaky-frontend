export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string | null;
  size: string | null;
  color: string | null;
  price_override: number | null;
  stock_quantity: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateVariantRequest {
  sku?: string;
  size?: string;
  color?: string;
  price_override?: number;
  stock_quantity?: number;
  is_active?: boolean;
}

export interface UpdateVariantRequest {
  sku?: string;
  size?: string;
  color?: string;
  price_override?: number | null;
  stock_quantity?: number | null;
  is_active?: boolean;
}
