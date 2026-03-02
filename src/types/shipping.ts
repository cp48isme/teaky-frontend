export interface ShippingRateAddress {
  street1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface ShippingRate {
  rate_id: string;
  carrier: string;
  service: string;
  cost: string;
  estimated_days: number | null;
}

export interface ShippingRatesRequest {
  from_address: ShippingRateAddress;
  to_address: ShippingRateAddress;
}

export interface TrackingInfo {
  tracking_number: string;
  carrier: string | null;
  status: string;
  estimated_delivery: string | null;
  events: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: string;
  description: string;
  location: string | null;
}
