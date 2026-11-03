/**
 * Plain language for a release unit (H v3): a shipment group (what ships and
 * is invoiced together) and its production group (what went to DocketManager
 * as one job), the holds that keep a group from releasing, and what the
 * DocketManager number on a production group is evidence of.
 */
import { RELEASE_LABELS } from "./releaseCopy";
import {
  LEAD_TIME_BANDS,
  type ExternalReference,
  type ReleaseUnit,
  type ReleaseUnitHold,
} from "../types/releaseUnit";

export function bandLabel(band: string | null | undefined): string | null {
  if (!band) return null;
  if (band === "band_unknown") return "lead time not set";
  return LEAD_TIME_BANDS.find((b) => b.value === band)?.label ?? band;
}

export function unitTitle(unit: ReleaseUnit, count: number): string {
  if (unit.kind === "production") {
    return unit.formation === "gang"
      ? `Press run ${unit.reference}`
      : `Production job ${unit.reference}`;
  }
  if (count <= 1) return "Release to production";
  const band = bandLabel(unit.partition_key?.lead_time_band);
  const bandText = band ? ` — ${band.replace(" days", " day items")}` : "";
  return `Group ${unit.ordinal} of ${count}${bandText} (${unit.reference})`;
}

export function findReference(
  unit: Pick<ReleaseUnit, "references">,
  system: string,
  kind: string,
): ExternalReference | null {
  return (
    unit.references.find((r) => r.system === system && r.kind === kind) ?? null
  );
}

export function dmOrderNumber(
  unit: Pick<ReleaseUnit, "references">,
): ExternalReference | null {
  return findReference(unit, "docketmanager", "order_number");
}

export function holdSentence(hold: ReleaseUnitHold): string {
  switch (hold.reason) {
    case "awaiting_proof":
      return `Waiting for proof approval: ${hold.detail ?? "a line that needs a proof"}.`;
    case "lead_time_band_missing":
      return `${hold.detail ?? "A product has no lead-time band"} — choose the band to clear this and set it on the product.`;
    case "batch_pending":
      return "Waiting for the press run.";
    case "person_hold":
      return `Held by a person: ${hold.detail ?? ""}`.trim();
    default:
      return `${hold.reason}${hold.detail ? `: ${hold.detail}` : ""}`;
  }
}

/** The remembered answer for the same case, if a person decided it before. */
export function priorDecisionSentence(hold: ReleaseUnitHold): string | null {
  const prior = hold.prior_decision;
  if (!prior) return null;
  const when = new Date(prior.decided_at).toLocaleDateString();
  const answer =
    hold.reason === "lead_time_band_missing"
      ? (bandLabel(prior.answer) ?? prior.answer)
      : prior.answer;
  return answer
    ? `Last time this came up (${when}) the answer was ${answer}.`
    : `Last time this came up (${when}) it was cleared${prior.evidence_kind ? ` by ${prior.evidence_kind.replace("_", " ")}` : ""}.`;
}

export function clearedHoldSentence(hold: ReleaseUnitHold): string | null {
  if (!hold.cleared_at) return null;
  const when = new Date(hold.cleared_at).toLocaleDateString();
  if (hold.cleared_how === "band_set") {
    return `Lead time set to ${bandLabel(hold.answer) ?? hold.answer ?? "a band"} (${when}); the product remembers it.`;
  }
  if (hold.cleared_how !== "person_cleared") return null;
  const how =
    hold.evidence_kind === "in_person"
      ? "in person"
      : (hold.evidence_kind ?? "other");
  if (hold.reason === "awaiting_proof") {
    return `Released without a proof in Teaky — approved by ${how}${hold.evidence_note ? `: ${hold.evidence_note}` : ""} (${when}).`;
  }
  const answer = hold.answer
    ? ` Answer: ${bandLabel(hold.answer) ?? hold.answer}.`
    : "";
  return `Cleared by a person, by ${how}${hold.evidence_note ? `: ${hold.evidence_note}` : ""} (${when}).${answer}`;
}

/** What the DocketManager number on a production unit is evidence of (§8.8). */
export function numberProvenance(unit: ReleaseUnit): string | null {
  const dm = dmOrderNumber(unit);
  if (!dm) return null;
  if (dm.source === "person") {
    const when = dm.asserted_at
      ? ` on ${new Date(dm.asserted_at).toLocaleDateString()}`
      : "";
    return `DocketManager ${dm.value} — recorded by a person${when}; Teaky has not confirmed it with DocketManager.`;
  }
  return `DocketManager ${dm.value} — confirmed by DocketManager's own response.`;
}

export function unitStateLabel(unit: ReleaseUnit): string {
  if (unit.cancelled_at) return "Cancelled";
  if (!unit.release_state) {
    if (unit.kind === "production") return "Sent at placement";
    return unit.frozen_at ? "Sent to production" : "Ready";
  }
  return RELEASE_LABELS[unit.release_state];
}

export function unitHeadline(unit: ReleaseUnit): string {
  if (unit.cancelled_at)
    return `Cancelled${unit.cancel_reason ? `: ${unit.cancel_reason}` : ""}.`;
  const open = unit.holds.filter((h) => !h.cleared_at);
  if (unit.kind === "shipment") {
    if (unit.release_state === "held_for_proof")
      return open.length
        ? "This group is held."
        : "This group is ready to release.";
    if (unit.frozen_at) return "This group has gone to production.";
    return "This group is ready to release.";
  }
  switch (unit.release_state) {
    case null:
      return "This job went to DocketManager at placement.";
    case "releasing":
      return "This job is being released now.";
    case "released":
      return "This job is in production.";
    case "retryable":
      return "The release of this job failed before DocketManager made it. Release it again.";
    case "needs_human":
      return "The outcome of this job's release is unknown. Check DocketManager before anything resends.";
    default:
      return "";
  }
}

/** A shipment group releases when it has no open hold and lines not yet in
 * a production job; a production job only from retryable (§3, §8.5). */
export function unitCanRelease(
  unit: ReleaseUnit,
  productionUnits: ReleaseUnit[] = [],
): boolean {
  if (unit.cancelled_at) return false;
  if (unit.kind === "production") return unit.release_state === "retryable";
  if (unit.holds.some((h) => !h.cleared_at)) return false;
  const formed = new Set(productionUnits.flatMap((p) => p.line_item_ids));
  return unit.line_item_ids.some((id) => !formed.has(id));
}

export function unitNeedsHuman(unit: ReleaseUnit): boolean {
  return (
    unit.kind === "production" &&
    !unit.cancelled_at &&
    (unit.release_state === "needs_human" || unit.release_state === "releasing")
  );
}

/** The production jobs that carry any of a shipment group's lines. */
export function productionUnitsOf(
  shipment: ReleaseUnit,
  units: ReleaseUnit[],
): ReleaseUnit[] {
  const lines = new Set(shipment.line_item_ids);
  return units.filter(
    (u) =>
      u.kind === "production" && u.line_item_ids.some((id) => lines.has(id)),
  );
}

export function formatAge(seconds: number): string {
  if (seconds < 3600) return `${Math.max(1, Math.round(seconds / 60))} min`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} h`;
  return `${Math.round(seconds / 86400)} d`;
}
