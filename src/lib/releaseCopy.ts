/**
 * Plain language for the hold-and-release block on the order page (ruling
 * 2026-10-20). The state machine lives in the backend; this names each state
 * for the order desk and says which actions make sense in it.
 */
import type { Order, ReleaseState } from '../types/order';

export type ReleaseTone = 'hold' | 'ready' | 'busy' | 'ok' | 'retry' | 'human';

export interface ReleaseDescription {
  state: ReleaseState;
  tone: ReleaseTone;
  /** Short pill text, e.g. in the orders list. */
  label: string;
  headline: string;
  next: string | null;
  canRelease: boolean;
  needsHuman: boolean;
}

export const RELEASE_LABELS: Record<ReleaseState, string> = {
  held_for_proof: 'Held for proof',
  releasing: 'Releasing…',
  released: 'Released',
  retryable: 'Release failed — retry',
  needs_human: 'Check DocketManager',
};

export function isHeld(order: Pick<Order, 'release_state'>): boolean {
  const s = order.release_state;
  return s === 'held_for_proof' || s === 'retryable' || s === 'needs_human' || s === 'releasing';
}

export function describeRelease(
  order: Pick<Order, 'release_state' | 'status' | 'dm_order_id' | 'release_attempts' | 'line_items'>,
): ReleaseDescription | null {
  const state = order.release_state;
  if (!state) return null;
  // A cancelled order is never released (ruling 2026-10-21); say nothing rather than offer it.
  if (order.status === 'cancelled') return null;
  const proofApproved =
    order.status === 'approved' ||
    (order.line_items.length > 0 &&
      order.line_items.filter((li) => li.needs_proof).every((li) => li.proof_status === 'approved'));
  switch (state) {
    case 'held_for_proof':
      return proofApproved
        ? {
            state,
            tone: 'ready',
            label: RELEASE_LABELS[state],
            headline: 'Proof approved. Nothing has been sent to DocketManager yet.',
            next: 'Release the order to production: Teaky creates the DocketManager order and records its number.',
            canRelease: true,
            needsHuman: false,
          }
        : {
            state,
            tone: 'hold',
            label: RELEASE_LABELS[state],
            headline: 'Held for a proof. Nothing has been sent to DocketManager.',
            next: 'Make the proof and submit it below. Once the buyer approves it, release the order from here.',
            canRelease: false,
            needsHuman: false,
          };
    case 'releasing':
      return {
        state,
        tone: 'busy',
        label: RELEASE_LABELS[state],
        headline: 'Releasing to DocketManager…',
        next: 'Reload in a moment.',
        canRelease: false,
        needsHuman: false,
      };
    case 'released':
      return {
        state,
        tone: 'ok',
        label: RELEASE_LABELS[state],
        headline: order.dm_order_id
          ? `Released: in DocketManager as order #${order.dm_order_id}.`
          : 'Released to DocketManager.',
        next: null,
        canRelease: false,
        needsHuman: false,
      };
    case 'retryable':
      return {
        state,
        tone: 'retry',
        label: RELEASE_LABELS[state],
        headline: `The release failed before DocketManager made the job (attempt ${order.release_attempts ?? 1}).`,
        next: 'The DocketManager block below says why. Fix the cause, then release again; nothing was created there.',
        canRelease: true,
        needsHuman: false,
      };
    case 'needs_human':
      return {
        state,
        tone: 'human',
        label: RELEASE_LABELS[state],
        headline: 'The release outcome is unknown: the order was sent and DocketManager’s answer could not be read.',
        next: 'Check DocketManager first. If the job is there, enter its order number here. If it is not, mark it not found and release again. Teaky will not resend on its own.',
        canRelease: false,
        needsHuman: true,
      };
  }
}
