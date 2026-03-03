import { apiRequest } from './client';
import type { ShippingRate, ShippingRatesRequest, TrackingInfo } from '../types/shipping';

export async function getShippingRates(
  data: ShippingRatesRequest,
): Promise<ShippingRate[]> {
  return apiRequest<ShippingRate[]>('/shipping/rates', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getTrackingInfo(
  trackingNumber: string,
): Promise<TrackingInfo> {
  return apiRequest<TrackingInfo>(
    `/shipping/tracking/${encodeURIComponent(trackingNumber)}`,
  );
}
