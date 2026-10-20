export interface QuickBooksStatus {
  connected: boolean;
  realm_id: string | null;
  connected_at: string | null;
}

export interface QuickBooksConnectResponse {
  authorization_url: string;
}

