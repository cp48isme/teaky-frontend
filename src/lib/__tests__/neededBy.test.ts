import { describe, expect, it } from 'vitest';
import { formatNeededBy, todayIsoDate } from '../neededBy';

describe('needed-by date helpers', () => {
  it('shows the stored YYYY-MM-DD to staff as MM/DD/YYYY without touching the timezone', () => {
    expect(formatNeededBy('2026-10-30')).toBe('10/30/2026');
    expect(formatNeededBy('2027-01-05')).toBe('01/05/2027');
  });
  it('is blank when the buyer gave no date', () => {
    expect(formatNeededBy(null)).toBeNull();
    expect(formatNeededBy(undefined)).toBeNull();
    expect(formatNeededBy('')).toBeNull();
  });
  it("builds the picker's minimum from the shop's calendar, not the browser's day (fga1)", () => {
    // 17:59 Chicago is 23:59 UTC, the same day.
    expect(todayIsoDate('America/Chicago', new Date('2026-11-05T23:59:00Z'))).toBe('2026-11-05');
    // 18:01 Chicago is 00:01 UTC — UTC is already tomorrow; the shop is not.
    expect(todayIsoDate('America/Chicago', new Date('2026-11-06T00:01:00Z'))).toBe('2026-11-05');
    // 23:59 Chicago is 05:59 UTC the next day.
    expect(todayIsoDate('America/Chicago', new Date('2026-11-06T05:59:00Z'))).toBe('2026-11-05');
    // 00:01 Chicago is 06:01 UTC, the same day.
    expect(todayIsoDate('America/Chicago', new Date('2026-11-06T06:01:00Z'))).toBe('2026-11-06');
    // The same instants read in UTC give UTC's day — the rule the picker no longer follows.
    expect(todayIsoDate('UTC', new Date('2026-11-06T00:01:00Z'))).toBe('2026-11-06');
  });
});
