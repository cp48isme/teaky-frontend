import { useEffect, useState } from 'react';
import { listPortals } from '../api/portals';
import { loadMyOrganization } from './useMyOrganization';

// Cause 5 (30 Oct 2026): the onboarding wizard — Company Profile → Equipment
// → Capabilities → Pricing → Plan — exists for a print shop that signed itself
// up and has nothing yet. It must not appear for an organisation provisioned
// any other way, nor for a staff member invited into an existing one. The
// managed flag alone did not catch that (the sandbox organisation, and so the
// wizard on its dashboard, carries is_managed=false), so the rule is: self-serve
// = not managed AND no portal yet. Unknown (still loading, or the portal list
// not readable) counts as not self-serve: the wizard is hidden, never leaked.

let cachedHasPortal: boolean | null = null;
let inflight: Promise<boolean | null> | null = null;

function loadHasPortal(): Promise<boolean | null> {
  if (cachedHasPortal !== null) return Promise.resolve(cachedHasPortal);
  if (!inflight) {
    inflight = listPortals()
      .then((portals) => {
        cachedHasPortal = portals.length > 0;
        return cachedHasPortal;
      })
      .catch(() => null)
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/** Forget what is cached (sign-out, organisation switch, tests). */
export function resetSelfServeOnboarding(): void {
  cachedHasPortal = null;
  inflight = null;
}

/** `selfServe` is null until known; true only for an unmanaged organisation with no portal. */
export function useSelfServeOnboarding(): { selfServe: boolean | null } {
  const [selfServe, setSelfServe] = useState<boolean | null>(null);
  useEffect(() => {
    let alive = true;
    Promise.all([loadMyOrganization(), loadHasPortal()]).then(([organization, hasPortal]) => {
      if (!alive) return;
      if (organization?.is_managed) return setSelfServe(false);
      if (hasPortal === null) return setSelfServe(false);
      setSelfServe(!hasPortal);
    });
    return () => {
      alive = false;
    };
  }, []);
  return { selfServe };
}
