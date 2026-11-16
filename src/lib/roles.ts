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
