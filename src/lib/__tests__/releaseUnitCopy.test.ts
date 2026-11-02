import { describe, expect, it } from "vitest";
import type { ReleaseUnit, ReleaseUnitHold } from "../../types/releaseUnit";
import {
  clearedHoldSentence,
  formatAge,
  holdSentence,
  numberProvenance,
  unitCanRelease,
  unitHeadline,
  unitTitle,
} from "../releaseUnitCopy";

const base: ReleaseUnit = {
  id: "u1",
  organization_id: "o",
  portal_id: "p",
  source_order_id: "ord",
  kind: "split",
  channel: "hotel_portal",
  ordinal: 2,
  partition_key: { lead_time_band: "days_7_10", needs_proof: true },
  release_state: "held_for_proof",
  release_attempts: 0,
  released_at: null,
  released_by_id: null,
  frozen_at: null,
  purchase_order_reference: "ORD-1-2",
  dm_order_id: null,
  snapforce_order_number: null,
  link_source: null,
  link_asserted_by_id: null,
  link_asserted_at: null,
  subtotal: "10.00",
  freight: "0.00",
  tax: "0.00",
  total: "10.00",
  cancelled_at: null,
  cancel_reason: null,
  line_item_ids: ["l1"],
  holds: [],
  created_at: "2026-11-02T00:00:00Z",
  updated_at: "2026-11-02T00:00:00Z",
};
const hold: ReleaseUnitHold = {
  id: "h1",
  reason: "awaiting_proof",
  line_item_id: "l1",
  detail: "Breakfast Vouchers",
  opened_at: "2026-11-02T00:00:00Z",
  opened_by: "planner",
  cleared_at: null,
  cleared_by_id: null,
  cleared_how: null,
  evidence_kind: null,
  evidence_note: null,
};

describe("release unit copy", () => {
  it("names a group by its ordinal, band and reference", () => {
    expect(unitTitle(base, 2)).toBe("Group 2 of 2 — 7–10 day items (ORD-1-2)");
    expect(unitTitle(base, 1)).toBe("Release to production");
  });
  it("says why a group is held and when it is ready", () => {
    expect(holdSentence(hold)).toBe(
      "Waiting for proof approval: Breakfast Vouchers.",
    );
    expect(unitHeadline({ ...base, holds: [hold] })).toBe(
      "This group is held.",
    );
    expect(unitHeadline(base)).toBe("This group is ready to release.");
    expect(unitCanRelease({ ...base, holds: [hold] })).toBe(false);
    expect(unitCanRelease(base)).toBe(true);
  });
  it("records a person-cleared hold loudly, with how", () => {
    const cleared = {
      ...hold,
      cleared_at: "2026-11-02T10:00:00Z",
      cleared_how: "person_cleared",
      evidence_kind: "email",
      evidence_note: "Jeni Sharp approved by email",
    };
    expect(clearedHoldSentence(cleared)).toMatch(
      /^Released without a proof in Teaky — approved by email: Jeni Sharp approved by email/,
    );
  });
  it("says what a DocketManager number is evidence of", () => {
    expect(
      numberProvenance({
        ...base,
        dm_order_id: "85999",
        link_source: "push_response",
      }),
    ).toBe(
      "DocketManager 85999 — confirmed by DocketManager’s own response.".replace(
        "’",
        "'",
      ),
    );
    expect(
      numberProvenance({
        ...base,
        dm_order_id: "85999",
        link_source: "person",
        link_asserted_at: "2026-11-02T10:00:00Z",
      }),
    ).toMatch(
      /recorded by a person on .*; Teaky has not confirmed it with DocketManager\./,
    );
  });
  it("formats an age for the queue", () => {
    expect(formatAge(120)).toBe("2 min");
    expect(formatAge(7200)).toBe("2 h");
    expect(formatAge(172800)).toBe("2 d");
  });
});
