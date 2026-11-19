import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import OrderDetailsPanel from "../OrderDetailsPanel";
import { anOrder } from "./orderFixture";

vi.mock("../../production/OrderTagsSection", () => ({ default: ({ tags }: { tags: string[] }) => <div data-testid="tags">{tags.join(",")}</div> }));

function form(overrides = {}) {
  return {
    trackingNumber: "1Z",
    setTrackingNumber: vi.fn(),
    rgiOrderNumber: "",
    setRgiOrderNumber: vi.fn(),
    notes: "Reprint",
    setNotes: vi.fn(),
    handleSaveDetails: vi.fn(),
    handleSaveTags: vi.fn(),
    downloadingInvoice: false,
    handleDownloadInvoice: vi.fn(),
    ...overrides,
  };
}

describe("OrderDetailsPanel", () => {
  it("binds the three fields, shows the tags and saves or downloads on the buttons", async () => {
    const user = userEvent.setup();
    const f = form();
    render(<OrderDetailsPanel order={anOrder()} form={f} />);
    expect(screen.getByDisplayValue("1Z")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Reprint")).toBeInTheDocument();
    expect(screen.getByTestId("tags")).toHaveTextContent("Express");
    await user.type(screen.getByPlaceholderText("not yet assigned"), "9");
    expect(f.setRgiOrderNumber).toHaveBeenCalledWith("9");
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(f.handleSaveDetails).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Download Invoice" }));
    expect(f.handleDownloadInvoice).toHaveBeenCalled();
  });

  it("disables the invoice button while downloading", () => {
    render(<OrderDetailsPanel order={anOrder()} form={form({ downloadingInvoice: true })} />);
    expect(screen.getByRole("button", { name: "Downloading..." })).toBeDisabled();
  });
});
