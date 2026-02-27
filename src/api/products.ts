import { apiRequest } from './client';
import type {
  Product,
  CreateProductRequest,
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
