import { apiRequest } from './client';
import type {
  ProductVariant,
  CreateVariantRequest,
  UpdateVariantRequest,
} from '../types/product-variant';

export async function listVariants(
  portalId: string,
  productId: string,
): Promise<ProductVariant[]> {
  return apiRequest<ProductVariant[]>(
    `/portals/${portalId}/products/${productId}/variants`,
  );
}

export async function createVariant(
  portalId: string,
  productId: string,
  data: CreateVariantRequest,
): Promise<ProductVariant> {
  return apiRequest<ProductVariant>(
    `/portals/${portalId}/products/${productId}/variants`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
}

export async function updateVariant(
  portalId: string,
  productId: string,
  variantId: string,
  data: UpdateVariantRequest,
): Promise<ProductVariant> {
  return apiRequest<ProductVariant>(
    `/portals/${portalId}/products/${productId}/variants/${variantId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );
}

export async function deleteVariant(
  portalId: string,
  productId: string,
  variantId: string,
): Promise<void> {
  return apiRequest<void>(
    `/portals/${portalId}/products/${productId}/variants/${variantId}`,
    {
      method: 'DELETE',
    },
  );
}
