export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface LineItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_sku: string | null;
  quantity: number;
  size: string | null;
  color: string | null;
  unit_price: number;
  line_total: number;
  needs_proof: boolean;
  proof_status: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  portal_id: string;
  user_id: string;
  organization_id: string;
  status: string;
  payment_status: string;
  payment_method: string | null;
  stripe_payment_intent_id: string | null;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  total: number;
  shipping_address: ShippingAddress;
  po_number: string | null;
  notes: string | null;
  tags: string[];
  line_items: LineItem[];
  placed_at: string;
  approved_at: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  tracking_number: string | null;
  dm_order_id: string | null;
  production_status: string | null;
  production_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderFromCartRequest {
  cart_id: string;
  shipping_address: ShippingAddress;
  payment_method?: string;
  po_number?: string;
  notes?: string;
}

export interface UpdateOrderRequest {
  notes?: string;
  tags?: string[];
  tracking_number?: string;
}

export interface UpdateOrderStatusRequest {
  status: string;
}

export interface UpdateProductionStatusRequest {
  production_status: string;
  notes?: string;
}

export interface InvoiceLineItem {
  product_name: string;
  product_sku: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface InvoiceData {
  invoice_number: string;
  order_id: string;
  order_number: string;
  organization_name: string;
  customer_name: string;
  customer_email: string;
  shipping_address: ShippingAddress;
  line_items: InvoiceLineItem[];
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  total: number;
  payment_status: string;
  issued_at: string;
}

export const PRODUCTION_STATUSES = [
  'received',
  'in_prepress',
  'printing',
  'finishing',
  'quality_check',
  'ready_to_ship',
  'shipped',
  'picked_up',
] as const;

export type ProductionStatus = (typeof PRODUCTION_STATUSES)[number];
