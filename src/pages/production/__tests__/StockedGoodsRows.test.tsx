import { describe, expect, it } from 'vitest';
import { rowsFromTaylor } from '../AllChannelOrdersPage';
import type { TaylorPoolLine } from '../../../types/production';

/** Ruling 20 Nov 2026 (a27 item 3): a stocked-goods pool line reads as pick
 * and pack on All Channel Orders, not as held; a line held for art still
 * reads as held. */

const line = (over: Partial<TaylorPoolLine>): TaylorPoolLine => ({
  id: 'l1', po: 'W679336', line_no: 1, product: 'PLU1020', quantity: 1, pack: 6, cards: 6,
  source_created_at: '2026-11-06T00:00:00Z', received_at: '2026-11-11T16:26:36Z',
  art_state: 'hold', art_error: 'no art URL on the line', held_by: [], stock: '',
  line_item_id: null, canonical_state: 'written', canonical_error: null, ...over,
} as TaylorPoolLine);

describe('stocked goods on All Channel Orders', () => {
  it('a not_needed line with the stocked_goods lane is pick and pack, not held', () => {
    const [row] = rowsFromTaylor([line({ art_state: 'not_needed', art_error: null, lane: 'stocked_goods' })], new Date('2026-11-20T18:00:00Z'));
    expect(row.status).toBe('Stocked goods · pick and pack');
    expect(row.statusKind).toBe('unbatched');
  });
  it('a line still held for art reads as held', () => {
    const [row] = rowsFromTaylor([line({})], new Date('2026-11-20T18:00:00Z'));
    expect(row.status).toBe('Held · art: no art URL on the line');
    expect(row.statusKind).toBe('held');
  });
});
