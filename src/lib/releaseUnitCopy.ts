/**
 * Plain language for a release unit (H v2): the same states as the order's
 * block, said per group, plus the holds that keep a group from releasing and
 * what the DocketManager number on it is evidence of.
 */
import { RELEASE_LABELS } from "./releaseCopy";
import type { ReleaseUnit, ReleaseUnitHold } from "../types/releaseUnit";

export function unitTitle(unit: ReleaseUnit, count: number): string {
  if (count <= 1) return "Release to production";
  const band = unit.partition_key?.lead_time_band;
  const bandText =
    band === "days_2_5"
      ? "2–5 day items"
      : band === "days_7_10"
        ? "7–10 day items"
        : band === "band_unknown"
          ? "lead time not set"
          : null;
  return `Group ${unit.ordinal} of ${count}${bandText ? ` — ${bandText}` : ""} (${unit.purchase_order_reference})`;
}

export function holdSentence(hold: ReleaseUnitHold): string {
  switch (hold.reason) {
    case "awaiting_proof":
      return `Waiting for proof approval: ${hold.detail ?? "a line that needs a proof"}.`;
    case "lead_time_band_missing":
      return `${hold.detail ?? "A product has no lead-time band"} — set it on the product.`;
    case "batch_pending":
      return "Waiting for the press run.";
    case "person_hold":
      return `Held by a person: ${hold.detail ?? ""}`.trim();
    default:
      return `${hold.reason}${hold.detail ? `: ${hold.detail}` : ""}`;
  }
}

export function clearedHoldSentence(hold: ReleaseUnitHold): string | null {
  if (!hold.cleared_at || hold.cleared_how !== "person_cleared") return null;
  const when = new Date(hold.cleared_at).toLocaleDateString();
  const how =
    hold.evidence_kind === "in_person"
      ? "in person"
      : (hold.evidence_kind ?? "other");
  return `Released without a proof in Teaky — approved by ${how}${hold.evidence_note ? `: ${hold.evidence_note}` : ""} (${when}).`;
}

/** What the DocketManager number on a unit is evidence of (§8.7). */
export function numberProvenance(unit: ReleaseUnit): string | null {
  if (!unit.dm_order_id) return null;
  if (unit.link_source === "person") {
    const when = unit.link_asserted_at
      ? ` on ${new Date(unit.link_asserted_at).toLocaleDateString()}`
      : "";
    return `DocketManager ${unit.dm_order_id} — recorded by a person${when}; Teaky has not confirmed it with DocketManager.`;
  }
  return `DocketManager ${unit.dm_order_id} — confirmed by DocketManager's own response.`;
}

export function unitStateLabel(unit: ReleaseUnit): string {
  if (unit.cancelled_at) return "Cancelled";
  if (!unit.release_state) return "Sent at placement";
  return RELEASE_LABELS[unit.release_state];
}

export function unitHeadline(unit: ReleaseUnit): string {
  if (unit.cancelled_at)
    return `Cancelled${unit.cancel_reason ? `: ${unit.cancel_reason}` : ""}.`;
  const open = unit.holds.filter((h) => !h.cleared_at);
  switch (unit.release_state) {
    case null:
      return "This group went to DocketManager at placement.";
    case "held_for_proof":
      return open.length
        ? "This group is held."
        : "This group is ready to release.";
    case "releasing":
      return "This group is being released now.";
    case "released":
      return "This group is in production.";
    case "retryable":
      return "The release of this group failed before DocketManager made the job. Release it again.";
    case "needs_human":
      return "The outcome of this group’s release is unknown. Check DocketManager before anything resends.";
    default:
      return "";
  }
}

export function unitCanRelease(unit: ReleaseUnit): boolean {
  if (unit.cancelled_at || unit.dm_order_id) return false;
  const open = unit.holds.some((h) => !h.cleared_at);
  return (
    (unit.release_state === "held_for_proof" && !open) ||
    unit.release_state === "retryable"
  );
}

export function unitNeedsHuman(unit: ReleaseUnit): boolean {
  return (
    !unit.cancelled_at &&
    (unit.release_state === "needs_human" || unit.release_state === "releasing")
  );
}

export function formatAge(seconds: number): string {
  if (seconds < 3600) return `${Math.max(1, Math.round(seconds / 60))} min`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} h`;
  return `${Math.round(seconds / 86400)} d`;
}
