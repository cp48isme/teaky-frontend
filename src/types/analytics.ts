export type TimeGranularity = 'daily' | 'weekly' | 'monthly';

export interface OrderStatusBreakdown {
  status: string;
  count: number;
}

export interface SummaryMetrics {
  total_revenue: number;
  order_count: number;
  average_order_value: number;
  orders_by_status: OrderStatusBreakdown[];
  active_portal_count: number;
  pending_proof_count: number;
}

export interface RevenueDataPoint {
  period: string;
  revenue: number;
}

export interface RevenueOverTimeResponse {
  granularity: TimeGranularity;
  data: RevenueDataPoint[];
}

export interface OrderCountDataPoint {
  period: string;
  count: number;
}

export interface OrdersOverTimeResponse {
  granularity: TimeGranularity;
  data: OrderCountDataPoint[];
}

export interface TopProduct {
  product_id: string;
  product_name: string;
  product_sku: string | null;
  total_quantity: number;
  total_revenue: number;
}

export interface TopProductsResponse {
  by_revenue: TopProduct[];
  by_quantity: TopProduct[];
}

export interface PortalPerformance {
  portal_id: string;
  portal_name: string;
  order_count: number;
  total_revenue: number;
}

export interface PortalPerformanceResponse {
  portals: PortalPerformance[];
}

export interface FulfillmentMetrics {
  avg_placed_to_approved_hours: number | null;
  avg_approved_to_shipped_hours: number | null;
  avg_shipped_to_delivered_hours: number | null;
  avg_placed_to_delivered_hours: number | null;
  orders_measured: number;
}
