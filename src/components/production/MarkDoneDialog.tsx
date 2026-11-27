import { useState } from 'react';
import { markBatchDone } from '../../api/production';
import type { BatchSummary, MarkDoneResult } from '../../types/production';
import { colors } from './ProductionLayout';

/** Mark done, the two steps (walk t09, 20 Nov 2026; one component since the
 * batch page, 27 Nov 2026): the reason, then a confirmation naming the batch.
 * The dialog makes the call; the page it sits on shows the result where the
 * button was. Nothing is written before "Yes". */

export function markedDoneText(batchNumber: number, result: MarkDoneResult): string {
  const skipped = result.units[0]?.steps_skipped ?? 0;
  return `Batch ${batchNumber} marked done; ${skipped} remaining step${skipped === 1 ? '' : 's'} skipped.`;
}

export default function MarkDoneDialog({
  batch,
  onApplied,
  onRefused,
  onCancel,
}: {
  batch: BatchSummary;
  onApplied: (result: MarkDoneResult) => void | Promise<void>;
  onRefused: (reason: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function confirm() {
    setBusy(true);
    try {
      const result = await markBatchDone(batch.unit_id, reason.trim(), true);
      await onApplied(result);
    } catch (e: unknown) {
      onRefused(e instanceof Error ? e.message : 'Mark done was refused');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div role="dialog" aria-modal="true" aria-label={`Mark Batch ${batch.batch_number} done`} style={{ position: 'fixed', inset: 0, background: 'var(--sg-overlay)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, zIndex: 50 }} data-testid="mark-done-dialog">
      <div style={{ background: 'var(--sg-surface)', border: '1px solid var(--sg-line)', borderRadius: 8, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 560, width: '100%' }}>
        <div style={{ fontSize: 18, fontWeight: 600 }}>Mark Batch {batch.batch_number} done</div>
        {!confirming ? (
          <>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
              Reason (kept with the batch)
              <input aria-label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. finished on the old press by hand" style={{ padding: '9px 10px', border: '1px solid var(--sg-line-2)', borderRadius: 6, font: 'inherit', minHeight: 44 }} />
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" disabled={reason.trim().length < 3} onClick={() => setConfirming(true)} style={{ ...btn, ...btnPrimary }} data-testid="mark-done-next">
                Next…
              </button>
              <button type="button" onClick={onCancel} style={btn}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 14, color: 'var(--sg-danger)' }} data-testid="mark-done-note">
              Marking Batch {batch.batch_number} done skips every remaining route step by a person, with this reason kept. Nothing is printed by it.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" disabled={busy} onClick={confirm} style={{ ...btn, ...btnPrimary }} data-testid="mark-done-confirm">
                Yes, mark Batch {batch.batch_number} done
              </button>
              <button type="button" onClick={onCancel} style={btn}>
                Not now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const btn: React.CSSProperties = { padding: '9px 14px', borderRadius: 6, border: '1px solid var(--sg-line-2)', background: 'var(--sg-surface)', fontWeight: 500, minHeight: 44, font: 'inherit', cursor: 'pointer' };
const btnPrimary: React.CSSProperties = { background: colors.vein, color: 'var(--sg-surface)', borderColor: colors.vein };
