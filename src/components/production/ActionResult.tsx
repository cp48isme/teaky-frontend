import type { ReactNode } from 'react';

/** "An action happened here" (overnight dispatch 26 Nov 2026, item 4): the
 * one way a result or a refusal is shown on the floor, rendered where the
 * click was. `done` is a live region (`role="status"`), `refused` an alert.
 * The words are the caller's; this fixes the shape and the colours so every
 * mutating button — Mark picked, Mark done, Confirm push-out, Approve,
 * Decline, Withdraw — answers the same way. Inline content flows as text; a
 * caller with several lines gives each its own block. */

export type ActionResultKind = 'done' | 'refused';

export default function ActionResult({ kind, children, testId, compact = false }: { kind: ActionResultKind; children: ReactNode; testId?: string; compact?: boolean }) {
  const palette =
    kind === 'done'
      ? { background: 'var(--sg-ok-bg)', border: '1px solid var(--sg-ok-line)', color: 'var(--sg-ok)' }
      : { background: 'var(--sg-danger-bg-2)', border: '1px solid var(--sg-danger-line)', color: 'var(--sg-danger)' };
  return (
    <div role={kind === 'done' ? 'status' : 'alert'} data-testid={testId} data-result={kind} style={{ ...palette, borderRadius: 6, padding: compact ? '8px 10px' : '10px 12px', fontSize: 14, lineHeight: 1.45 }}>
      {children}
    </div>
  );
}
