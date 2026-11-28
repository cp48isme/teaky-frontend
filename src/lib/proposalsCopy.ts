import type { ActionProposal, ActionProposalFacts, ActionProposalKind, ActionProposalTarget } from '../types/proposals';

/** The words the proposals panel uses: the action's name and the facts a proposal carries, as label/value pairs. */

export const KIND_LABEL: Record<ActionProposalKind, string> = {
  push_short_run: 'Push a short run (half batch)',
  push_alone: 'Push this order alone',
  void_order: 'Void this order',
  mark_done: 'Mark done (skip the remaining steps)',
};


/** The short name of an action, for a sentence ("A short-run proposal is already open…"). */
export const KIND_SHORT: Record<ActionProposalKind, string> = {
  push_short_run: 'short-run',
  push_alone: 'push-alone',
  void_order: 'void',
  mark_done: 'mark-done',
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UUID_ANYWHERE = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi;

/** True when a "reference" is really an id — the backend falls back to the row's id when nothing better is recorded. */
export function isId(text: string | null | undefined): boolean {
  return Boolean(text && UUID.test(text));
}

/** What a proposal's target is called in front of a person (dispatch 27 Nov
 * 2026 evening, A): an order by its number ("W7001234"), a batch as "Batch
 * 101", a unit with no batch number yet as "Unit 5CBHE336", and — when the
 * only reference the backend had was an id — "this order" / "this batch". A
 * reference that already names itself ("Batch 141") is left as it is. No UUID
 * is ever shown. */
export function targetWords(f: Pick<ActionProposalFacts, 'target_kind' | 'reference'>): string {
  if (!f.reference || isId(f.reference)) return f.target_kind === 'order' ? 'this order' : 'this batch';
  if (f.target_kind === 'order' || /^(Batch|Unit|Order) /i.test(f.reference)) return f.reference;
  return /^\d+$/.test(f.reference) ? `Batch ${f.reference}` : `Unit ${f.reference}`;
}

/** The Target fact: the order's number carries its noun ("Order W7001234"). */
export function targetFact(f: Pick<ActionProposalFacts, 'target_kind' | 'reference'>): string {
  const words = targetWords(f);
  return f.target_kind === 'order' && words !== 'this order' && !/^Order /i.test(words) ? `Order ${words}` : words;
}

/** A unit inside the facts, named without its id or its internal kind. */
export function unitWords(u: { reference: string; kind: string }): string {
  if (u.reference && !isId(u.reference)) return u.reference;
  return u.kind === 'production' ? 'a batch' : 'a shipment unit';
}

/** The server's refusal, in words beside the button that was pressed: no
 * internal kind (push_short_run) and no id. The sentence the panel meets most
 * — "a <kind> proposal is already open on this target (<id>)" — becomes
 * "A short-run proposal is already open for Batch 101 — it's below." Any
 * other sentence keeps its words with ids and kinds replaced; a refusal that
 * already reads as words ("the action refused: …") is unchanged. */
export function refusalWords(message: string, target?: { target_kind: ActionProposalTarget; label: string }): string {
  const open = /^a (push_short_run|push_alone|void_order|mark_done) proposal is already open on this target/.exec(message);
  if (open) {
    const kind = open[1] as ActionProposalKind;
    const where = target ? target.label : 'this target';
    return `A ${KIND_SHORT[kind]} proposal is already open for ${where} — it's below.`;
  }
  if (/second approver is required/.test(message)) return 'A second approver is required: the person who proposed an action cannot approve it.';
  let words = message.replace(/\s*\((?:[0-9a-f-]{36})\)/gi, '').replace(UUID_ANYWHERE, 'it');
  for (const kind of Object.keys(KIND_SHORT) as ActionProposalKind[]) words = words.split(kind).join(KIND_SHORT[kind]);
  return words;
}

export function factsText(p: ActionProposal): { label: string; value: string }[] {
  const f = p.facts;
  const out: { label: string; value: string }[] = [
    { label: 'Target', value: targetFact(f) },
    { label: 'Channel', value: f.channel },
    { label: 'Customer', value: f.customer },
    { label: 'Lines · cards', value: `${f.lines} · ${f.cards}` },
  ];
  if (f.order_status) out.push({ label: 'Order status', value: f.order_status });
  if (f.slots_used != null && f.capacity != null) out.push({ label: 'Slots', value: `${f.slots_used} / ${f.capacity}${f.half ? ' · half' : ''}${f.stock ? ` · ${f.stock}` : ''}` });
  else if (f.stock) out.push({ label: 'Stock', value: f.stock });
  if (f.open_holds.length) out.push({ label: 'Open holds', value: f.open_holds.join(', ') });
  if (f.units.length) out.push({ label: 'Units', value: f.units.map((u) => `${unitWords(u)}${u.pushed_out ? ` (pushed out${u.docket_number ? `, Docket ${u.docket_number}` : ''})` : ''}${u.cancelled ? ' (cancelled)' : ''}`).join('; ') });
  // a27 item 2 (ruling 20 Nov 2026): a short run on a full batch — the oldest orders that fit stay; these lines go back to the pool on approval.
  if (p.kind === 'push_short_run' && f.lines_moving && f.lines_moving.length) {
    const slots = f.lines_moving.reduce((n, l) => n + l.slots, 0);
    out.push({ label: `Stays (oldest that fit)`, value: `${f.slots_kept ?? 0} slot${f.slots_kept === 1 ? '' : 's'}` });
    out.push({ label: `Back to the pool on approval (${f.lines_moving.length} line${f.lines_moving.length === 1 ? '' : 's'}, ${slots} slot${slots === 1 ? '' : 's'})`, value: f.lines_moving.map((l) => `${l.order_ref || 'an order'} · ${l.product || 'line'} · ${l.slots}`).join('; ') });
  }
  return out;
}

