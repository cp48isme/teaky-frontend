import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import OrderShippingPanel from "../OrderShippingPanel";
import { anOrder } from "./orderFixture";

describe("OrderShippingPanel", () => {
  it("shows the address with attention and the carrier's status when tracked", () => {
    render(
      <OrderShippingPanel
        order={anOrder()}
        trackingInfo={{ tracking_number: "1Z", carrier: "UPS", status: "In transit", estimated_delivery: null, events: [] }}
      />,
    );
    expect(screen.getByText("Front Desk")).toBeInTheDocument();
    expect(screen.getByText("Kansas City, MO 64112")).toBeInTheDocument();
    expect(screen.getByText("Attention: Night manager")).toBeInTheDocument();
    expect(screen.getByText("In transit")).toBeInTheDocument();
    expect(screen.getByText("Carrier: UPS")).toBeInTheDocument();
  });

  it("has no tracking block without tracking info", () => {
    render(<OrderShippingPanel order={anOrder()} trackingInfo={null} />);
    expect(screen.queryByText("Tracking")).not.toBeInTheDocument();
  });
});
