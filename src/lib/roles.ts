/** The signed-in user's roles, read from the access token's claims (the
 * backend puts `roles` in the JWT; AuthenticatedUser on the server). Used to
 * show the production screens read-only to a shadow_reader (dispatch 16 Nov
 * 2026, item 5): the role holds production:shadow_read and nothing else, so
 * the pages fetch only the three routes it may read and offer no action. */

import { getAccessToken } from '../api/client';

export function currentRoles(): string[] {
  try {
    const token = getAccessToken();
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

/** Roles that may act on the production screens: exactly the holders of
 * order:release in the backend's auth/permissions.py — printer_admin and the
 * platform's super_admin. Until the ruling of 26 Nov 2026 (item 4) this set
 * also named sales_rep, sales_team_lead and store_creator, which hold no
 * order:release: they were shown Production and landed on a floor that
 * answered 403 on every list. The permission model is the truth; this list
 * only mirrors it for rendering before GET /auth/me has answered. */
const PRODUCTION_ROLES = new Set(['super_admin', 'printer_admin']);

/** Walk t07/t09 (20 Nov 2026): a role with a floor grant — staff who may act
 * on production (order:release), or the read-only shadow reader
 * (production:shadow_read) — gets Production in the admin sidebar. Once
 * GET /auth/me has answered, the server's has_floor decides with it
 * (Sidebar). */
export function hasFloorRole(roles: string[] = currentRoles()): boolean {
  return roles.some((r) => PRODUCTION_ROLES.has(r) || r === 'shadow_reader');
}

/** Buyer roles land on the portal they were invited to (ruling 17 Nov 2026,
 * BLOCKS: Andrew's shadow_reader invitation landed him on the Sandbox Hotel
 * ordering page because the accept page routed by the invitation's portal,
 * not its role). The shadow_reader lands on the production screens — the
 * only screens its grant reads. A staff role lands on /dashboard (ruling 26
 * Nov 2026 item 8(a), RGI prep): an RGI admin whose shop has no press-run
 * config and no units landed on an empty floor; nothing the API exposes says
 * honestly whether a shop has a floor (press-run-config and
 * production-settings answer defaults for a shop without one), so every staff
 * role lands where its later sign-ins already land (usePostLoginRedirect) and
 * Production is one click away in the sidebar. The sign-in path routes the
 * shadow_reader to /production/batches and staff to /dashboard; this is the
 * one rule for both. */
const BUYER_ROLES = new Set(['end_user', 'portal_admin', 'sub_portal_admin']);

/** The platform operator (Teaky's own super_admin): the one sign-in that
 * operates the agent, analytics and message surfaces a print shop never
 * does (navigation 1b, 28 Nov 2026). */
export function isPlatformOperator(roles: string[] = currentRoles()): boolean {
  return roles.includes('super_admin');
}

export const PRODUCTION_LANDING = '/production/batches';
export const STAFF_LANDING = '/dashboard';

export function isBuyerRole(role: string | null | undefined): boolean {
  return BUYER_ROLES.has((role ?? '').trim().toLowerCase());
}

/** Where an accepted invitation lands when the server has not said (an
 * older server; ruling 26 Nov 2026 item 4 makes GET /auth/me's `home` the
 * answer and this the fallback): a buyer on the invited portal (the site root
 * when the invitation names none); the shadow_reader on the production
 * screens; every other role — the shop's staff — on /dashboard, never the
 * floor, portal or no portal. */
export function landingForInvitation(role: string | null | undefined, portalSlug: string | null | undefined): string {
  if (isBuyerRole(role)) return portalSlug ? `/p/${portalSlug}` : '/';
  if ((role ?? '').trim().toLowerCase() === 'shadow_reader') return PRODUCTION_LANDING;
  return STAFF_LANDING;
}

/** The signed-in user's id (the token's `sub`), so a proposal the caller made
 * offers "Withdraw" where another person's offers "Decline" (ruling 17 Nov
 * 2026: under require_second_approver the proposer's own decline is a
 * withdrawal). Null when no token is held or it does not parse. */
export function currentUserId(): string | null {
  try {
    const token = getAccessToken();
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]!.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}

/** Who may edit the shop's company page (t06, 19 Nov 2026): the roles that
 * hold settings:manage on the server — the printer_admin (and the platform's
 * super_admin). Everyone else on the settings hub reads. */
export function canEditCompany(roles: string[] = currentRoles()): boolean {
  return roles.includes('printer_admin') || roles.includes('super_admin');
}

/** The shop admin surface (t03, ruled 19 Nov 2026) is the printer_admin's:
 * team:manage. The shadow_reader never sees it; buyers never do. */
export function canAdministerShop(roles: string[] = currentRoles()): boolean {
  return roles.includes('printer_admin') || roles.includes('super_admin');
}

/** Role codes in words (walk C5, 26 Nov 2026: the Admin page and the members
 * list rendered `end_user` and `shadow_reader`). One map for every screen
 * that names a role; an unknown code falls back to its words with the
 * underscores dropped. */
export const ROLE_LABELS: Record<string, string> = {
  end_user: 'Buyer',
  portal_admin: 'Portal admin',
  sub_portal_admin: 'Portal sub-admin',
  printer_admin: 'Printer admin',
  sales_rep: 'Sales rep',
  sales_team_lead: 'Sales team lead',
  store_creator: 'Store creator',
  shadow_reader: 'Shadow reader',
  billing_contact: 'Billing contact',
  super_admin: 'Teaky admin',
};

export function roleLabel(role: string | null | undefined): string {
  const code = (role ?? '').trim();
  if (!code) return '—';
  return ROLE_LABELS[code.toLowerCase()] ?? code.replace(/_/g, ' ');
}
