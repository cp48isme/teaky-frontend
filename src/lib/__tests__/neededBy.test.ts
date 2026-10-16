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
  it("builds today's date for the input's minimum from local calendar fields", () => {
    expect(todayIsoDate(new Date(2026, 9, 15, 23, 30))).toBe('2026-10-15');
    expect(todayIsoDate(new Date(2026, 0, 3, 0, 5))).toBe('2026-01-03');
  });
});
