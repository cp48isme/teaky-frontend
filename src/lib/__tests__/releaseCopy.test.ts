import { describe, expect, it } from 'vitest';
import { describeRelease, isHeld, RELEASE_LABELS } from '../releaseCopy';
import type { Order } from '../../types/order';

const line = (proof_status: string | null, needs_proof = true) =>
  ({ id: 'li', needs_proof, proof_status }) as unknown as Order['line_items'][number];

const order = (over: Partial<Order>): Order =>
  ({ status: 'pending_approval', dm_order_id: null, release_attempts: 0, line_items: [line('pending')], ...over }) as Order;

describe('hold-and-release copy', () => {
  it('is silent for an order that went to DocketManager at placement', () => {
    expect(describeRelease(order({ release_state: null }))).toBeNull();
    expect(isHeld(order({ release_state: null }))).toBe(false);
    expect(isHeld(order({ release_state: 'released' }))).toBe(false);
  });

  it('holds until the proof is approved, then offers the release', () => {
    const waiting = describeRelease(order({ release_state: 'held_for_proof' }))!;
    expect(waiting.canRelease).toBe(false);
    expect(waiting.tone).toBe('hold');
    expect(waiting.headline).toMatch(/Nothing has been sent to DocketManager/);
    const ready = describeRelease(order({ release_state: 'held_for_proof', status: 'approved', line_items: [line('approved')] }))!;
    expect(ready.canRelease).toBe(true);
    expect(ready.tone).toBe('ready');
    expect(ready.next).toMatch(/Release the order to production/);
  });

  it('names the DocketManager order once released', () => {
    const d = describeRelease(order({ release_state: 'released', status: 'approved', dm_order_id: '85991' }))!;
    expect(d.headline).toBe('Released: in DocketManager as order #85991.');
    expect(d.canRelease).toBe(false);
  });

  it('lets a definite failure be retried and sends an unknown outcome to a person', () => {
    const retry = describeRelease(order({ release_state: 'retryable', status: 'approved', release_attempts: 2 }))!;
    expect(retry.canRelease).toBe(true);
    expect(retry.headline).toMatch(/attempt 2/);
    expect(retry.next).toMatch(/nothing was created there/);
    const human = describeRelease(order({ release_state: 'needs_human', status: 'approved' }))!;
    expect(human.canRelease).toBe(false);
    expect(human.needsHuman).toBe(true);
    expect(human.next).toMatch(/Check DocketManager first/);
    expect(human.next).toMatch(/will not resend/);
  });

  it('has a short label for every state', () => {
    expect(RELEASE_LABELS.held_for_proof).toBe('Held for proof');
    expect(RELEASE_LABELS.needs_human).toBe('Check DocketManager');
  });
});
