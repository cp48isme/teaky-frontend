import { useState, useEffect, useCallback } from 'react';
import { getLoginLimiterStatus } from '../api/lockouts';
import { isAuthenticated } from '../api/client';
import type { LoginRateLimiterHealth } from '../types/lockouts';

const POLL_INTERVAL_MS = 30_000;

/** Polls GET /auth/lockouts/status with the staff session every 30 s. `null`
 * until the first answer, when not signed in, or when the route refuses
 * (a session without team:manage gets 403 and sees no banner). */
export function useLoginLimiterStatus(): LoginRateLimiterHealth | null {
  const [status, setStatus] = useState<LoginRateLimiterHealth | null>(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated()) {
      setStatus(null);
      return;
    }
    try {
      setStatus(await getLoginLimiterStatus());
    } catch {
      setStatus(null);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  return status;
}
