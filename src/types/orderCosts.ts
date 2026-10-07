/** Gross-profit capture on an order (plan §5.3) — printer-side only. */

export interface LineItemCosts {
  line_item_id: string;
  product_name: string;
  quantity: number;
  pack_size: number;
  unit_price: number;
  line_total: number;
  /** The product's cost per pack when the line was placed; a reprice never changes it. */
  unit_cost: number | null;
  cost_source: string | null;
  decoration_charge: number | null;
  inbound_freight_allocation: number | null;
}

export interface OrderCosts {
  order_id: string;
  order_number: string;
  status: string;
  outbound_freight_cost: number | null;
  processing_fee_actual: number | null;
  processing_fee_source: string | null;
  /** First of the month; defaults to the ship month when the order is marked shipped. */
  invoice_month: string | null;
  revenue_share_rate_snapshot: number | null;
  lines: LineItemCosts[];
}

export interface UpdateOrderCostsRequest {
  outbound_freight_cost?: number;
  processing_fee_actual?: number;
  processing_fee_source?: string;
  invoice_month?: string;
}

export interface UpdateLineItemCostsRequest {
  unit_cost?: number;
  cost_source?: string;
  decoration_charge?: number;
  inbound_freight_allocation?: number;
}
