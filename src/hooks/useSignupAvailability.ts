import { useEffect, useState } from 'react';
import { getSignupAvailability } from '../api/auth';

let cached: boolean | null = null;
let inflight: Promise<boolean> | null = null;

/** Whether "Create a free account" is on offer (t04): read once per session;
 * `false` until the server says otherwise, so a link is never shown on a
 * host where sign-up is off. */
export function loadSignupAvailability(): Promise<boolean> {
  if (cached !== null) return Promise.resolve(cached);
  if (!inflight) {
    inflight = getSignupAvailability()
      .then((r) => {
        cached = r.public_signup_enabled;
        return cached;
      })
      .catch(() => false)
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export function resetSignupAvailability(): void {
  cached = null;
  inflight = null;
}

export function useSignupAvailability(): boolean {
  const [on, setOn] = useState<boolean>(cached === true);
  useEffect(() => {
    let alive = true;
    loadSignupAvailability().then((v) => {
      if (alive) setOn(v);
    });
    return () => {
      alive = false;
    };
  }, []);
  return on;
}
