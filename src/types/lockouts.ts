/** What GET /api/auth/lockouts/status reports (staff session; team:manage).
 * Ruling m2i7, 4 Nov 2026: the public healthcheck says nothing about the
 * login rate limiter; the staff side reads this route instead. */
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
