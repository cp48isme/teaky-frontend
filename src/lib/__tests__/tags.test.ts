import { describe, expect, it } from 'vitest';
import { EMPTY_TAG_FILTER, cycleTag, passesTagFilter, tagFilterText, tagMode, tagUniverse } from '../tags';

/** Order tags on the orders page (Andrew, 17 Nov 2026): a chip cycles off →
 * include → exclude → off; exclude wins; untagged rows pass an exclude and
 * fail an include. */

describe('order tag chips', () => {
  it('collects every tag once, sorted', () => {
    expect(tagUniverse([['Express', 'Rush'], null, ['Express'], undefined, []])).toEqual(['Express', 'Rush']);
  });

  it('cycles off → include → exclude → off', () => {
    const a = cycleTag(EMPTY_TAG_FILTER, 'Express');
    expect(tagMode(a, 'Express')).toBe('include');
    const b = cycleTag(a, 'Express');
    expect(tagMode(b, 'Express')).toBe('exclude');
    expect(b.include).toEqual([]);
    const c = cycleTag(b, 'Express');
    expect(tagMode(c, 'Express')).toBeNull();
    expect(c).toEqual(EMPTY_TAG_FILTER);
  });

  it("excludes Sprouts' Express orders and keeps everything else, untagged rows included", () => {
    const without = cycleTag(cycleTag(EMPTY_TAG_FILTER, 'Express'), 'Express');
    expect(passesTagFilter(without, ['Express'])).toBe(false);
    expect(passesTagFilter(without, ['Rush'])).toBe(true);
    expect(passesTagFilter(without, [])).toBe(true);
    expect(passesTagFilter(without, null)).toBe(true);
    expect(tagFilterText(without)).toBe('without Express');
  });

  it('include keeps only rows carrying one of the included tags; exclude wins over include', () => {
    const only = cycleTag(EMPTY_TAG_FILTER, 'Express');
    expect(passesTagFilter(only, ['Express', 'Rush'])).toBe(true);
    expect(passesTagFilter(only, ['Rush'])).toBe(false);
    expect(passesTagFilter(only, [])).toBe(false);
    const both = cycleTag(cycleTag(only, 'Rush'), 'Rush');
    expect(passesTagFilter(both, ['Express', 'Rush'])).toBe(false);
    expect(tagFilterText(both)).toBe('only Express · without Rush');
  });
});
