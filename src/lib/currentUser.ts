import { getMe } from '../api/auth';
import { getAccessToken } from '../api/client';
import type { MeResponse } from '../types/auth';

/** GET /auth/me, read once per signed-in person (ruling 19 Nov 2026): the
 * answer is cached against the access token's subject, so both shells and
 * every remount share one request, a refresh of the same session reuses it,
 * and a different sign-in asks again. Null when not signed in. */
let cachedFor: string | null = null;
let cached: Promise<MeResponse> | null = null;

function subjectOf(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]!.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.sub === 'string' ? payload.sub : null;
  } catch {
    return null;
  }
}

export function loadCurrentUser(): Promise<MeResponse> | null {
  const subject = subjectOf(getAccessToken());
  if (!subject) return null;
  if (cached === null || cachedFor !== subject) {
    cachedFor = subject;
    cached = getMe().catch((error: unknown) => {
      // A failed read is not remembered: the next mount asks again.
      cached = null;
      cachedFor = null;
      throw error;
    });
  }
  return cached;
}

/** For tests and sign-out: forget the cached answer. */
export function resetCurrentUser(): void {
  cached = null;
  cachedFor = null;
}
