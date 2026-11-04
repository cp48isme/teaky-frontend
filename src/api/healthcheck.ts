import type { HealthcheckResponse } from '../types/healthcheck';

const API_BASE = '/api';

/** The healthcheck needs no token and must not trigger a token refresh or a
 * redirect to /login on failure, so it does not go through apiRequest. A 503
 * (database unhealthy) still carries the body. */
export async function getHealthcheck(): Promise<HealthcheckResponse> {
  const response = await fetch(`${API_BASE}/healthcheck`, {
    headers: { Accept: 'application/json' },
  });
  const body = (await response.json()) as HealthcheckResponse;
  if (!response.ok && !body?.login_rate_limiter) {
    throw new Error(`healthcheck ${response.status}`);
  }
  return body;
}
