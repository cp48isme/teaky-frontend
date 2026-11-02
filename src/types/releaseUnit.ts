import type { ReleaseState } from "./order";

/** A release unit (H v2, 2 Nov 2026): one RGI order's worth of lines with
 * its own state, references, outcome and money. */
export interface ReleaseUnitHold {
  id: string;
  reason:
    | "awaiting_proof"
    | "lead_time_band_missing"
    | "batch_pending"
    | "person_hold"
    | string;
  line_item_id: string | null;
  detail: string | null;
  opened_at: string;
  opened_by: string;
  cleared_at: string | null;
  cleared_by_id: string | null;
  cleared_how: string | null;
  evidence_kind: string | null;
  evidence_note: string | null;
}

export interface ReleaseUnit {
  id: string;
  organization_id: string;
  portal_id: string | null;
  source_order_id: string | null;
  kind: "single" | "split" | "batch";
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
  purchase_order_reference: string;
  dm_order_id: string | null;
  snapforce_order_number: string | null;
  link_source: "push_response" | "person" | null;
  link_asserted_by_id: string | null;
  link_asserted_at: string | null;
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

export interface HeldQueueEntry {
  unit_id: string;
  source_order_id: string | null;
  order_number: string | null;
  purchase_order_reference: string;
  release_state: ReleaseState | null;
  age_seconds: number;
  open_holds: string[];
  reason: string | null;
}

export interface HoldEvidence {
  evidence_kind: "email" | "phone" | "in_person" | "other";
  evidence_note: string;
}
