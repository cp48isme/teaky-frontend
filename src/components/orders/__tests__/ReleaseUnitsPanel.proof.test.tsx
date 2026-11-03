import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ReleaseUnitsPanel from "../ReleaseUnitsPanel";
import type { Order } from "../../../types/order";
import type { ReleaseUnit } from "../../../types/releaseUnit";

// Group B: the printer's unit card carries the group's proof summary, read
// from the lines it holds.

vi.mock("../../../api/releaseUnits", () => ({
  cancelHeldUnits: vi.fn(), clearUnitHold: vi.fn(), linkUnit: vi.fn(), releaseUnit: vi.fn(), unitNotFound: vi.fn(),
}));

const order = {
  id: "o1", order_number: "ORD-1",
  line_items: [
    { id: "a", product_name: "Breakfast Menu", quantity: 2, needs_proof: true, proof_status: "pending" },
    { id: "b", product_name: "Voucher", quantity: 3, needs_proof: true, proof_status: "approved" },
    { id: "c", product_name: "Parking Passes", quantity: 1000, needs_proof: false, proof_status: null },
  ],
} as unknown as Order;

const unit = {
  id: "u1", organization_id: "o", portal_id: "p", source_order_id: "o1", kind: "shipment", formation: "single", channel: "hotel_portal",
  ordinal: 1, partition_key: null, release_state: "held_for_proof", release_attempts: 0, released_at: null, released_by_id: null, frozen_at: null,
  reference: "ORD-1", references: [], subtotal: "0", freight: "0", tax: "0", total: "0", cancelled_at: null, cancel_reason: null,
  line_item_ids: ["a", "b", "c"], holds: [], created_at: "2026-11-03", updated_at: "2026-11-03",
} as ReleaseUnit;

describe("ReleaseUnitsPanel proof summary", () => {
  it("says how many proofs are approved and which are waiting", () => {
    render(<ReleaseUnitsPanel order={order} units={[unit]} onChanged={async () => {}} />);
    expect(screen.getByTestId("proof-summary")).toHaveTextContent("Proofs: 1 approved, 1 waiting (Breakfast Menu).");
  });
  it("shows nothing when no line needs a proof", () => {
    const plain = { ...order, line_items: [order.line_items[2]] } as Order;
    render(<ReleaseUnitsPanel order={plain} units={[{ ...unit, line_item_ids: ["c"] }]} onChanged={async () => {}} />);
    expect(screen.queryByTestId("proof-summary")).toBeNull();
  });
});
