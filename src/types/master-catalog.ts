export interface MasterCatalogProduct {
  id: string;
  name: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  supplier: string | null;
  product_type: string | null;
  price_range: string | null;
  specifications: Record<string, unknown> | null;
}

export interface MasterCatalogSearchParams {
  query?: string;
  category?: string;
  subcategory?: string;
  supplier?: string;
  product_type?: string;
  limit?: number;
  offset?: number;
}
