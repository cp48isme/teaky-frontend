import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompanyProfileByOrg } from '../api/companyProfiles';
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

/**
 * Returns a function that navigates to the right place after login.
 *
 * Order of precedence (buyer-journey item 1, 2026-09-25):
 * 1. An explicit same-origin `next` path.
 * 2. A buyer-side role with a remembered portal → that portal. A buyer never
 *    sees the printer onboarding wizard, and the company-profile lookup that
 *    used to 404 for them is not made. A buyer may also hold printer_admin
 *    (see isBuyerUser); the remembered portal decides.
 * 3. A printer-side role → the existing rule: /get-started until the wizard is
 *    complete, /dashboard afterwards.
 * 4. A buyer with no known portal → the site root.
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
      const portalPath = lastPortalPath();
      if (isBuyerUser(roles) && portalPath) {
        navigate(portalPath);
        return;
      }
      if (!isPrinterUser(roles)) {
        navigate(portalPath ?? '/');
        return;
      }

      if (!claims?.org) {
        navigate('/dashboard');
        return;
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
