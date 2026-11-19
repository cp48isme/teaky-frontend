import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OrderSummaryPanel from "../OrderSummaryPanel";
import { anOrder } from "./orderFixture";

describe("OrderSummaryPanel", () => {
  it("shows the portal, who placed it, the PO and the proof address, with dashes for the unknown", () => {
    render(
      <OrderSummaryPanel order={anOrder({ proof_cc_email: "gm@hotel.example" })} portalName="The Raphael Hotel" placedBy="" />,
    );
    expect(screen.getByText("The Raphael Hotel")).toBeInTheDocument();
    expect(screen.getByText("5118824933")).toBeInTheDocument();
    expect(screen.getByText("proofs@hotel.example (cc gm@hotel.example)")).toBeInTheDocument();
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBeGreaterThanOrEqual(2); // placed by, needed by
  });
});
