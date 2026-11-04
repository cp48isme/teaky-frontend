import type { LoginRateLimiterHealth } from '../../types/healthcheck';

function sinceText(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return ` since ${date.toLocaleString()}`;
}

/** Shown on the staff side while the login rate limiter cannot reach Redis
 * (FAIL_OPEN ruling, 4 Nov 2026). Says what is happening to sign-in attempts
 * in the meantime, and how many were decided without a count. Renders
 * nothing while Redis answers. */
export default function LimiterDegradedBanner({
  status,
}: {
  status: LoginRateLimiterHealth | null;
}) {
  if (!status || status.redis !== 'unreachable') return null;
  const open = status.mode === 'fail_open';
  const events = open ? status.fail_open_events : status.fail_closed_events;
  return (
    <div
      role="alert"
      data-testid="limiter-degraded-banner"
      className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900 sm:px-6"
    >
      <span className="font-semibold">Login rate limiting degraded{sinceText(status.degraded_since)}.</span>
      <span>
        {open
          ? 'Redis is unreachable, so sign-in attempts are not being counted or locked out.'
          : 'Redis is unreachable, so sign-in attempts are being refused until it is back.'}
      </span>
      <span className="tabular-nums">
        {events} {open ? 'let through' : 'refused'} without a count since this task started.
      </span>
    </div>
  );
}
