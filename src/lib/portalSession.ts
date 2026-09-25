// Remembers which portal a buyer was last on, so that signing in returns them
// there instead of the printer dashboard (buyer-journey item 1, 2026-09-25).
const KEY = 'teaky_last_portal';

export function rememberPortal(slug: string): void {
  try {
    localStorage.setItem(KEY, slug);
  } catch {
    // storage unavailable — the login page falls back to the ?next param
  }
}

export function lastPortalPath(): string | null {
  try {
    const slug = localStorage.getItem(KEY);
    return slug ? `/p/${slug}` : null;
  } catch {
    return null;
  }
}

/** Roles that belong to the printer's side of Teaky; anyone else is a buyer. */
const PRINTER_ROLES = new Set([
  'super_admin',
  'printer_admin',
  'store_creator',
  'sales_rep',
  'sales_team_lead',
  'billing_contact',
]);

export function isPrinterUser(roles: string[]): boolean {
  return roles.some((r) => PRINTER_ROLES.has(r));
}

/** Roles a portal buyer holds. A user can hold both kinds: today the only way
 *  to create an invited buyer is the printer registration form, which grants
 *  printer_admin of a throwaway organisation before the invitation adds the
 *  buyer role. */
const BUYER_ROLES = new Set(['end_user', 'portal_admin', 'sub_portal_admin']);

export function isBuyerUser(roles: string[]): boolean {
  return roles.some((r) => BUYER_ROLES.has(r));
}

/** Only same-origin paths are honoured as a post-login destination. */
export function safeNextPath(next: string | null | undefined): string | null {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return null;
  return next;
}
