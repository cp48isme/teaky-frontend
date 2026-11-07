import { describe, expect, it } from 'vitest';
import { onePressResolution, splitHeld, stockChoices } from '../held';
import type { HeldQueueEntry } from '../../types/releaseUnit';
import type { Order } from '../../types/order';
import type { TaylorPoolLine } from '../../types/production';

const order = { id: 'o1', order_number: 'ORD-1', po_number: '13361-02', line_items: [{ id: 'l1', product_name: 'KU Med BC', product_sku: 'KU-MED-BC2', quantity: 1, pack_size: 250 }] } as unknown as Order;

function entry(reason: string, extra: Partial<HeldQueueEntry> = {}): HeldQueueEntry {
  return {
    unit_id: `u-${reason}`, kind: 'production', source_order_id: 'o1', order_number: 'ORD-1', reference: 'ORD-1', release_state: null,
    age_seconds: 3600, open_holds: [{ hold_id: `h-${reason}`, reason, detail: null, line_item_id: 'l1', case_key: reason === 'stock_unknown' ? 'product_key:KU-MED-BC2' : null, prior_decision: null }],
    ...extra,
  };
}

const taylorHeld: TaylorPoolLine = { id: 't1', po: 'W636301', line_no: 1, product: 'BB-STD-BC', quantity: 1, pack: 250, cards: 250, source_created_at: '2026-11-06T09:00:00Z', received_at: '2026-11-06T09:12:00Z', art_state: 'hold', art_error: '404 on the artwork link', held_by: [], stock: '120#' };
const taylorFine: TaylorPoolLine = { ...taylorHeld, id: 't2', art_state: 'fetched', art_error: null };

describe('the two lists of Held', () => {
  it('puts facts in one list and decisions in the other, oldest first', () => {
    const lists = splitHeld(
      [entry('awaiting_proof', { age_seconds: 64800 }), entry('stock_unknown', { age_seconds: 172800 }), entry('stock_mixed', { age_seconds: 170000 }), entry('exceeds_capacity', { age_seconds: 160000 })],
      [order],
      [taylorHeld, taylorFine],
      new Date('2026-11-06T09:52:00Z'),
    );
    expect(lists.waitingForFact.map((r) => r.title)).toEqual(['Proof not approved', 'No art file yet']);
    expect(lists.needsDecision.map((r) => r.title)).toEqual(['Stock unknown', 'Mixed stock', 'Over capacity']);
    expect(lists.counts).toEqual({ held: 5, fact: 2, onYou: 1, onRule: 2 });
    const unknown = lists.needsDecision[0];
    expect(unknown.productKey).toBe('KU-MED-BC2');
    expect(unknown.order).toBe('13361-02');
    expect(unknown.summary).toBe('RGI portal · KU-MED-BC2 · KU Med BC · 1 × 250');
    const art = lists.waitingForFact[1];
    expect(art.taylorLineId).toBe('t1');
    expect(art.ageSeconds).toBe(2400);
    expect(art.detail).toBe('Artwork: 404 on the artwork link');
  });

  it('a fetched Taylor line is not held', () => {
    expect(splitHeld([], [], [taylorFine]).counts.held).toBe(0);
  });
});

describe('the one press', () => {
  it('answers with the stock and carries the evidence rows shown', () => {
    const resolution = onePressResolution('100#', [{ kind: 'customer_products', stock: '100#', detail: 'KU-MED-BC ran on 11 batches' }]);
    expect(resolution.answer).toBe('100#');
    expect(resolution.evidence_kind).toBe('other');
    expect(resolution.evidence_note).toContain('customer_products: 100# — KU-MED-BC ran on 11 batches');
  });

  it('offers the suggested stock first, then the shop\'s others', () => {
    expect(stockChoices('100#')).toEqual(['100#', '80#', '120#', '16 C2S']);
    expect(stockChoices(null)).toEqual(['80#', '100#', '120#', '16 C2S']);
  });
});
