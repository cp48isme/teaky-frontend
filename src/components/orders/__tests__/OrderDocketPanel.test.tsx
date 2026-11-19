import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import OrderDocketPanel from "../OrderDocketPanel";

const status = { dm_order_id: "85991", last_sync_at: "2026-11-19T11:00:00Z", last_sync_status: "success", error_message: null };
const sync = { tone: "ok", headline: "In DocketManager as 85991", next: null, reason: null } as never;

describe("OrderDocketPanel", () => {
  it("renders nothing without a sync status", () => {
    const { container } = render(
      <OrderDocketPanel syncStatus={null} sync={sync} release={null} priceHoldStands={false} pushing={false} onPush={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("offers the push when released, and explains instead when a hold or a release stands", async () => {
    const user = userEvent.setup();
    const onPush = vi.fn();
    const { rerender } = render(
      <OrderDocketPanel syncStatus={status} sync={sync} release={null} priceHoldStands={false} pushing={false} onPush={onPush} />,
    );
    expect(screen.getByText("In DocketManager as 85991")).toBeInTheDocument();
    expect(screen.getByText(/DocketManager #85991/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Push to DocketManager" }));
    expect(onPush).toHaveBeenCalled();
    rerender(
      <OrderDocketPanel syncStatus={status} sync={sync} release={{ state: "held_for_proof" } as never} priceHoldStands={false} pushing={false} onPush={onPush} />,
    );
    expect(screen.getByText(/only through “Release to production” above/)).toBeInTheDocument();
    rerender(
      <OrderDocketPanel syncStatus={status} sync={sync} release={null} priceHoldStands pushing={false} onPush={onPush} />,
    );
    expect(screen.getByText(/until every product on this order has a cost/)).toBeInTheDocument();
  });
});
