import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import OrderReleasePanel from "../OrderReleasePanel";
import { anOrder } from "./orderFixture";

vi.mock("../ReleaseUnitsPanel", () => ({ default: () => <div data-testid="release-units" /> }));

function actions(overrides = {}) {
  return {
    sync: { tone: "none", headline: "", next: null, reason: null } as never,
    priceHoldStands: false,
    pushing: false,
    handleManualPush: vi.fn(),
    afterRelease: vi.fn(),
    releasing: false,
    linkNumber: "",
    setLinkNumber: vi.fn(),
    handleRelease: vi.fn(),
    handleLinkRelease: vi.fn(),
    handleReleaseNotFound: vi.fn(),
    ...overrides,
  };
}

describe("OrderReleasePanel", () => {
  it("renders the release-unit cards when the order has units, not the order-level block", () => {
    render(
      <OrderReleasePanel
        order={anOrder({ release_units: [{ id: "ru1" } as never] })}
        release={{ headline: "Ready", canRelease: true, state: "ready", tone: "ready" } as never}
        actions={actions()}
        reload={vi.fn()}
      />,
    );
    expect(screen.getByTestId("release-units")).toBeInTheDocument();
    expect(screen.queryByText("Release to production")).not.toBeInTheDocument();
  });

  it("releases an order without units and records a number when a person must decide", async () => {
    const user = userEvent.setup();
    const a = actions({ linkNumber: "85954" });
    render(
      <OrderReleasePanel
        order={anOrder()}
        release={{ headline: "Needs a person", next: "Check DocketManager", canRelease: true, needsHuman: true, state: "needs_human", tone: "human" } as never}
        actions={a}
        reload={vi.fn()}
      />,
    );
    expect(screen.getByText("Needs a person")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Release to production" }));
    expect(a.handleRelease).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "It is there — record the number" }));
    expect(a.handleLinkRelease).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Not there — allow a new release" }));
    expect(a.handleReleaseNotFound).toHaveBeenCalled();
  });
});
