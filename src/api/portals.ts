import { apiRequest } from './client';
import type {
  Portal,
  CreatePortalRequest,
  UpdatePortalRequest,
  PublicPortalResponse,
} from '../types/portal';
import type { Product } from '../types/product';
import type { Invitation } from '../types/team';

export async function createPortal(
  data: CreatePortalRequest,
): Promise<Portal> {
  return apiRequest<Portal>('/portals', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function listPortals(): Promise<Portal[]> {
  return apiRequest<Portal[]>('/portals');
}

export async function getPortal(portalId: string): Promise<Portal> {
  return apiRequest<Portal>(`/portals/${portalId}`);
}

export async function updatePortal(
  portalId: string,
  data: UpdatePortalRequest,
): Promise<Portal> {
  return apiRequest<Portal>(`/portals/${portalId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function publishPortal(portalId: string): Promise<Portal> {
  return apiRequest<Portal>(`/portals/${portalId}/publish`, {
    method: 'POST',
  });
}

export async function checkSlugAvailable(
  slug: string,
): Promise<{ available: boolean }> {
  return apiRequest<{ available: boolean }>(
    `/portals/check-slug/${slug}`,
  );
}

export interface StoreCreationResult {
  portal_id: string;
  portal_url: string;
  portal_name: string;
  products_created: number;
  categories_created: string[];
  brand_assets_found: Record<string, unknown>;
  capability_gaps: string[];
  playbook_applied: string | null;
  warnings: string[];
  agent_summary: string;
}

export async function createPortalFromDescription(
  description: string,
): Promise<StoreCreationResult> {
  return apiRequest<StoreCreationResult>('/portals/create-from-description', {
    method: 'POST',
    body: JSON.stringify({ description }),
  });
}

export async function createProductsFromDescription(
  portalId: string,
  description: string,
): Promise<{ products_created: number; summary: string }> {
  return apiRequest<{ products_created: number; summary: string }>(
    `/portals/${portalId}/products/create-from-description`,
    {
      method: 'POST',
      body: JSON.stringify({ description }),
    }
  );
}

export async function getPublicPortal(
  slug: string,
): Promise<PublicPortalResponse> {
  return apiRequest<PublicPortalResponse>(`/p/${slug}`);
}

export async function getPublicProducts(
  slug: string,
): Promise<Product[]> {
  return apiRequest<Product[]>(`/p/${slug}/products`);
}

export async function getPublicProduct(
  slug: string,
  productId: string,
): Promise<Product> {
  return apiRequest<Product>(`/p/${slug}/products/${productId}`);
}

export async function invitePortalUser(
  portalId: string,
  email: string,
  role = 'end_user',
): Promise<Invitation> {
  return apiRequest<Invitation>(`/portals/${portalId}/invitations`, {
    method: 'POST',
    body: JSON.stringify({ email, role }),
  });
}

export async function listPortalInvitations(
  portalId: string,
): Promise<Invitation[]> {
  return apiRequest<Invitation[]>(`/portals/${portalId}/invitations`);
}
