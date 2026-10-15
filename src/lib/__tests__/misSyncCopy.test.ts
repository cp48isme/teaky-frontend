import { describe, expect, it } from 'vitest';
import { describeSync, parseReason } from '../misSyncCopy';

const base = { dm_order_id: null, last_sync_at: '2026-10-15T20:00:00Z', last_sync_status: 'failed', error_message: null };

describe('DocketManager block copy', () => {
  it('reads the reason code off the stored machine string', () => {
    expect(parseReason('price_needed: Product X has no base_cost. Order form sent to orders@rgi.example')).toBe('price_needed');
    expect(parseReason('Needs DocketManager template (no ItemCode) for: RAPH-GCH. sent to desk')).toBeNull();
    expect(parseReason(null)).toBeNull();
  });

  it('turns a price_needed failure into a hold with the next step, never the raw string', () => {
    const d = describeSync({ ...base, error_message: 'price_needed: Product 6fcd… has no base_cost. sent to orders@rgi.example' });
    expect(d.tone).toBe('hold');
    expect(d.reason).toBe('price_needed');
    expect(d.headline).toMatch(/no cost per pack/);
    expect(d.next).toMatch(/Add the cost per pack/);
    expect(d.headline).not.toMatch(/base_cost|price_needed/);
  });

  it('names the DocketManager order on success and says so plainly when nothing was sent yet', () => {
    expect(describeSync({ ...base, last_sync_status: 'success', dm_order_id: '85724' }).headline).toBe('In DocketManager as order #85724.');
    expect(describeSync(null).headline).toBe('Not sent to DocketManager yet.');
    expect(describeSync({ ...base, last_sync_status: null }).tone).toBe('none');
  });

  it('keeps the held-for-template state actionable and warns before a re-push that could duplicate', () => {
    const held = describeSync({ ...base, last_sync_status: 'needs_template', error_message: 'Needs DocketManager template (no ItemCode) for: RAPH-GCH. sent' });
    expect(held.tone).toBe('hold');
    expect(held.next).toMatch(/push again/);
    const maybe = describeSync({ ...base, error_message: 'unknown_response: body unreadable' });
    expect(maybe.next).toMatch(/Search DocketManager .* first/);
    const dup = describeSync({ ...base, error_message: 'imported_not_recorded: Order #85730' });
    expect(dup.next).toMatch(/Do not enter it again/);
  });
});
