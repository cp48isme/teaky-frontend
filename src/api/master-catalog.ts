import { apiRequest } from './client';

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

export async function searchMasterCatalog(
  params: MasterCatalogSearchParams,
): Promise<MasterCatalogProduct[]> {
  const searchParams = new URLSearchParams();
  if (params.query) searchParams.set('query', params.query);
  if (params.category) searchParams.set('category', params.category);
  if (params.subcategory) searchParams.set('subcategory', params.subcategory);
  if (params.supplier) searchParams.set('supplier', params.supplier);
  if (params.product_type) searchParams.set('product_type', params.product_type);
  if (params.limit) searchParams.set('limit', params.limit.toString());
  if (params.offset) searchParams.set('offset', params.offset.toString());

  const qs = searchParams.toString();
  return apiRequest<MasterCatalogProduct[]>(
    `/master-catalog${qs ? `?${qs}` : ''}`,
  );
}

export async function getMasterCatalogCategories(): Promise<string[]> {
  return apiRequest<string[]>('/master-catalog/categories');
}

export async function getMasterProduct(
  productId: string,
): Promise<MasterCatalogProduct> {
  return apiRequest<MasterCatalogProduct>(`/master-catalog/${productId}`);
}

export async function cloneProductToPortal(
  masterProductId: string,
  portalId: string,
): Promise<{ created: number; skipped: number; errors: string[] }> {
  return apiRequest(
    `/master-catalog/clone`,
    {
      method: 'POST',
      body: JSON.stringify({
        master_product_ids: [masterProductId],
        target_portal_id: portalId,
      }),
    },
  );
}
