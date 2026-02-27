import { apiRequest } from './client';
import type { Order, UpdateOrderRequest, UpdateOrderStatusRequest } from '../types/order';

// End-user portal orders
export async function listMyOrders(slug: string): Promise<Order[]> {
  return apiRequest<Order[]>(`/p/${slug}/orders`);
}

export async function getMyOrder(slug: string, orderId: string): Promise<Order> {
  return apiRequest<Order>(`/p/${slug}/orders/${orderId}`);
}

export async function checkSafeOrder(
  slug: string,
  productId: string,
  size?: string,
  color?: string,
): Promise<{ is_safe_order: boolean }> {
  const params = new URLSearchParams();
  if (size) params.set('size', size);
  if (color) params.set('color', color);
  const qs = params.toString() ? `?${params.toString()}` : '';
  return apiRequest<{ is_safe_order: boolean }>(
    `/p/${slug}/orders/safe-order-check/${productId}${qs}`,
  );
}

// Printer admin orders
export async function listPrinterOrders(status?: string): Promise<Order[]> {
  const params = status ? `?status=${encodeURIComponent(status)}` : '';
  return apiRequest<Order[]>(`/orders${params}`);
}

export async function getPrinterOrder(orderId: string): Promise<Order> {
  return apiRequest<Order>(`/orders/${orderId}`);
}

export async function updateOrder(
  orderId: string,
  data: UpdateOrderRequest,
): Promise<Order> {
  return apiRequest<Order>(`/orders/${orderId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function updateOrderStatus(
  orderId: string,
  data: UpdateOrderStatusRequest,
): Promise<Order> {
  return apiRequest<Order>(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
