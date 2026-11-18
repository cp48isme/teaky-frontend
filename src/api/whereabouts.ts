import { apiRequest } from './client';
import type { OrderWhereabouts } from '../types/whereabouts';

/** Where did this order go (backend item 2): staff and the shadow_reader read it. */
export async function getOrderWhereabouts(orderId: string): Promise<OrderWhereabouts> {
  return apiRequest<OrderWhereabouts>(`/orders/${encodeURIComponent(orderId)}/whereabouts`);
}
