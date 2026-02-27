import { apiRequest } from './client';
import type { Cart, CartItem, AddToCartRequest, UpdateCartItemRequest } from '../types/cart';

export async function getOrCreateCart(slug: string): Promise<Cart> {
  return apiRequest<Cart>(`/p/${slug}/cart`, { method: 'POST' });
}

export async function getCart(slug: string): Promise<Cart> {
  return apiRequest<Cart>(`/p/${slug}/cart`);
}

export async function addToCart(
  slug: string,
  data: AddToCartRequest,
): Promise<CartItem> {
  return apiRequest<CartItem>(`/p/${slug}/cart/items`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCartItem(
  slug: string,
  itemId: string,
  data: UpdateCartItemRequest,
): Promise<CartItem> {
  return apiRequest<CartItem>(`/p/${slug}/cart/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function removeCartItem(
  slug: string,
  itemId: string,
): Promise<void> {
  return apiRequest<void>(`/p/${slug}/cart/items/${itemId}`, {
    method: 'DELETE',
  });
}
