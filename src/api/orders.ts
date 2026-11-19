import { apiRequest } from './client';
import type {
  CancelOrderRequest,
  LinkDocketManagerOrderRequest,
  CreateOrderFromCartRequest,
  CreateOrderOnBehalfRequest,
  Order,
  UpdateOrderRequest,
  UpdateOrderStatusRequest,
  UpdateProductionStatusRequest,
  InvoiceData,
} from '../types/order';

// End-user portal orders
/** Place an order from the buyer's cart on the invoice-terms path (S84, plan §5.5).
 *  No PaymentIntent: the order is created pending_invoice and invoiced by RGI. */
export async function createPortalOrder(
  slug: string,
  data: CreateOrderFromCartRequest,
): Promise<Order> {
  return apiRequest<Order>(`/p/${slug}/orders`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

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
export interface PrinterOrdersFilter {
  status?: string;
  /** Order tags (ruling 18 Nov 2026): keep orders carrying any of these… */
  tag?: string[];
  /** …and drop orders carrying any of these; repeatable on the wire as tag= / exclude_tag=. */
  excludeTag?: string[];
  /** The search needle (backend item 2): order number, PO, Docket number, customer, product, scan code. */
  q?: string;
}

export async function listPrinterOrders(filter: string | PrinterOrdersFilter = {}): Promise<Order[]> {
  const f: PrinterOrdersFilter = typeof filter === 'string' ? { status: filter } : filter;
  const params = new URLSearchParams();
  if (f.status) params.set('status', f.status);
  for (const tag of f.tag ?? []) params.append('tag', tag);
  for (const tag of f.excludeTag ?? []) params.append('exclude_tag', tag);
  if (f.q) params.set('q', f.q);
  const query = params.toString();
  return apiRequest<Order[]>(`/orders${query ? `?${query}` : ''}`);
}

/** The shop's tag list (t08, 19 Nov 2026): every tag on its orders plus its rules' tags, for the pickers. Staff only. */
export async function listShopTags(): Promise<{ tags: string[] }> {
  return apiRequest<{ tags: string[] }>('/orders/tags');
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

// Hold-and-release (ruling 2026-10-20): the explicit act that sends a changed
// order to DocketManager, and the two human actions after an unknown outcome.
export async function releaseOrder(orderId: string): Promise<Order> {
  return apiRequest<Order>(`/orders/${orderId}/release`, { method: 'POST' });
}

export async function linkReleasedOrder(
  orderId: string,
  data: LinkDocketManagerOrderRequest,
): Promise<Order> {
  return apiRequest<Order>(`/orders/${orderId}/release/link`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function confirmReleaseNotFound(orderId: string): Promise<Order> {
  return apiRequest<Order>(`/orders/${orderId}/release/not-found`, { method: 'POST' });
}
