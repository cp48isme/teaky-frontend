import { describe, expect, it } from 'vitest';
import { matchesSearch } from '../search';

describe('matchesSearch (one rule for every list, Cause 6)', () => {
  it('is case-insensitive and matches a partial string in any field', () => {
    expect(matchesSearch('41bd', ['ORD-41BD4C83', null, 'Sandbox Hotel'])).toBe(true);
    expect(matchesSearch('sandbox', ['ORD-41BD4C83', null, 'Sandbox Hotel (test portal)'])).toBe(true);
    expect(matchesSearch('RGI-7', ['ORD-1', 'rgi-77', 'x'])).toBe(true);
    expect(matchesSearch('nowhere', ['ORD-1', 'rgi-77', 'x'])).toBe(false);
  });

  it('matches everything on an empty or blank query, and ignores missing fields', () => {
    expect(matchesSearch('', [])).toBe(true);
    expect(matchesSearch('   ', [null, undefined])).toBe(true);
    expect(matchesSearch('a', [null, undefined])).toBe(false);
  });
});
