import { useState, useEffect, useCallback } from 'react';
import { getHealthcheck } from '../api/healthcheck';
import type { LoginRateLimiterHealth } from '../types/healthcheck';

const POLL_INTERVAL_MS = 30_000;

/** Polls the healthcheck for the login rate limiter's state. `null` until the
 * first answer, or when the healthcheck itself cannot be read (then nothing is
 * shown: an unreadable healthcheck is the load balancer's problem, not this
 * banner's). */
export function useLoginLimiterStatus(): LoginRateLimiterHealth | null {
  const [status, setStatus] = useState<LoginRateLimiterHealth | null>(null);

  const refresh = useCallback(async () => {
    try {
      const health = await getHealthcheck();
      setStatus(health.login_rate_limiter ?? null);
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
