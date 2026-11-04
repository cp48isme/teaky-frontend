import { describe, expect, it } from "vitest";
import {
  awaitingProofHoldOpen,
  buyerGroupStatus,
  buyerGroupTitle,
  buyerGroups,
  proofSummarySentence,
} from "../proofStatusCopy";
import type { LineItem } from "../../types/order";
import type { ReleaseUnit, ReleaseUnitHold } from "../../types/releaseUnit";

const line = (id: string, name: string, needs: boolean, status: string | null): LineItem =>
  ({ id, product_name: name, needs_proof: needs, proof_status: status, quantity: 1 }) as LineItem;

const hold = (cleared: string | null): ReleaseUnitHold =>
  ({ id: "h1", reason: "awaiting_proof", cleared_at: cleared }) as ReleaseUnitHold;

const unit = (over: Partial<ReleaseUnit>): ReleaseUnit =>
  ({ id: "u1", kind: "shipment", ordinal: 1, holds: [], frozen_at: null, cancelled_at: null, line_item_ids: [], ...over }) as ReleaseUnit;

describe("proofSummarySentence (printer)", () => {
  it("says nothing when no line needs a proof", () => {
    expect(proofSummarySentence([line("a", "Passes", false, null)])).toBeNull();
  });
  it("counts approved, waiting and declined and names the waiting ones", () => {
    const s = proofSummarySentence([
      line("a", "Menu", true, "pending"),
      line("b", "Voucher", true, "approved"),
      line("c", "Tent card", true, "rejected"),
      line("d", "Passes", false, null),
    ]);
    expect(s).toBe("Proofs: 1 approved, 1 waiting (Menu), 1 declined (Tent card).");
  });
  it("says all approved", () => {
    expect(proofSummarySentence([line("a", "Menu", true, "approved"), line("b", "V", true, "approved")])).toBe(
      "All 2 proofs approved.",
    );
    expect(proofSummarySentence([line("a", "Menu", true, "approved")])).toBe("Proof approved.");
  });
});

describe("buyerGroupStatus (buyer words, no held/released)", () => {
  const menu = line("a", "Menu", true, "pending");
  it("waits on the open hold and names the proof", () => {
    const s = buyerGroupStatus(unit({ holds: [hold(null)] }), [menu]);
    expect(s).toBe("Waiting for your proof: Menu. Nothing in this group prints until you approve it.");
    expect(s).not.toMatch(/held|released/i);
  });
  it("still waits when the hold is cleared but a proof is pending on a line", () => {
    expect(buyerGroupStatus(unit({ holds: [hold("2026-11-03")] }), [menu])).toMatch(/^Waiting for your proof: Menu/);
  });
  it("says approved and whether it has gone to the printer", () => {
    const approved = line("a", "Menu", true, "approved");
    expect(buyerGroupStatus(unit({ holds: [hold("2026-11-03")] }), [approved])).toBe("Proofs approved — going to the printer.");
    expect(buyerGroupStatus(unit({ holds: [hold("2026-11-03")], frozen_at: "2026-11-03" }), [approved])).toBe("Proofs approved — in production.");
  });
  it("says no proof needed and whether it was sent", () => {
    const passes = line("a", "Passes", false, null);
    expect(buyerGroupStatus(unit({}), [passes])).toBe("No proof needed — going to the printer.");
    expect(buyerGroupStatus(unit({ frozen_at: "2026-11-03" }), [passes])).toBe("No proof needed — sent to the printer.");
  });
  it("names a declined proof and the cancelled state", () => {
    expect(buyerGroupStatus(unit({}), [line("a", "Menu", true, "rejected")])).toBe(
      "Proof declined for Menu — a new proof will come to you.",
    );
    expect(buyerGroupStatus(unit({ cancelled_at: "2026-11-03" }), [menu])).toBe("Cancelled.");
  });
});

describe("buyerGroups / titles", () => {
  it("orders shipment units by ordinal and attaches their lines", () => {
    const a = line("a", "Menu", true, "pending");
    const b = line("b", "Passes", false, null);
    const groups = buyerGroups(
      [
        unit({ id: "u2", ordinal: 2, line_item_ids: ["b"] }),
        unit({ id: "u1", ordinal: 1, line_item_ids: ["a"] }),
        unit({ id: "p1", kind: "production", ordinal: 1, line_item_ids: ["a", "b"] }),
      ],
      [a, b],
    );
    expect(groups.map((g) => g.unit.id)).toEqual(["u1", "u2"]);
    expect(groups[0].lines).toEqual([a]);
    expect(buyerGroupTitle(groups[0].unit, 2)).toBe("Group 1 of 2");
    expect(buyerGroupTitle(groups[0].unit, 1)).toBe("Items");
    expect(buyerGroups(undefined, [a])).toEqual([]);
    expect(awaitingProofHoldOpen(unit({ holds: [hold(null)] }))).toBe(true);
  });
});
