import { useEffect, useState } from 'react';
import { getMyOrganization } from '../api/organizations';
import type { OrganizationMe } from '../types/organization';

let cached: OrganizationMe | null = null;
let inflight: Promise<OrganizationMe | null> | null = null;

/** Fetch the caller's organisation once per session; null while loading or
 * when the caller is not printer-side (the route is settings:view only). */
export function loadMyOrganization(): Promise<OrganizationMe | null> {
  if (cached) return Promise.resolve(cached);
  if (!inflight) {
    inflight = getMyOrganization()
      .then((org) => {
        cached = org;
        return org;
      })
      .catch(() => null)
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/** Forget the cached organisation (sign-out, organisation switch, tests). */
export function resetMyOrganization(): void {
  cached = null;
  inflight = null;
}

export function useMyOrganization(): { organization: OrganizationMe | null; loaded: boolean } {
  const [organization, setOrganization] = useState<OrganizationMe | null>(cached);
  const [loaded, setLoaded] = useState(cached !== null);
  useEffect(() => {
    let alive = true;
    loadMyOrganization().then((org) => {
      if (!alive) return;
      setOrganization(org);
      setLoaded(true);
    });
    return () => {
      alive = false;
    };
  }, []);
  return { organization, loaded };
}
