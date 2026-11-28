import { useEffect, useState } from 'react';
import { loadCurrentUser } from '../lib/currentUser';
import { currentRoles, hasFloorRole } from '../lib/roles';
import type { MeResponse } from '../types/auth';

/** Whether the production floor is offered to this sign-in (ruling 26 Nov
 * 2026 item 4; navigation 28 Nov, kkqk 1a): a role with a floor grant AND,
 * once GET /auth/me has answered, the server's has_floor — an RGI-shaped
 * shop has no floor to show even to its printer_admin. Before the answer, or
 * on an older server, the role list decides alone. One rule for the admin
 * sidebar's Production item and the header's link to the floor. */
export function useFloorOffered(): boolean {
  const [me, setMe] = useState<MeResponse | null>(null);
  useEffect(() => {
    let cancelled = false;
    const pending = loadCurrentUser();
    if (pending === null) return;
    pending.then(
      (answer) => {
        if (!cancelled) setMe(answer);
      },
      () => {
        // Not knowable: the role list below decides alone.
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);
  const floorRole = hasFloorRole(currentRoles());
  return typeof me?.has_floor === 'boolean' ? floorRole && me.has_floor : floorRole;
}
