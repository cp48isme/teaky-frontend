/** The invitation token travels in the URL fragment (`/invite#token=…`), which the
 *  browser never sends to a server, so it appears in no access log and no Referer
 *  (bead nt7z, 29 Oct 2026; the standard the password-reset link set). Links sent
 *  before this change carry it as a path segment (`/invite/<token>`); those still
 *  resolve, and the page rewrites its address to the fragment form once read.
 *
 *  When the page has to send the visitor to sign in first, the token waits in
 *  sessionStorage rather than in a `?next=` query, for the same reason. */

const PENDING_KEY = 'teaky.pendingInvitationToken';

export function readInviteFragment(hash: string): string {
  return new URLSearchParams(hash.replace(/^#/, '')).get('token') ?? '';
}

export function rememberInviteToken(token: string): void {
  try {
    sessionStorage.setItem(PENDING_KEY, token);
  } catch {
    // Storage unavailable: the fragment or path form still carries the token.
  }
}

export function forgetInviteToken(): void {
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    // nothing to forget
  }
}

function pendingInviteToken(): string {
  try {
    return sessionStorage.getItem(PENDING_KEY) ?? '';
  } catch {
    return '';
  }
}

/** Fragment first, then the pre-29-Oct path form, then a token parked while the
 *  visitor signed in. Empty when none of the three carries one. */
export function resolveInviteToken(hash: string, pathToken?: string): string {
  return readInviteFragment(hash) || (pathToken ?? '') || pendingInviteToken();
}

/** The fragment-form address for a token: what the page rewrites a path-form link to. */
export function inviteFragmentPath(token: string): string {
  return `/invite#${new URLSearchParams({ token }).toString()}`;
}
