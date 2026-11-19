/** The session on the wire (cookie cut-over, review 19 Nov 2026, item 6):
 * the access token in the body, the refresh token in the `teaky_refresh`
 * HttpOnly cookie the browser holds and the client never sees. */
export interface SessionResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/** GET /auth/me (#272): the signed-in person, for the account menu. */
export interface MeResponse {
  id: string;
  email: string;
  display_name: string | null;
  organization_id: string;
  roles: string[];
}
