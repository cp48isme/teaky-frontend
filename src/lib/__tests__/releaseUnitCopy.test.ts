import { describe, expect, it } from "vitest";
import type { ReleaseUnit, ReleaseUnitHold } from "../../types/releaseUnit";
import {
  clearedHoldSentence,
  formatAge,
  holdSentence,
  numberProvenance,
  priorDecisionSentence,
  productionUnitsOf,
  unitCanRelease,
  unitHeadline,
  unitNeedsHuman,
  unitTitle,
} from "../releaseUnitCopy";

const shipment: ReleaseUnit = {
  id: "u1",
  organization_id: "o",
  portal_id: "p",
  source_order_id: "ord",
  kind: "shipment",
  formation: "split",
  channel: "hotel_portal",
  ordinal: 2,
  partition_key: { lead_time_band: "days_7_10", needs_proof: true },
  release_state: "held_for_proof",
  release_attempts: 0,
  released_at: null,
  released_by_id: null,
  frozen_at: null,
  reference: "ORD-1-2",
  references: [
    {
      id: "r1",
      system: "teaky",
      kind: "reference",
      value: "ORD-1-2",
      is_identity: true,
      source: "planner",
      asserted_by_id: null,
      asserted_at: "2026-11-02T00:00:00Z",
    },
  ],
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
const production: ReleaseUnit = {
  ...shipment,
  id: "p1",
  kind: "production",
  formation: "single",
  ordinal: 1,
  partition_key: null,
  release_state: "released",
  frozen_at: "2026-11-02T01:00:00Z",
  reference: "ORD-1-2",
  references: [
    {
      id: "r2",
      system: "docketmanager",
      kind: "purchase_order_number",
      value: "ORD-1-2",
      is_identity: false,
      source: "planner",
      asserted_by_id: null,
      asserted_at: "2026-11-02T01:00:00Z",
    },
    {
      id: "r3",
      system: "docketmanager",
      kind: "order_number",
      value: "85999",
      is_identity: true,
      source: "push_response",
      asserted_by_id: null,
      asserted_at: "2026-11-02T01:00:01Z",
    },
  ],
};
const hold: ReleaseUnitHold = {
  id: "h1",
  reason: "awaiting_proof",
  line_item_id: "l1",
  case_key: "line_item:l1",
  detail: "Breakfast Vouchers",
  opened_at: "2026-11-02T00:00:00Z",
  opened_by: "planner",
  cleared_at: null,
  cleared_by_id: null,
  cleared_how: null,
  evidence_kind: null,
  evidence_note: null,
  answer: null,
  prior_decision: null,
};

describe("release unit copy (H v3)", () => {
  it("names a shipment group by its ordinal, band and reference, and a job by its reference", () => {
    expect(unitTitle(shipment, 2)).toBe(
      "Group 2 of 2 — 7–10 day items (ORD-1-2)",
    );
    expect(unitTitle(shipment, 1)).toBe("Release to production");
    expect(unitTitle(production, 1)).toBe("Production job ORD-1-2");
  });
  it("says why a group is held, when it is ready, and when it has gone", () => {
    expect(holdSentence(hold)).toBe(
      "Waiting for proof approval: Breakfast Vouchers.",
    );
    expect(unitHeadline({ ...shipment, holds: [hold] })).toBe(
      "This group is held.",
    );
    expect(unitHeadline(shipment)).toBe("This group is ready to release.");
    expect(unitCanRelease({ ...shipment, holds: [hold] })).toBe(false);
    expect(unitCanRelease(shipment)).toBe(true);
    // Once its lines are in a production job the group has nothing to form.
    expect(unitCanRelease(shipment, [production])).toBe(false);
    expect(productionUnitsOf(shipment, [production])).toEqual([production]);
    expect(
      unitHeadline({ ...shipment, release_state: null, frozen_at: "x" }),
    ).toBe("This group has gone to production.");
  });
  it("releases a production job only from retryable, and asks a person only on a job", () => {
    expect(unitCanRelease(production)).toBe(false);
    expect(unitCanRelease({ ...production, release_state: "retryable" })).toBe(
      true,
    );
    expect(unitNeedsHuman({ ...production, release_state: "needs_human" })).toBe(
      true,
    );
    expect(unitNeedsHuman({ ...shipment, release_state: "needs_human" })).toBe(
      false,
    );
  });
  it("records a person-cleared hold loudly, with how, and a band set with the band", () => {
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
    expect(
      clearedHoldSentence({
        ...hold,
        reason: "lead_time_band_missing",
        cleared_at: "2026-11-02T10:00:00Z",
        cleared_how: "band_set",
        answer: "days_7_10",
      }),
    ).toMatch(/^Lead time set to 7–10 days/);
  });
  it("offers the prior decision on the same case", () => {
    expect(priorDecisionSentence(hold)).toBeNull();
    expect(
      priorDecisionSentence({
        ...hold,
        reason: "lead_time_band_missing",
        prior_decision: {
          answer: "days_2_5",
          evidence_kind: "phone",
          decided_by_id: "u",
          decided_at: "2026-11-02T10:00:00Z",
        },
      }),
    ).toMatch(/the answer was 2–5 days\.$/);
  });
  it("says what a DocketManager number is evidence of, from the reference row", () => {
    expect(numberProvenance(production)).toBe(
      "DocketManager 85999 — confirmed by DocketManager's own response.",
    );
    expect(
      numberProvenance({
        ...production,
        references: [
          {
            ...production.references[1],
            source: "person",
            asserted_by_id: "u",
            asserted_at: "2026-11-02T10:00:00Z",
          },
        ],
      }),
    ).toMatch(
      /recorded by a person on .*; Teaky has not confirmed it with DocketManager\./,
    );
    expect(numberProvenance(shipment)).toBeNull();
  });
  it("formats an age for the queue", () => {
    expect(formatAge(120)).toBe("2 min");
    expect(formatAge(7200)).toBe("2 h");
    expect(formatAge(172800)).toBe("2 d");
  });
});
