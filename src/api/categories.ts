import { apiRequest } from './client';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../types/category';

export async function listCategories(
  portalId: string,
): Promise<Category[]> {
  return apiRequest<Category[]>(`/portals/${portalId}/categories`);
}

export async function createCategory(
  portalId: string,
  data: CreateCategoryRequest,
): Promise<Category> {
  return apiRequest<Category>(`/portals/${portalId}/categories`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCategory(
  portalId: string,
  categoryId: string,
  data: UpdateCategoryRequest,
): Promise<Category> {
  return apiRequest<Category>(
    `/portals/${portalId}/categories/${categoryId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  );
}

export async function deleteCategory(
  portalId: string,
  categoryId: string,
): Promise<void> {
  return apiRequest<void>(
    `/portals/${portalId}/categories/${categoryId}`,
    {
      method: 'DELETE',
    },
  );
}
