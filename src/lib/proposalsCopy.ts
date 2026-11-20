import type { ActionProposal, ActionProposalKind } from '../types/proposals';

/** The words the proposals panel uses: the action's name and the facts a proposal carries, as label/value pairs. */

export const KIND_LABEL: Record<ActionProposalKind, string> = {
  push_short_run: 'Push a short run (half batch)',
  push_alone: 'Push this order alone',
  void_order: 'Void this order',
  mark_done: 'Mark done (skip the remaining steps)',
};


export function factsText(p: ActionProposal): { label: string; value: string }[] {
  const f = p.facts;
  const out: { label: string; value: string }[] = [
    { label: 'Target', value: `${f.target_kind === 'order' ? 'Order' : 'Unit'} ${f.reference}` },
    { label: 'Channel', value: f.channel },
    { label: 'Customer', value: f.customer },
    { label: 'Lines · cards', value: `${f.lines} · ${f.cards}` },
  ];
  if (f.order_status) out.push({ label: 'Order status', value: f.order_status });
  if (f.slots_used != null && f.capacity != null) out.push({ label: 'Slots', value: `${f.slots_used} / ${f.capacity}${f.half ? ' · half' : ''}${f.stock ? ` · ${f.stock}` : ''}` });
  else if (f.stock) out.push({ label: 'Stock', value: f.stock });
  if (f.open_holds.length) out.push({ label: 'Open holds', value: f.open_holds.join(', ') });
  if (f.units.length) out.push({ label: 'Units', value: f.units.map((u) => `${u.reference || u.kind}${u.pushed_out ? ` (pushed out${u.docket_number ? `, Docket ${u.docket_number}` : ''})` : ''}${u.cancelled ? ' (cancelled)' : ''}`).join('; ') });
  // a27 item 2 (ruling 20 Nov 2026): a short run on a full batch — the oldest orders that fit stay; these lines go back to the pool on approval.
  if (p.kind === 'push_short_run' && f.lines_moving && f.lines_moving.length) {
    const slots = f.lines_moving.reduce((n, l) => n + l.slots, 0);
    out.push({ label: `Stays (oldest that fit)`, value: `${f.slots_kept ?? 0} slot${f.slots_kept === 1 ? '' : 's'}` });
    out.push({ label: `Back to the pool on approval (${f.lines_moving.length} line${f.lines_moving.length === 1 ? '' : 's'}, ${slots} slot${slots === 1 ? '' : 's'})`, value: f.lines_moving.map((l) => `${l.order_ref || l.order_id.slice(0, 8)} · ${l.product || 'line'} · ${l.slots}`).join('; ') });
  }
  return out;
}

