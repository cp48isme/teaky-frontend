import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OrderLinesPanel from "../OrderLinesPanel";
import { anOrder } from "./orderFixture";

describe("OrderLinesPanel", () => {
  it("lists each line with its SKU, quantity, proof state and total, and the order totals", () => {
    const order = anOrder({ tax_amount: 2.5, total: 77.5 });
    render(<OrderLinesPanel order={order} />);
    expect(screen.getByText("Parking Passes")).toBeInTheDocument();
    expect(screen.getByText(/SKU: PP-1000 \| Qty: 1000/)).toBeInTheDocument();
    expect(screen.getByText("Proof: pending")).toBeInTheDocument();
    expect(screen.getByText("$70.00", { selector: "p" })).toBeInTheDocument();
    expect(screen.getByText("Tax")).toBeInTheDocument();
    expect(screen.getByText("$77.50")).toBeInTheDocument();
  });

  it("says unpriced for a line without a total and counts the unpriced lines under the subtotal", () => {
    const order = anOrder({ unpriced_lines: 1 });
    order.line_items[0] = { ...order.line_items[0], line_total: null, unpriced: true };
    render(<OrderLinesPanel order={order} />);
    expect(screen.getByText("unpriced")).toBeInTheDocument();
    expect(screen.getByText("excludes 1 unpriced line")).toBeInTheDocument();
  });
});
