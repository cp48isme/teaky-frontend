/** What GET /api/healthcheck reports (no auth). The login rate limiter block
 * is the FAIL_OPEN ruling of 4 Nov 2026: a control that disables itself must
 * say so where staff can see it. */
export type LimiterRedisState = 'ok' | 'unreachable';
export type LimiterMode = 'fail_open' | 'fail_closed';

export interface LoginRateLimiterHealth {
  redis: LimiterRedisState;
  mode: LimiterMode;
  fail_open_events: number;
  fail_closed_events: number;
  degraded_since: string | null;
  last_event_at: string | null;
}

export interface HealthcheckResponse {
  status: string;
  database: string;
  login_rate_limiter: LoginRateLimiterHealth;
}
