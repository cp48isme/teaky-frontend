/** The signed-in user's roles, read from the access token's claims (the
 * backend puts `roles` in the JWT; AuthenticatedUser on the server). Used to
 * show the production screens read-only to a shadow_reader (dispatch 16 Nov
 * 2026, item 5): the role holds production:shadow_read and nothing else, so
 * the pages fetch only the three routes it may read and offer no action. */

export function currentRoles(): string[] {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) return [];
    const parts = token.split('.');
    if (parts.length !== 3) return [];
    const payload = JSON.parse(atob(parts[1]!.replace(/-/g, '+').replace(/_/g, '/')));
    return Array.isArray(payload.roles) ? payload.roles.filter((r: unknown): r is string => typeof r === 'string') : [];
  } catch {
    return [];
  }
}

export function isShadowReader(roles: string[] = currentRoles()): boolean {
  return roles.includes('shadow_reader') && !roles.some((r) => r !== 'shadow_reader' && PRODUCTION_ROLES.has(r));
}

/** Roles that may act on the production screens. */
const PRODUCTION_ROLES = new Set(['super_admin', 'printer_admin', 'sales_rep', 'sales_team_lead', 'store_creator']);

/** Buyer roles land on the portal they were invited to; everyone else — the
 * shop's staff and the read-only shadow_reader — lands on the production
 * screens. Ruling 17 Nov 2026 (BLOCKS): Andrew's shadow_reader invitation
 * landed him on the Sandbox Hotel ordering page because the accept page
 * routed by the invitation's portal, not its role. The sign-in path
 * (usePostLoginRedirect) already routes a shadow_reader to /production/batches;
 * this is the one rule for both. */
const BUYER_ROLES = new Set(['end_user', 'portal_admin', 'sub_portal_admin']);

export const PRODUCTION_LANDING = '/production/batches';

export function isBuyerRole(role: string | null | undefined): boolean {
  return BUYER_ROLES.has((role ?? '').trim().toLowerCase());
}

/** Where an accepted invitation lands: a buyer on the invited portal (the
 * site root when the invitation names none); staff and shadow_reader on the
 * production screens, portal or no portal. */
export function landingForInvitation(role: string | null | undefined, portalSlug: string | null | undefined): string {
  if (isBuyerRole(role)) return portalSlug ? `/p/${portalSlug}` : '/';
  return PRODUCTION_LANDING;
}

/** The signed-in user's id (the token's `sub`), so a proposal the caller made
 * offers "Withdraw" where another person's offers "Decline" (ruling 17 Nov
 * 2026: under require_second_approver the proposer's own decline is a
 * withdrawal). Null when no token is held or it does not parse. */
export function currentUserId(): string | null {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]!.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}
