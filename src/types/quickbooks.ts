export interface QuickBooksStatus {
  connected: boolean;
  realm_id: string | null;
  connected_at: string | null;
}

export interface QuickBooksConnectResponse {
  authorization_url: string;
}

export interface QuickBooksSyncResponse {
  status: string;
  qbo_invoice_id: string | null;
  error: string | null;
}
