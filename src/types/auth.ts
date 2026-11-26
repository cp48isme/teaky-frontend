/** The session on the wire (cookie cut-over, review 19 Nov 2026, item 6):
 * the access token in the body, the refresh token in the `teaky_refresh`
 * HttpOnly cookie the browser holds and the client never sees. */
export interface SessionResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/** GET /auth/me (#272): the signed-in person, for the account menu — and,
 * since the ruling of 26 Nov 2026 (item 4: the server decides the landing),
 * where they land and whether the shop has a floor. Both are absent on an
 * older server, and the client then falls back to its own rule. */
export interface MeResponse {
  id: string;
  email: string;
  display_name: string | null;
  organization_id: string;
  roles: string[];
  /** The person's landing: /production/batches, /dashboard, /choose-portal, /get-started or /p/<slug>. */
  home?: string;
  /** The shop has a production floor to show (press-run config, or a production unit exists). */
  has_floor?: boolean;
}
