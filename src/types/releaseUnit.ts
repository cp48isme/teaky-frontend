import type { ReleaseState } from "./order";

/**
 * A release unit (H v3, 3 Nov 2026): one shape with a kind.
 * shipment — lines that travel together to one customer and are invoiced
 *   together (one QuickBooks Estimate each); carries the money.
 * production — lines that print together on one sheet (a gang); its own
 *   DocketManager order and outcome.
 * A line belongs to exactly one of each.
 */
export type ReleaseUnitKind = "shipment" | "production";

/** One external identifier a unit carries, as a row: (system, kind, value). */
export interface ExternalReference {
  id: string;
  system: "teaky" | "docketmanager" | "snapforce" | "quickbooks" | string;
  kind:
    | "reference"
    | "order_number"
    | "purchase_order_number"
    | "identifier"
    | "invoice_number"
    | "estimate_id"
    | string;
  value: string;
  is_identity: boolean;
  /** How it came to be known; a `person` row is an assertion, unverified. */
  source: "push_response" | "person" | "planner" | "adapter" | "backfill" | string;
  asserted_by_id: string | null;
  asserted_at: string;
}

/** The latest decision a person made on the same case (§6.2). */
export interface PriorDecision {
  answer: string | null;
  evidence_kind: string | null;
  decided_by_id: string;
  decided_at: string;
}

export interface ReleaseUnitHold {
  id: string;
  reason:
    | "awaiting_proof"
    | "lead_time_band_missing"
    | "batch_pending"
    | "person_hold"
    | string;
  line_item_id: string | null;
  case_key: string | null;
  detail: string | null;
  opened_at: string;
  opened_by: string;
  cleared_at: string | null;
  cleared_by_id: string | null;
  cleared_how: string | null;
  evidence_kind: string | null;
  evidence_note: string | null;
  answer: string | null;
  prior_decision: PriorDecision | null;
}

export interface ReleaseUnit {
  id: string;
  organization_id: string;
  portal_id: string | null;
  source_order_id: string | null;
  kind: ReleaseUnitKind;
  formation: "single" | "split" | "gang";
  channel: string;
  ordinal: number;
  partition_key: {
    strategy?: string;
    needs_proof?: boolean | null;
    lead_time_band?: string | null;
  } | null;
  release_state: ReleaseState | null;
  release_attempts: number;
  released_at: string | null;
  released_by_id: string | null;
  frozen_at: string | null;
  /** The unit's display name: teaky/reference on a shipment unit,
   * docketmanager/purchase_order_number on a production unit. */
  reference: string;
  references: ExternalReference[];
  subtotal: string;
  freight: string;
  tax: string;
  total: string;
  cancelled_at: string | null;
  cancel_reason: string | null;
  line_item_ids: string[];
  holds: ReleaseUnitHold[];
  created_at: string;
  updated_at: string;
}

export interface QueueHold {
  hold_id: string;
  reason: string;
  detail: string | null;
  line_item_id: string | null;
  case_key: string | null;
  prior_decision: PriorDecision | null;
  /** When the hold opened; Held's age is the hold's, not the unit's. */
  opened_at?: string | null;
}

export interface HeldQueueEntry {
  unit_id: string;
  kind: ReleaseUnitKind;
  source_order_id: string | null;
  order_number: string | null;
  reference: string;
  release_state: ReleaseState | null;
  age_seconds: number;
  open_holds: QueueHold[];
}

/** E.3 for every reason: who approved and how; the answer where the reason
 * has one (the band for lead_time_band_missing). */
export interface HoldResolution {
  evidence_kind: "email" | "phone" | "in_person" | "other";
  evidence_note: string;
  answer?: string | null;
}

export const LEAD_TIME_BANDS: { value: string; label: string }[] = [
  { value: "days_2_5", label: "2–5 days" },
  { value: "days_7_10", label: "7–10 days" },
];
