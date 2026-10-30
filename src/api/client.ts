const API_BASE = '/api';

interface TokenPair {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

function getAccessToken(): string | null {
  return localStorage.getItem('access_token');
}

function getRefreshToken(): string | null {
  return localStorage.getItem('refresh_token');
}

export function setTokens(tokens: TokenPair): void {
  localStorage.setItem('access_token', tokens.access_token);
  localStorage.setItem('refresh_token', tokens.refresh_token);
}

export function clearTokens(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

/** The organisation of the current access token, so a refresh keeps the session there (S86). */
function currentOrganizationId(): string | null {
  const token = getAccessToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.org === 'string' ? payload.org : null;
  } catch {
    return null;
  }
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refresh_token: refreshToken,
        organization_id: currentOrganizationId(),
      }),
    });

    if (!response.ok) {
      clearTokens();
      return false;
    }

    const tokens: TokenPair = await response.json();
    setTokens(tokens);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

/** Re-issue the session inside `organizationId` (after accepting an invitation) (S86). */
export async function switchOrganization(organizationId: string): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken, organization_id: organizationId }),
  });
  if (!response.ok) return false;
  setTokens((await response.json()) as TokenPair);
  return true;
}

/**
 * Endpoints that establish a session rather than use one. Two rules, both
 * needed (29 Oct 2026, launch blocker): they are sent without a bearer, since
 * whatever sits in localStorage is irrelevant to proving who you are; and a
 * 401 from them is their own answer (a failed sign-in), never a session expiry.
 * Before this, a returning user with an expired token who mistyped a password
 * once had the login's 401 treated as "session expired": refresh, clear
 * storage, hard reload, and no message. Logout is not listed: it consumes a
 * session rather than opening one. The two token-issuing routes outside /auth
 * — taking up an invitation with a new password, and portal self-registration
 * — establish a session the same way and are listed with them.
 */
const SESSION_ESTABLISHING_PATHS: readonly RegExp[] = [
  /^\/auth\/login$/,
  /^\/auth\/register$/,
  /^\/auth\/refresh$/,
  /^\/team\/invitations\/[^/]+\/register$/,
  /^\/p\/[^/]+\/register$/,
];

export function isSessionEstablishingPath(path: string): boolean {
  const [pathname] = path.split('?');
  const candidate = pathname ?? path;
  return SESSION_ESTABLISHING_PATHS.some((pattern) => pattern.test(candidate));
}

/** The hard navigation taken when the session is gone; an object so tests can observe it. */
export const sessionNavigation = {
  toLogin(): void {
    window.location.href = '/login';
  },
};

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE}${path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  const establishesSession = isSessionEstablishingPath(path);
  // Half one: no bearer on the endpoints that establish a session.
  const accessToken = establishesSession ? null : getAccessToken();
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let response = await fetch(url, { ...options, headers });

  // Half two: only a 401 to a request that used a session means the session
  // expired — then refresh and retry once, or send the user to sign in. A 401
  // from a session-establishing endpoint falls through to the error below.
  if (response.status === 401 && accessToken && !establishesSession) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getAccessToken()}`;
      response = await fetch(url, { ...options, headers });
    } else {
      clearTokens();
      sessionNavigation.toLogin();
      throw new Error('Session expired');
    }
  }

  if (!response.ok) {
    const errorBody: unknown = await response.json().catch(() => ({}));
    throw new ApiError(response.status, detailText(errorBody) ?? 'Request failed');
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

/**
 * The server's own words for a failure. A string `detail` is used as is. A
 * validation failure (422) carries a list of `{loc, msg}` entries; each is
 * rendered as "field: message" so a refused phone number reads as
 * "phone: needs at least 7 digits", not "[object Object]" (30 Oct 2026).
 */
export function detailText(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;
  const { detail } = body as { detail?: unknown };
  if (typeof detail === 'string' && detail) return detail;
  if (Array.isArray(detail)) {
    const parts = detail.flatMap((entry) => {
      if (!entry || typeof entry !== 'object') return [];
      const { msg, loc } = entry as { msg?: unknown; loc?: unknown };
      if (typeof msg !== 'string') return [];
      const text = msg.replace(/^Value error, /, '');
      const field = Array.isArray(loc) ? loc.filter((part) => typeof part === 'string' && part !== 'body').pop() : undefined;
      return [typeof field === 'string' ? `${field}: ${text}` : text];
    });
    if (parts.length) return parts.join(' ');
  }
  return null;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}
