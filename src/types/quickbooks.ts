export interface QuickBooksStatus {
  connected: boolean;
  /** connected | needs_reauth | disconnected (backend QBOConnectionStatus). */
  status?: string | null;
  realm_id: string | null;
  connected_at: string | null;
}

export interface QuickBooksConnectResponse {
  authorization_url: string;
}

