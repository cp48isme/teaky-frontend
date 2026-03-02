import { apiRequest } from './client';
import type {
  FulfillmentMetrics,
  OrdersOverTimeResponse,
  PortalPerformanceResponse,
  RevenueOverTimeResponse,
  SummaryMetrics,
  TimeGranularity,
  TopProductsResponse,
} from '../types/analytics';

export async function getSummaryMetrics(): Promise<SummaryMetrics> {
  return apiRequest<SummaryMetrics>('/analytics/summary');
}

export async function getRevenueOverTime(
  granularity: TimeGranularity = 'daily',
  startDate?: string,
  endDate?: string,
): Promise<RevenueOverTimeResponse> {
  const params = new URLSearchParams({ granularity });
  if (startDate) params.set('start_date', startDate);
  if (endDate) params.set('end_date', endDate);
  return apiRequest<RevenueOverTimeResponse>(`/analytics/revenue?${params}`);
}

export async function getOrdersOverTime(
  granularity: TimeGranularity = 'daily',
  startDate?: string,
  endDate?: string,
): Promise<OrdersOverTimeResponse> {
  const params = new URLSearchParams({ granularity });
  if (startDate) params.set('start_date', startDate);
  if (endDate) params.set('end_date', endDate);
  return apiRequest<OrdersOverTimeResponse>(`/analytics/orders?${params}`);
}

export async function getTopProducts(
  limit = 10,
  startDate?: string,
  endDate?: string,
): Promise<TopProductsResponse> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (startDate) params.set('start_date', startDate);
  if (endDate) params.set('end_date', endDate);
  return apiRequest<TopProductsResponse>(`/analytics/top-products?${params}`);
}

export async function getPortalPerformance(
  startDate?: string,
  endDate?: string,
): Promise<PortalPerformanceResponse> {
  const params = new URLSearchParams();
  if (startDate) params.set('start_date', startDate);
  if (endDate) params.set('end_date', endDate);
  const qs = params.toString() ? `?${params}` : '';
  return apiRequest<PortalPerformanceResponse>(`/analytics/portal-performance${qs}`);
}

export async function getFulfillmentMetrics(
  startDate?: string,
  endDate?: string,
): Promise<FulfillmentMetrics> {
  const params = new URLSearchParams();
  if (startDate) params.set('start_date', startDate);
  if (endDate) params.set('end_date', endDate);
  const qs = params.toString() ? `?${params}` : '';
  return apiRequest<FulfillmentMetrics>(`/analytics/fulfillment${qs}`);
}
