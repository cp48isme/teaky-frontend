import { apiRequest } from './client';
import type {
  CategoryMargin,
  CreateProductRequest,
  Product,
  RepriceRequest,
  RepriceResult,
  UpdateProductRequest,
} from '../types/product';

export async function createProduct(
  portalId: string,
  data: CreateProductRequest,
): Promise<Product> {
  return apiRequest<Product>(`/portals/${portalId}/products`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function listProducts(
  portalId: string,
): Promise<Product[]> {
  return apiRequest<Product[]>(`/portals/${portalId}/products`);
}

export async function updateProduct(
  portalId: string,
  productId: string,
  data: UpdateProductRequest,
): Promise<Product> {
  return apiRequest<Product>(
    `/portals/${portalId}/products/${productId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );
}

export async function deleteProduct(
  portalId: string,
  productId: string,
): Promise<void> {
  return apiRequest<void>(
    `/portals/${portalId}/products/${productId}`,
    {
      method: 'DELETE',
    },
  );
}

export async function getProduct(
  portalId: string,
  productId: string,
): Promise<Product> {
  return apiRequest<Product>(`/portals/${portalId}/products/${productId}`);
}

/**
 * Bulk reprice as base_cost + margin. The server defaults to a dry run that
 * returns every old and new price and writes nothing; send dry_run: false to
 * apply.
 */
export async function repriceProducts(
  portalId: string,
  data: RepriceRequest,
): Promise<RepriceResult> {
  return apiRequest<RepriceResult>(`/portals/${portalId}/products/reprice`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function listCategoryMargins(
  portalId: string,
): Promise<CategoryMargin[]> {
  return apiRequest<CategoryMargin[]>(
    `/portals/${portalId}/products/category-margins`,
  );
}
