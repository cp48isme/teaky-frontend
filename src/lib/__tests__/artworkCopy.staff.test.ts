import { describe, expect, it } from 'vitest';
import { staffArtworkLine } from '../artworkCopy';
import type { LineItem } from '../../types/order';

const base: LineItem = {
  id: 'l1', order_id: 'o1', product_id: 'p1', product_name: 'Breakfast Door Hangers', product_sku: 'RAPH-BKDH',
  quantity: 1, size: null, color: null, unit_price: 420, line_total: 420, needs_proof: true, proof_status: 'pending', created_at: '2026-10-13T17:58:04Z',
};

describe('staffArtworkLine — the declaration the operations manager reads', () => {
  it('says a new proof is required before press for art changes', () => {
    expect(staffArtworkLine({ ...base, artwork_disposition: 'changes_new_proof' })).toBe('ART CHANGES — new proof required before press');
  });
  it('says no proof for an exact reprint', () => {
    expect(staffArtworkLine({ ...base, artwork_disposition: 'reuse_unchanged' })).toBe('Exact reprint of the approved art — no proof');
  });
  it('says no proof when there is no artwork, including when undeclared', () => {
    expect(staffArtworkLine({ ...base, artwork_disposition: 'no_artwork' })).toBe('No artwork — no proof');
    expect(staffArtworkLine({ ...base })).toBe('No artwork — no proof');
  });
});
