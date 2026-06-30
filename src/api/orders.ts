import { apiRequest } from './client';
import type {
  CancelOrderRequest,
  CreateOrderOnBehalfRequest,
  Order,
  UpdateOrderRequest,
  UpdateOrderStatusRequest,
  UpdateProductionStatusRequest,
  InvoiceData,
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

export async function updateProductionStatus(
  orderId: string,
  data: UpdateProductionStatusRequest,
): Promise<Order> {
  return apiRequest<Order>(`/orders/${orderId}/production-status`, {
    method: 'PATCH',
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

export async function getOrderInvoice(orderId: string): Promise<InvoiceData> {
  return apiRequest<InvoiceData>(`/orders/${orderId}/invoice`);
}

export async function downloadOrderInvoicePdf(orderId: string): Promise<Blob> {
  const token = localStorage.getItem('access_token');
  const response = await fetch(`/api/orders/${orderId}/invoice/pdf`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) throw new Error('Failed to download invoice');
  return response.blob();
}
