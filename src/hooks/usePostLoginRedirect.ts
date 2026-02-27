import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompanyProfileByOrg } from '../api/companyProfiles';

/**
 * Returns a function that navigates to the appropriate page after login:
 * - /get-started if no profile or wizard incomplete
 * - /dashboard if wizard is complete
 */
export function usePostLoginRedirect() {
  const navigate = useNavigate();

  return useCallback(async () => {
    // Re-read orgId from freshly stored token
    const token = localStorage.getItem('access_token');
    if (!token) {
      navigate('/login');
      return;
    }

    let orgId: string | null = null;
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(
          atob(parts[1]!.replace(/-/g, '+').replace(/_/g, '/')),
        );
        orgId = payload.org ?? null;
      }
    } catch {
      navigate('/dashboard');
      return;
    }

    if (!orgId) {
      navigate('/dashboard');
      return;
    }

    try {
      const profile = await getCompanyProfileByOrg(orgId);
      if (profile.is_wizard_complete) {
        navigate('/dashboard');
      } else {
        navigate('/get-started');
      }
    } catch {
      // No profile yet — go to wizard
      navigate('/get-started');
    }
  }, [navigate]);
}
