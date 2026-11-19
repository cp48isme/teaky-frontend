import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import OrderHeader, { OrderStatusActions } from "../OrderHeader";
import { anOrder } from "./orderFixture";

function statusActions(overrides = {}) {
  return {
    productionNotes: "",
    setProductionNotes: vi.fn(),
    updatingProduction: false,
    handleStatusTransition: vi.fn(),
    handleProductionStatusUpdate: vi.fn(),
    showCancelModal: false,
    setShowCancelModal: vi.fn(),
    cancelReason: "",
    setCancelReason: vi.fn(),
    cancelling: false,
    handleCancel: vi.fn(),
    ...overrides,
  };
}

describe("OrderHeader", () => {
  it("shows the number, the status pills and the release label", () => {
    render(
      <MemoryRouter>
        <OrderHeader
          order={anOrder({ status: "in_production", production_status: "printing" })}
          release={{ state: "held_for_proof", label: "Held for proof" } as never}
        />
      </MemoryRouter>,
    );
    expect(screen.getByRole("heading", { name: "ORD-7001" })).toBeInTheDocument();
    expect(screen.getByText("in production")).toBeInTheDocument();
    expect(screen.getByText("printing")).toBeInTheDocument();
    expect(screen.getByText("Held for proof")).toBeInTheDocument();
  });
});

describe("OrderStatusActions", () => {
  it("offers the next statuses and opens the cancel modal", async () => {
    const user = userEvent.setup();
    const actions = statusActions();
    render(<OrderStatusActions order={anOrder({ status: "approved" })} status={actions} />);
    await user.click(screen.getByRole("button", { name: "in production" }));
    expect(actions.handleStatusTransition).toHaveBeenCalledWith("in_production");
    await user.click(screen.getByRole("button", { name: "Cancel Order" }));
    expect(actions.setShowCancelModal).toHaveBeenCalledWith(true);
  });

  it("shows the cancellation and the staff-assisted notes, and confirms a cancel with a reason", async () => {
    const user = userEvent.setup();
    const actions = statusActions({ showCancelModal: true, cancelReason: "Duplicate" });
    render(
      <OrderStatusActions
        order={anOrder({ status: "cancelled", cancellation_reason: "Duplicate", placed_by_id: "staff-1" })}
        status={actions}
      />,
    );
    expect(screen.getByText("Staff-assisted order (placed on behalf of customer)")).toBeInTheDocument();
    expect(screen.getByText("Duplicate", { selector: "div" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Confirm Cancel" }));
    expect(actions.handleCancel).toHaveBeenCalled();
  });
});
