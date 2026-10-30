import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompanyProfileByOrg } from '../api/companyProfiles';
import { listMyPortals, type MyPortal } from '../api/auth';
import { getMyOrganization } from '../api/organizations';
import { listPortals } from '../api/portals';
import { isBuyerUser, isPrinterUser, lastPortalPath, safeNextPath } from '../lib/portalSession';

interface TokenClaims {
  org: string | null;
  roles: string[];
}

function readClaims(token: string): TokenClaims | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]!.replace(/-/g, '+').replace(/_/g, '/')));
    return {
      org: typeof payload.org === 'string' ? payload.org : null,
      roles: Array.isArray(payload.roles) ? payload.roles.filter((r: unknown) => typeof r === 'string') : [],
    };
  } catch {
    return null;
  }
}

/** Where the chooser lives; also the page a buyer with no portal at all is told about it. */
export const CHOOSE_PORTAL_PATH = '/choose-portal';

/**
 * Where a buyer lands (belq, ruling 30 Oct 2026): the one portal they belong
 * to; a chooser when there are several; never the public landing page. The
 * remembered portal wins when it is one of theirs. On a server that does not
 * know the route yet, the remembered portal or the chooser, never '/'.
 */
export async function buyerDestination(): Promise<string> {
  const remembered = lastPortalPath();
  let portals: MyPortal[];
  try {
    portals = (await listMyPortals()).filter((p) => p.status === 'active');
  } catch {
    return remembered ?? CHOOSE_PORTAL_PATH;
  }
  if (remembered && portals.some((p) => `/p/${p.slug}` === remembered)) return remembered;
  if (portals.length === 1) return `/p/${portals[0]!.slug}`;
  return CHOOSE_PORTAL_PATH;
}

/**
 * Returns a function that navigates to the right place after login.
 *
 * Order of precedence (buyer-journey item 1, 2026-09-25; belq, 30 Oct 2026):
 * 1. An explicit same-origin `next` path.
 * 2. A buyer-side role → the portal they belong to (buyerDestination): the
 *    remembered one if it is theirs, the only one, or a chooser. A buyer never
 *    sees the printer onboarding wizard, and the company-profile lookup that
 *    used to 404 for them is not made. A buyer may also hold printer_admin
 *    (see isBuyerUser); the portal rule decides.
 * 3. A printer-side role: a managed account (set up by Teaky; RGI first) goes
 *    to /dashboard and never sees the wizard; an organisation that already has
 *    a portal goes to /dashboard regardless, so the wizard cannot recur through
 *    a route nobody thought of; otherwise the existing rule — /get-started
 *    until the wizard is complete, /dashboard afterwards (8 Oct 2026 ruling).
 * 4. No role the app knows → the chooser, which says so. Never the site root:
 *    the public landing page carries a sign-in form, and a signed-in user
 *    reading one concludes their account is broken.
 */
export function usePostLoginRedirect() {
  const navigate = useNavigate();

  return useCallback(
    async (next?: string | null) => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const claims = readClaims(token);
      const explicitNext = safeNextPath(next);
      if (explicitNext) {
        navigate(explicitNext);
        return;
      }

      const roles = claims?.roles ?? [];
      if (isBuyerUser(roles) || !isPrinterUser(roles)) {
        navigate(await buyerDestination());
        return;
      }

      if (!claims?.org) {
        navigate('/dashboard');
        return;
      }

      try {
        const org = await getMyOrganization();
        if (org.is_managed) {
          navigate('/dashboard');
          return;
        }
      } catch {
        // Not knowable — fall through to the portal and profile rules.
      }
      try {
        const portals = await listPortals();
        if (portals.length > 0) {
          navigate('/dashboard');
          return;
        }
      } catch {
        // Not knowable — fall through to the profile rule.
      }
      try {
        const profile = await getCompanyProfileByOrg(claims.org);
        navigate(profile.is_wizard_complete ? '/dashboard' : '/get-started');
      } catch {
        // No profile yet — go to wizard
        navigate('/get-started');
      }
    },
    [navigate],
  );
}
