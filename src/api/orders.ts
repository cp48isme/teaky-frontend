import { apiRequest } from './client';
import type {
  CancelOrderRequest,
  CreateOrderOnBehalfRequest,
  Order,
  OrderFile,
  UpdateOrderRequest,
  UpdateOrderStatusRequest,
} from '../types/order';

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

// Staff-assisted ordering
export async function createOrderOnBehalf(
  data: CreateOrderOnBehalfRequest,
): Promise<Order> {
  return apiRequest<Order>('/orders/on-behalf', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Order cancellation
export async function cancelOrder(
  orderId: string,
  data: CancelOrderRequest,
): Promise<Order> {
  return apiRequest<Order>(`/orders/${orderId}/cancel`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Order files
export async function listOrderFiles(orderId: string): Promise<OrderFile[]> {
  return apiRequest<OrderFile[]>(`/orders/${orderId}/files`);
}

export async function uploadOrderFile(
  orderId: string,
  file: File,
): Promise<OrderFile> {
  const formData = new FormData();
  formData.append('file', file);

  const token = localStorage.getItem('access_token');
  const response = await fetch(`/api/orders/${orderId}/files`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(error.detail || 'Upload failed');
  }

  return response.json();
}

export async function deleteOrderFile(
  orderId: string,
  fileId: string,
): Promise<void> {
  return apiRequest<void>(`/orders/${orderId}/files/${fileId}`, {
    method: 'DELETE',
  });
}
