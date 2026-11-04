import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LimiterDegradedBanner from '../LimiterDegradedBanner';
import type { LoginRateLimiterHealth } from '../../../types/healthcheck';

function health(overrides: Partial<LoginRateLimiterHealth> = {}): LoginRateLimiterHealth {
  return {
    redis: 'ok',
    mode: 'fail_open',
    fail_open_events: 0,
    fail_closed_events: 0,
    degraded_since: null,
    last_event_at: null,
    ...overrides,
  };
}

describe('LimiterDegradedBanner', () => {
  it('renders nothing while Redis answers', () => {
    render(<LimiterDegradedBanner status={health()} />);
    expect(screen.queryByTestId('limiter-degraded-banner')).toBeNull();
  });

  it('renders nothing before the first healthcheck answer', () => {
    render(<LimiterDegradedBanner status={null} />);
    expect(screen.queryByTestId('limiter-degraded-banner')).toBeNull();
  });

  it('says attempts are not being counted when fail-open and Redis is unreachable', () => {
    render(
      <LimiterDegradedBanner
        status={health({
          redis: 'unreachable',
          fail_open_events: 7,
          degraded_since: '2026-11-04T16:00:00Z',
        })}
      />,
    );
    const banner = screen.getByRole('alert');
    expect(banner).toHaveTextContent('Login rate limiting degraded since');
    expect(banner).toHaveTextContent('not being counted or locked out');
    expect(banner).toHaveTextContent('7 let through without a count');
  });

  it('says attempts are being refused when fail-closed', () => {
    render(
      <LimiterDegradedBanner
        status={health({ redis: 'unreachable', mode: 'fail_closed', fail_closed_events: 2 })}
      />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('being refused until it is back');
    expect(screen.getByRole('alert')).toHaveTextContent('2 refused without a count');
  });

  it('clears when Redis is back', () => {
    const { rerender } = render(
      <LimiterDegradedBanner status={health({ redis: 'unreachable', fail_open_events: 3 })} />,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    rerender(<LimiterDegradedBanner status={health({ fail_open_events: 3 })} />);
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
