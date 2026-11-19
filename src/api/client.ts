import type { SessionResponse } from '../types/auth';

const API_BASE = '/api';

/**
 * The session cut-over (review 19 Nov 2026, item 6; backend #279). The access
 * token lives in this module variable and nowhere else — not localStorage,
 * not sessionStorage — so a script on the page cannot lift it from storage
 * and a reload starts from nothing. The refresh token is the `teaky_refresh`
 * HttpOnly cookie: the browser sends it on every request to the API
 * (`credentials: 'include'`), the server reads it on refresh and logout, and
 * no code path here reads, stores or sends it. On load the client asks the
 * server for one silent refresh (the cookie decides) before it knows whether
 * it is signed in; a browser without the cookie goes to sign in.
 */
let accessToken: string | null = null;

/** The storage keys the client used before the cut-over. Never read again;
 * removed once so an old browser does not keep a dead token around. */
const LEGACY_STORAGE_KEYS = ['access_token', 'refresh_token'] as const;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setSession(session: SessionResponse): void {
  accessToken = session.access_token;
}

export function clearSession(): void {
  accessToken = null;
}

export function isAuthenticated(): boolean {
  return accessToken !== null;
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

/**
 * One refresh at a time (bead 672f, 2 Nov 2026). The server rotates the refresh
 * token on every use, so when several requests meet a 401 at once — the
 * dashboard fires four on mount and the unread-count poll is a fifth — each
 * running its own refresh means at most one can win and the rest clear the session
 * and throw the user to sign in. Every caller awaits the same in-flight promise
 * and retries with its result. A caller whose 401 came from a token that has
 * already been replaced (another refresh finished first) does not refresh at
 * all; it retries with the token now held.
 */
let inFlightRefresh: Promise<boolean> | null = null;

function refreshAccessToken(): Promise<boolean> {
  if (inFlightRefresh) return inFlightRefresh;
  inFlightRefresh = doRefresh().finally(() => {
    inFlightRefresh = null;
  });
  return inFlightRefresh;
}

async function doRefresh(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      // The cookie carries the refresh token; the body only names the
      // organisation the session should stay in.
      body: JSON.stringify({ organization_id: currentOrganizationId() }),
    });

    if (!response.ok) {
      clearSession();
      return false;
    }

    setSession((await response.json()) as SessionResponse);
    return true;
  } catch {
    clearSession();
    return false;
  }
}

/**
 * On load: one silent refresh, the cookie deciding. Signed in when the server
 * answers a new access token; otherwise not, and the guarded routes send the
 * person to sign in. A browser that holds only the old storage tokens has no
 * cookie, so its one refresh fails and it signs in once — the forced sign-in
 * of the cut-over. The old keys are removed here, never read.
 */
export async function bootstrapSession(): Promise<boolean> {
  for (const key of LEGACY_STORAGE_KEYS) {
    try {
      localStorage.removeItem(key);
    } catch {
      // storage unavailable — nothing to remove
    }
  }
  return refreshAccessToken();
}

/** Re-issue the session inside `organizationId` (after accepting an invitation) (S86). */
export async function switchOrganization(organizationId: string): Promise<boolean> {
  // Never race a refresh already in flight: it would consume the same cookie token.
  if (inFlightRefresh) await inFlightRefresh;
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ organization_id: organizationId }),
  });
  if (!response.ok) return false;
  setSession((await response.json()) as SessionResponse);
  return true;
}

/**
 * Endpoints that establish a session rather than use one. Two rules, both
 * needed (29 Oct 2026, launch blocker): they are sent without a bearer, since
 * whatever token is held is irrelevant to proving who you are; and a
 * 401 from them is their own answer (a failed sign-in), never a session expiry.
 * Before this, a returning user with an expired token who mistyped a password
 * once had the login's 401 treated as "session expired": refresh, clear
 * memory, hard reload, and no message. Logout is not listed: it consumes a
 * session rather than opening one. The two token-issuing routes outside /auth
 * — taking up an invitation with a new password, and portal self-registration
 * — establish a session the same way and are listed with them.
 */
const SESSION_ESTABLISHING_PATHS: readonly RegExp[] = [
  /^\/auth\/login$/,
  /^\/auth\/register$/,
  /^\/auth\/refresh$/,
  /^\/team\/invitations\/register$/,
  /^\/p\/[^/]+\/register$/,
  // Forgot-password (29 Oct 2026): asking for a link and setting the password
  // establish a session's credentials; a stale bearer has no say in either.
  /^\/auth\/password-reset\/(request|confirm)$/,
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

  let response = await fetch(url, { ...options, credentials: 'include', headers });

  // Half two: only a 401 to a request that used a session means the session
  // expired — then refresh and retry once, or send the user to sign in. A 401
  // from a session-establishing endpoint falls through to the error below.
  if (response.status === 401 && accessToken && !establishesSession) {
    // Another caller's refresh may already have replaced the token this
    // request carried; then the retry needs no refresh of its own.
    const alreadyReplaced = getAccessToken() !== null && getAccessToken() !== accessToken;
    const refreshed = alreadyReplaced || (await refreshAccessToken());
    if (refreshed) {
      headers['Authorization'] = `Bearer ${getAccessToken()}`;
      response = await fetch(url, { ...options, credentials: 'include', headers });
    } else {
      clearSession();
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
