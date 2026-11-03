import { describe, expect, it } from "vitest";
import { groupSentences } from "../releaseGroupCopy";
import type { ReleaseUnit } from "../../types/releaseUnit";

const line = (id: string, name: string, quantity: number) =>
  ({
    id,
    product_name: name,
    quantity,
    needs_proof: false,
    proof_status: null,
  }) as never;
const unit = (
  id: string,
  ordinal: number,
  lineIds: string[],
  waiting: boolean,
): ReleaseUnit =>
  ({
    id,
    kind: "shipment",
    ordinal,
    reference: `ORD-41BD4C83-${ordinal}`,
    line_item_ids: lineIds,
    cancelled_at: null,
    release_state: waiting ? "held_for_proof" : null,
    holds: waiting
      ? [{ id: "h", reason: "awaiting_proof", cleared_at: null }]
      : [],
  }) as never;

describe("groupSentences", () => {
  it("is silent for one group or none", () => {
    expect(
      groupSentences(
        {
          order_number: "ORD-1",
          line_items: [line("a", "Cards", 2)],
          release_units: [unit("u1", 1, ["a"], false)],
        },
        null,
      ),
    ).toBeNull();
    expect(
      groupSentences(
        { order_number: "ORD-1", line_items: [], release_units: [] },
        null,
      ),
    ).toBeNull();
  });
  it("says per group what goes now and what waits, and that invoices come separately", () => {
    const result = groupSentences(
      {
        order_number: "ORD-41BD4C83",
        line_items: [
          line("a", "Business Cards", 2),
          line("b", "Door Hangers", 1),
          line("c", "Breakfast Vouchers", 3),
        ],
        release_units: [
          unit("u2", 2, ["c"], true),
          unit("u1", 1, ["a", "b"], false),
        ],
      },
      "Single Source Concierge",
    );
    expect(result?.groups.map((g) => g.heading)).toEqual([
      "3 items go to the printer now.",
      "3 items wait for your proof.",
    ]);
    expect(result?.groups[0].lines).toBe("Business Cards ×2, Door Hangers ×1");
    expect(result?.groups[1].note).toBe(
      "A proof will come from Single Source Concierge; nothing in this group prints until you approve it.",
    );
    expect(result?.invoiceNote).toContain(
      "ORD-41BD4C83 with a suffix (-1, -2)",
    );
    expect(JSON.stringify(result)).not.toMatch(/held|released/);
  });
  it("leaves a cancelled group out", () => {
    const cancelled = {
      ...unit("u2", 2, ["c"], true),
      cancelled_at: "2026-11-02T00:00:00Z",
    };
    expect(
      groupSentences(
        {
          order_number: "ORD-1",
          line_items: [line("a", "Cards", 2), line("c", "V", 3)],
          release_units: [unit("u1", 1, ["a"], false), cancelled],
        },
        null,
      ),
    ).toBeNull();
  });
});

describe("groupSentences (H v3)", () => {
  it("speaks only of shipment groups; a production job is never the buyer's", () => {
    const job = {
      ...unit("p1", 1, ["a", "b", "c"], false),
      kind: "production",
    } as never;
    expect(
      groupSentences(
        {
          order_number: "ORD-41BD4C83",
          line_items: [line("a", "Cards", 2), line("c", "V", 3)],
          release_units: [unit("u1", 1, ["a"], false), job],
        },
        null,
      ),
    ).toBeNull();
    const result = groupSentences(
      {
        order_number: "ORD-41BD4C83",
        line_items: [line("a", "Cards", 2), line("c", "V", 3)],
        release_units: [unit("u1", 1, ["a"], false), unit("u2", 2, ["c"], true), job],
      },
      null,
    );
    expect(result?.groups.map((g) => g.unitId)).toEqual(["u1", "u2"]);
    expect(result?.invoiceNote).toContain("with a suffix (-1, -2)");
  });
});
