import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import OrderProductionStatusPanel from "../OrderProductionStatusPanel";
import { anOrder } from "./orderFixture";

describe("OrderProductionStatusPanel", () => {
  it("disables the current status, updates to another and shows the last note", async () => {
    const user = userEvent.setup();
    const onUpdate = vi.fn();
    const setNotes = vi.fn();
    render(
      <OrderProductionStatusPanel
        order={anOrder({ production_status: "printing", production_notes: "Plates made" })}
        productionNotes=""
        setProductionNotes={setNotes}
        updating={false}
        onUpdate={onUpdate}
      />,
    );
    expect(screen.getByRole("button", { name: "printing" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "finishing" }));
    expect(onUpdate).toHaveBeenCalledWith("finishing");
    await user.type(screen.getByPlaceholderText("Optional notes about this status..."), "x");
    expect(setNotes).toHaveBeenCalledWith("x");
    expect(screen.getByText("Last note: Plates made")).toBeInTheDocument();
  });
});
