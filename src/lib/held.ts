import type { HeldQueueEntry, HoldResolution, QueueHold } from '../types/releaseUnit';
import type { Order } from '../types/order';
import type { StockEvidence, TaylorPoolLine } from '../types/production';

/** Board 4 (Held): two lists. "Waiting for a fact" clears itself when the
 * thing arrives — nobody decides it. "Needs a decision" has the facts and
 * the shop chooses: once, or "always" as a shop rule. Pure; the page renders. */

export type HeldKind = 'fact' | 'decision';
export type WaitingOn = 'the channel' | 'the buyer' | 'you' | 'a shop rule' | 'a person';

/** The reasons as the queue carries them, each to its list and whom it waits on. */
export const REASONS: Record<string, { kind: HeldKind; title: string; waitingOn: WaitingOn; clears: string }> = {
  awaiting_proof: { kind: 'fact', title: 'Proof not approved', waitingOn: 'the buyer', clears: 'Clears on approval' },
  art_missing: { kind: 'fact', title: 'No art file yet', waitingOn: 'the channel', clears: 'Clears itself' },
  stock_unknown: { kind: 'decision', title: 'Stock unknown', waitingOn: 'you', clears: 'One press' },
  stock_mixed: { kind: 'decision', title: 'Mixed stock', waitingOn: 'a shop rule', clears: 'Split or wait' },
  exceeds_capacity: { kind: 'decision', title: 'Over capacity', waitingOn: 'a shop rule', clears: 'Split or wait' },
  lead_time_band_missing: { kind: 'decision', title: 'Lead time unknown', waitingOn: 'you', clears: 'One press' },
  person_hold: { kind: 'decision', title: 'Held by a person', waitingOn: 'a person', clears: 'Cleared by hand' },
  batch_pending: { kind: 'fact', title: 'Waiting for its batch', waitingOn: 'the channel', clears: 'Clears when the batch forms' },
};

export interface HeldRow {
  key: string;
  kind: HeldKind;
  reason: string;
  title: string;
  waitingOn: WaitingOn;
  clears: string;
  /** The order as a person names it: PO or order number. */
  order: string;
  /** channel · product · qty × pack · stock */
  summary: string;
  detail: string | null;
  ageSeconds: number;
  /** For a queue hold: what the one press needs. Absent for a Taylor pool line. */
  unitId: string | null;
  holdId: string | null;
  productKey: string | null;
  lineItemId: string | null;
  /** A Taylor pool line held on its art: "fetch now" is the pull. */
  taylorLineId: string | null;
}

export interface HeldLists {
  waitingForFact: HeldRow[];
  needsDecision: HeldRow[];
  counts: { held: number; fact: number; onYou: number; onRule: number };
}

const SPEC_CASE_PREFIX = 'product_key:';

export function productKeyOf(hold: QueueHold): string | null {
  if (hold.case_key && hold.case_key.startsWith(SPEC_CASE_PREFIX)) return hold.case_key.slice(SPEC_CASE_PREFIX.length);
  return null;
}

function lineSummary(order: Order | undefined, lineItemId: string | null): string {
  if (!order) return '';
  const line = lineItemId ? order.line_items.find((l) => l.id === lineItemId) : order.line_items[0];
  if (!line) return `RGI portal · ${order.line_items.length} lines`;
  const product = line.product_sku ? `${line.product_sku} · ${line.product_name}` : line.product_name;
  return `RGI portal · ${product} · ${line.quantity} × ${line.pack_size ?? 1}`;
}

/** Split the held queue and the Taylor pool's art holds into the two lists,
 * oldest first within each. */
export function splitHeld(entries: HeldQueueEntry[], orders: Order[], taylor: TaylorPoolLine[], now: Date = new Date()): HeldLists {
  const byOrder = new Map(orders.map((o) => [o.id, o]));
  const rows: HeldRow[] = [];
  for (const entry of entries) {
    for (const hold of entry.open_holds) {
      const meta = REASONS[hold.reason] ?? { kind: 'decision' as HeldKind, title: hold.reason, waitingOn: 'a person' as WaitingOn, clears: '' };
      const order = entry.source_order_id ? byOrder.get(entry.source_order_id) : undefined;
      rows.push({
        key: hold.hold_id,
        kind: meta.kind,
        reason: hold.reason,
        title: meta.title,
        waitingOn: meta.waitingOn,
        clears: meta.clears,
        order: order?.po_number || order?.order_number || entry.order_number || entry.reference,
        summary: lineSummary(order, hold.line_item_id),
        detail: hold.detail,
        ageSeconds: entry.age_seconds,
        unitId: entry.unit_id,
        holdId: hold.hold_id,
        productKey: productKeyOf(hold),
        lineItemId: hold.line_item_id,
        taylorLineId: null,
      });
    }
  }
  for (const line of taylor) {
    if (line.art_state !== 'hold') continue;
    const meta = REASONS.art_missing;
    rows.push({
      key: `taylor:${line.id}`,
      kind: meta.kind,
      reason: 'art_missing',
      title: meta.title,
      waitingOn: meta.waitingOn,
      clears: meta.clears,
      order: line.po,
      summary: `Taylor · ${line.product} · ${line.quantity} × ${line.pack}${line.stock ? ` · ${line.stock}` : ''}`,
      detail: line.art_error ? `Artwork: ${line.art_error}` : 'Artwork not fetched yet',
      ageSeconds: Math.max(0, Math.floor((now.getTime() - new Date(line.received_at).getTime()) / 1000)),
      unitId: null,
      holdId: null,
      productKey: null,
      lineItemId: null,
      taylorLineId: line.id,
    });
  }
  rows.sort((a, b) => b.ageSeconds - a.ageSeconds);
  const waitingForFact = rows.filter((r) => r.kind === 'fact');
  const needsDecision = rows.filter((r) => r.kind === 'decision');
  return {
    waitingForFact,
    needsDecision,
    counts: {
      held: rows.length,
      fact: waitingForFact.length,
      onYou: needsDecision.filter((r) => r.waitingOn === 'you').length,
      onRule: needsDecision.filter((r) => r.waitingOn === 'a shop rule').length,
    },
  };
}

/** The one press: the stock as the answer, the evidence rows on screen as
 * the note. The server writes the spec row with source=person in the same
 * action and closes the hold. */
export function onePressResolution(stock: string, evidence: StockEvidence[]): HoldResolution {
  const shown = evidence.length ? evidence.map((e) => `${e.kind}: ${e.stock} — ${e.detail}`).join('; ') : 'no evidence rows';
  return { evidence_kind: 'other', evidence_note: `Held, one press — evidence shown: ${shown}`.slice(0, 1000), answer: stock };
}

/** The stocks a shop runs, the suggestion's first. */
export function stockChoices(leading: string | null, known: string[] = ['80#', '100#', '120#', '16 C2S']): string[] {
  const rest = known.filter((s) => s !== leading);
  return leading ? [leading, ...rest] : rest;
}
