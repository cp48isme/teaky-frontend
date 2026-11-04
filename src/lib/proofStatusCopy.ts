/**
 * Proof status, said two ways (RGI build plan group B, "Proof status visible
 * inside Teaky", 3 Nov 2026). Built on the model as deployed in rev 24:
 * awaiting_proof is a typed hold on a shipment unit, and each line carries
 * needs_proof / proof_status. Nothing new is stored; this reads what exists.
 *
 * Printer side: counts and names ("Proofs: 2 approved, 1 waiting (Menu)").
 * Buyer side: no "held"/"released" vocabulary (today's rule) — what the group
 * is waiting for, and whether it has gone to the printer.
 */
import type { LineItem } from "../types/order";
import type { ReleaseUnit } from "../types/releaseUnit";

export interface ProofSummary {
  needed: LineItem[];
  approved: LineItem[];
  waiting: LineItem[];
  declined: LineItem[];
}

const WAITING = new Set(["pending", "changes_requested", null, undefined, ""]);

export function proofSummary(lines: LineItem[]): ProofSummary {
  const needed = lines.filter((li) => li.needs_proof);
  return {
    needed,
    approved: needed.filter((li) => li.proof_status === "approved"),
    waiting: needed.filter((li) => WAITING.has(li.proof_status as string)),
    declined: needed.filter((li) => li.proof_status === "rejected"),
  };
}

function names(lines: LineItem[]): string {
  return lines.map((li) => li.product_name).join(", ");
}

/** Printer side, one line per shipment group. Null when no line needs a proof. */
export function proofSummarySentence(lines: LineItem[]): string | null {
  const s = proofSummary(lines);
  if (s.needed.length === 0) return null;
  if (s.approved.length === s.needed.length) {
    return s.needed.length === 1
      ? "Proof approved."
      : `All ${s.needed.length} proofs approved.`;
  }
  const parts: string[] = [];
  if (s.approved.length) parts.push(`${s.approved.length} approved`);
  if (s.waiting.length)
    parts.push(`${s.waiting.length} waiting (${names(s.waiting)})`);
  if (s.declined.length)
    parts.push(`${s.declined.length} declined (${names(s.declined)})`);
  return `Proofs: ${parts.join(", ")}.`;
}

/** True when the group's own awaiting_proof hold is still open. */
export function awaitingProofHoldOpen(unit: Pick<ReleaseUnit, "holds">): boolean {
  return unit.holds.some((h) => h.reason === "awaiting_proof" && !h.cleared_at);
}

export function buyerGroupTitle(
  unit: Pick<ReleaseUnit, "ordinal">,
  count: number,
): string {
  return count <= 1 ? "Items" : `Group ${unit.ordinal} of ${count}`;
}

/**
 * Buyer side: what this group is waiting for, in the buyer's words. The hold
 * is the authority for "waiting"; the lines say which proof. "Sent to the
 * printer" is the unit's frozen_at (it left Teaky); nothing says held/released.
 */
export function buyerGroupStatus(
  unit: Pick<ReleaseUnit, "holds" | "frozen_at" | "cancelled_at">,
  lines: LineItem[],
): string {
  if (unit.cancelled_at) return "Cancelled.";
  const s = proofSummary(lines);
  if (s.declined.length) {
    return `Proof declined for ${names(s.declined)} — a new proof will come to you.`;
  }
  if (awaitingProofHoldOpen(unit) || s.waiting.length) {
    const which = s.waiting.length ? names(s.waiting) : "this group";
    return `Waiting for your proof: ${which}. Nothing in this group prints until you approve it.`;
  }
  if (s.needed.length) {
    return unit.frozen_at
      ? "Proofs approved — in production."
      : "Proofs approved — going to the printer.";
  }
  return unit.frozen_at
    ? "No proof needed — sent to the printer."
    : "No proof needed — going to the printer.";
}

/** The order's shipment groups in order, with each group's lines. */
export function buyerGroups(
  units: ReleaseUnit[] | undefined,
  lines: LineItem[],
): { unit: ReleaseUnit; lines: LineItem[] }[] {
  const shipments = (units ?? [])
    .filter((u) => u.kind === "shipment")
    .sort((a, b) => a.ordinal - b.ordinal);
  if (shipments.length === 0) return [];
  const byId = new Map(lines.map((li) => [li.id, li]));
  return shipments.map((unit) => ({
    unit,
    lines: unit.line_item_ids
      .map((id) => byId.get(id))
      .filter((li): li is LineItem => !!li),
  }));
}
