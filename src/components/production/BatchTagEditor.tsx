import { useState } from 'react';
import { listPrinterOrders, updateOrder } from '../../api/orders';
import type { Order } from '../../types/order';
import type { BatchSummary } from '../../types/production';
import TagEditor, { nextTags } from './TagEditor';

/** Tags on a batch row (ruling 19 Nov 2026 on t08): a bulk action over the
 * batch's orders. Picking or removing a tag opens a confirmation that names
 * the exact number of orders it will change; nothing is written before the
 * confirm; on confirm each order is PATCHed once with its full updated list
 * through PATCH /orders/{id} — that PATCH is the audit row (one per order,
 * `order_tags_changed`), nothing else writes. A failed PATCH stops the run;
 * the notice says which orders were changed and which were not, and the
 * batches are re-read so the chips are as the server has them. */

export type BatchTagPlan = {
  kind: 'add' | 'remove';
  tag: string;
  /** The orders the action will change, each with the list it will be given. */
  orders: { order: Order; tags: string[] }[];
};

export function ordersInBatch(batch: BatchSummary, orders: Order[]): Order[] {
  const lines = new Set(batch.line_item_ids ?? []);
  return orders.filter((o) => (o.line_items ?? []).some((li) => lines.has(li.id)));
}

export function planFor(batch: BatchSummary, orders: Order[], current: readonly string[], next: readonly string[]): BatchTagPlan | null {
  const added = next.find((t) => !current.includes(t));
  const removed = current.find((t) => !next.includes(t));
  const members = ordersInBatch(batch, orders);
  if (added !== undefined) {
    return { kind: 'add', tag: added, orders: members.filter((o) => !(o.tags ?? []).includes(added)).map((o) => ({ order: o, tags: nextTags(o.tags ?? [], added) })) };
  }
  if (removed !== undefined) {
    return { kind: 'remove', tag: removed, orders: members.filter((o) => (o.tags ?? []).includes(removed)).map((o) => ({ order: o, tags: (o.tags ?? []).filter((t) => t !== removed) })) };
  }
  return null;
}

export function confirmText(plan: BatchTagPlan): string {
  const n = plan.orders.length;
  const noun = n === 1 ? 'order' : 'orders';
  return plan.kind === 'add' ? `Tag ${n} ${noun} with ${plan.tag}` : `Remove ${plan.tag} from ${n} ${noun}`;
}

const ref = (o: Order) => o.po_number || o.order_number;

export default function BatchTagEditor({
  batch,
  options,
  onWritten,
}: {
  batch: BatchSummary;
  options: readonly string[];
  /** Called after any write (complete or stopped) so the page re-reads the batches. */
  onWritten: () => void;
}) {
  const [plan, setPlan] = useState<BatchTagPlan | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function propose(next: string[]) {
    setBusy(true);
    setNotice(null);
    try {
      const orders = await listPrinterOrders();
      const p = planFor(batch, orders, batch.tags ?? [], next);
      if (p === null || p.orders.length === 0) {
        setNotice(p === null ? null : `No order in batch ${batch.batch_number} to change.`);
        return;
      }
      setPlan(p);
    } catch (e: unknown) {
      setNotice(e instanceof Error ? e.message : 'Could not read the orders');
    } finally {
      setBusy(false);
    }
  }

  async function confirm() {
    if (!plan) return;
    setBusy(true);
    const done: string[] = [];
    let failed: string | null = null;
    try {
      for (const { order, tags } of plan.orders) {
        try {
          await updateOrder(order.id, { tags });
          done.push(ref(order));
        } catch (e: unknown) {
          failed = e instanceof Error ? e.message : 'The tags were refused';
          break;
        }
      }
      if (failed === null) {
        setNotice(plan.kind === 'add' ? `Tagged ${done.length} ${done.length === 1 ? 'order' : 'orders'} with ${plan.tag}.` : `Removed ${plan.tag} from ${done.length} ${done.length === 1 ? 'order' : 'orders'}.`);
      } else {
        const rest = plan.orders.map((x) => ref(x.order)).filter((r) => !done.includes(r));
        setNotice(`Stopped: ${failed}. ${plan.kind === 'add' ? 'Tagged' : 'Changed'}: ${done.length ? done.join(', ') : 'none'}. Not changed: ${rest.join(', ')}.`);
      }
    } finally {
      setPlan(null);
      setBusy(false);
      onWritten();
    }
  }

  return (
    <div data-testid="batch-tag-editor">
      <TagEditor tags={batch.tags ?? []} options={options} readOnly={false} compact busy={busy} onChange={propose} />
      {plan ? (
        <div role="dialog" aria-label={confirmText(plan)} style={{ marginTop: 6, padding: 8, border: '1px solid var(--sg-line-3)', borderRadius: 6, background: 'var(--sg-warn-bg-2)', fontSize: 13, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
          <span data-testid="batch-tag-confirm-text">{confirmText(plan)}</span>
          <button type="button" style={{ fontSize: 12, padding: '2px 8px', cursor: 'pointer', background: 'var(--sg-brand-stem)', color: 'var(--sg-surface)', border: 0, borderRadius: 4 }} disabled={busy} onClick={confirm}>
            Confirm
          </button>
          <button type="button" style={{ fontSize: 12, padding: '2px 8px', cursor: 'pointer', border: '1px solid var(--sg-line-3)', borderRadius: 4, background: 'var(--sg-surface)' }} disabled={busy} onClick={() => setPlan(null)}>
            Cancel
          </button>
        </div>
      ) : null}
      {notice ? (
        <div role="status" style={{ marginTop: 4, fontSize: 12, color: notice.startsWith('Stopped') ? 'var(--sg-danger)' : 'var(--sg-ok-2)' }} data-testid="batch-tag-notice">
          {notice}
        </div>
      ) : null}
    </div>
  );
}
