/**
 * Plain language for the order page's DocketManager block (visible-defect
 * pass, 2026-10-15). The sync log stores a machine string —
 * "<reason>: <detail>. <note>" for a failure, a sentence for a held order —
 * and this turns the latest entry into a headline the order desk can act on,
 * mirroring the wording of the order-desk emails in email_service.py.
 */
import type { OrderSyncStatus } from '../types/mis';

export type SyncTone = 'ok' | 'hold' | 'failed' | 'pending' | 'none';

export interface SyncDescription {
  tone: SyncTone;
  headline: string;
  next: string | null;
  /** The reason code parsed from the log entry, when it was a classified failure. */
  reason: string | null;
}

const FAILURE_REASONS = [
  'needs_template',
  'rejected',
  'no_response',
  'unknown_response',
  'imported_not_recorded',
  'config_invalid',
  'unexpected',
  'price_needed',
] as const;

export function parseReason(errorMessage: string | null | undefined): string | null {
  if (!errorMessage) return null;
  const head = errorMessage.split(':', 1)[0].trim();
  return (FAILURE_REASONS as readonly string[]).includes(head) ? head : null;
}

export function describeSync(status: OrderSyncStatus | null | undefined): SyncDescription {
  if (!status || !status.last_sync_status) {
    return { tone: 'none', headline: 'Not sent to DocketManager yet.', next: null, reason: null };
  }
  const s = status.last_sync_status;
  if (s === 'success') {
    return {
      tone: 'ok',
      headline: status.dm_order_id
        ? `In DocketManager as order #${status.dm_order_id}.`
        : 'Sent to DocketManager.',
      next: null,
      reason: null,
    };
  }
  if (s === 'pending') {
    return { tone: 'pending', headline: 'Sending to DocketManager…', next: null, reason: null };
  }
  if (s === 'needs_template') {
    return {
      tone: 'hold',
      headline: 'Held: a product on this order has no DocketManager template yet.',
      next: 'The order form was emailed to the order desk. Once the product exists in DocketManager, push again from here.',
      reason: 'needs_template',
    };
  }
  const reason = parseReason(status.error_message);
  switch (reason) {
    case 'price_needed':
      return {
        tone: 'hold',
        headline: 'Held: a product on this order has no cost per pack, so the job cannot carry its price.',
        next: 'Add the cost per pack on the product (Products), then push again from here.',
        reason,
      };
    case 'imported_not_recorded':
      return {
        tone: 'failed',
        headline: 'The job is already in DocketManager, but Teaky could not record it.',
        next: 'Do not enter it again. Tell Teaky so the order can be linked.',
        reason,
      };
    case 'unknown_response':
      return {
        tone: 'failed',
        headline: 'DocketManager answered in a form Teaky could not read; the order may already be there.',
        next: 'Search DocketManager for this order’s PO first. Push again only if it is not there.',
        reason,
      };
    case 'no_response':
      return {
        tone: 'failed',
        headline: 'DocketManager could not be reached; nothing was created there.',
        next: 'Push again. If it keeps failing, enter the job from the emailed order form.',
        reason,
      };
    case 'rejected':
      return {
        tone: 'failed',
        headline: 'DocketManager refused the import.',
        next: 'Enter the job from the emailed order form and tell Teaky so the cause is fixed.',
        reason,
      };
    case 'config_invalid':
      return {
        tone: 'failed',
        headline: 'Nothing was sent: the DocketManager settings are invalid.',
        next: 'Fix the DocketManager settings (Settings → Integrations), then push again.',
        reason,
      };
    case 'unexpected':
      return {
        tone: 'failed',
        headline: 'Nothing is known to have reached DocketManager.',
        next: 'Search DocketManager for this order’s PO; if it is not there, push again and tell Teaky.',
        reason,
      };
    default:
      return {
        tone: 'failed',
        headline: 'The last push to DocketManager failed.',
        next: 'Push again. If it keeps failing, enter the job from the emailed order form and tell Teaky.',
        reason: null,
      };
  }
}
