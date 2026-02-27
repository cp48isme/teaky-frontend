import { apiRequest } from './client';
import type { Order, ShippingAddress } from '../types/order';

interface CreatePaymentIntentRequest {
  cart_id: string;
}

interface CreatePaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
  amount: number;
}

interface ConfirmCheckoutRequest {
  cart_id: string;
  payment_intent_id: string;
  shipping_address: ShippingAddress;
  payment_method?: string;
  po_number?: string;
  notes?: string;
}

export async function createPaymentIntent(
  slug: string,
  data: CreatePaymentIntentRequest,
): Promise<CreatePaymentIntentResponse> {
  return apiRequest<CreatePaymentIntentResponse>(
    `/p/${slug}/checkout/create-payment-intent`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  );
}

export async function confirmCheckout(
  slug: string,
  data: ConfirmCheckoutRequest,
): Promise<Order> {
  return apiRequest<Order>(`/p/${slug}/checkout/confirm`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
