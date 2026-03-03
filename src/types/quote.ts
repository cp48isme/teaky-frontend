export interface QuoteRequest {
  id: string;
  portal_id: string;
  requested_by_id: string;
  assigned_to_id: string | null;
  organization_id: string;
  status: string;
  description: string;
  product_id: string | null;
  quantity: number;
  desired_date: string | null;
  quoted_price: number | null;
  quoted_at: string | null;
  notes: string | null;
  converted_order_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuoteRequestPage {
  items: QuoteRequest[];
  total: number;
  page: number;
  page_size: number;
}

export interface CreateQuoteRequest {
  description: string;
  product_id?: string;
  quantity: number;
  desired_date?: string;
  notes?: string;
}

export interface UpdateQuoteRequest {
  assigned_to_id?: string;
  status?: string;
  quoted_price?: number;
  notes?: string;
}
