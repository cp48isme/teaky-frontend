import { apiRequest } from './client';
import type {
  OrderCosts,
  UpdateLineItemCostsRequest,
  UpdateOrderCostsRequest,
} from '../types/orderCosts';

export async function getOrderCosts(orderId: string): Promise<OrderCosts> {
  return apiRequest<OrderCosts>(`/orders/${orderId}/costs`);
}

export async function updateOrderCosts(
  orderId: string,
  data: UpdateOrderCostsRequest,
): Promise<OrderCosts> {
  return apiRequest<OrderCosts>(`/orders/${orderId}/costs`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function updateLineItemCosts(
  orderId: string,
  lineItemId: string,
  data: UpdateLineItemCostsRequest,
): Promise<OrderCosts> {
  return apiRequest<OrderCosts>(`/orders/${orderId}/line-items/${lineItemId}/costs`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
