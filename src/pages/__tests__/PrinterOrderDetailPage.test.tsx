import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import PrinterOrderDetailPage from "../PrinterOrderDetailPage";
import { anOrder } from "../../components/orders/__tests__/orderFixture";

// The whole-page integration net (ruled 19 Nov 2026: kept beside the panel
// tests; this is the page's first — it had none). Every API mocked; the page
// renders each section from the one order.

vi.mock("../../api/orders", () => ({
  getPrinterOrder: vi.fn().mockResolvedValue(undefined),
  updateOrder: vi.fn(),
  updateOrderStatus: vi.fn(),
  cancelOrder: vi.fn(),
  updateProductionStatus: vi.fn(),
  downloadOrderInvoicePdf: vi.fn(),
  releaseOrder: vi.fn(),
  linkReleasedOrder: vi.fn(),
  confirmReleaseNotFound: vi.fn(),
  listShopTags: vi.fn().mockResolvedValue({ tags: ["Express"] }),
}));
vi.mock("../../api/proofs", () => ({
  listProofs: vi.fn().mockResolvedValue([
    { id: "pr1", order_id: "o1", line_item_id: "li1", version: 2, file_url: "https://x/p.pdf", thumbnail_url: null, status: "pending", specs: null, submitted_by: null, reviewed_by: null, reviewed_at: null, rejection_reason: null },
  ]),
  submitProof: vi.fn(),
  approveProof: vi.fn(),
  rejectProof: vi.fn(),
}));
vi.mock("../../api/mis", () => ({
  getOrderSyncStatus: vi.fn().mockResolvedValue({ dm_order_id: "85991", last_sync_at: "2026-11-19T11:00:00Z", last_sync_status: "success", error_message: null }),
  manualPushOrder: vi.fn(),
}));
vi.mock("../../api/products", () => ({ getProduct: vi.fn() }));
vi.mock("../../api/shipping", () => ({ getTrackingInfo: vi.fn().mockResolvedValue({ tracking_number: "1Z", carrier: "UPS", status: "In transit", estimated_delivery: null, events: [] }) }));
vi.mock("../../api/portals", () => ({ getPortal: vi.fn().mockResolvedValue({ id: "p1", name: "The Raphael Hotel" }) }));
vi.mock("../../api/team", () => ({ listMembers: vi.fn().mockResolvedValue([{ user_id: "u1", email: "frontdesk@hotel.example", display_name: "Night Manager" }]) }));
vi.mock("../../api/orderCosts", () => ({ getOrderCosts: vi.fn().mockResolvedValue({ order_id: "o1", order_number: "ORD-7001", status: "approved", outbound_freight_cost: null, processing_fee_actual: null, processing_fee_source: null, invoice_month: null, revenue_share_rate_snapshot: null, lines: [] }), updateLineItemCosts: vi.fn(), updateOrderCosts: vi.fn() }));
vi.mock("../../api/orderFiles", () => ({ listOrderFiles: vi.fn().mockResolvedValue([]), uploadOrderFile: vi.fn(), deleteOrderFile: vi.fn() }));
import { getPrinterOrder } from "../../api/orders";

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/orders/o1"]}>
      <Routes>
        <Route path="/orders/:orderId" element={<PrinterOrderDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("PrinterOrderDetailPage", () => {
  it("renders every section of the order from the one load", async () => {
    vi.mocked(getPrinterOrder).mockResolvedValue(
      anOrder({ tracking_number: "1Z", status: "in_production", production_status: "printing" }),
    );
    renderPage();
    expect(await screen.findByRole("heading", { name: "ORD-7001" })).toBeInTheDocument();
    // header pills and the production status card
    expect(screen.getByRole("heading", { name: "Production Status" })).toBeInTheDocument();
    // who, where, PO
    expect(await screen.findByText("The Raphael Hotel")).toBeInTheDocument();
    expect(screen.getByText("Night Manager (frontdesk@hotel.example)")).toBeInTheDocument();
    expect(screen.getByText("5118824933")).toBeInTheDocument();
    // lines and totals
    expect(screen.getByText("Parking Passes", { selector: "p" })).toBeInTheDocument(); // the line; the proofs select repeats the name
    expect(screen.getByText("$75.00")).toBeInTheDocument();
    // shipping and tracking
    expect(screen.getByText("325 Ward Pkwy")).toBeInTheDocument();
    expect(await screen.findByText("In transit")).toBeInTheDocument();
    // details: the RGI field, the tags, the notes
    expect(screen.getByPlaceholderText("not yet assigned")).toHaveValue("");
    expect(screen.getByDisplayValue("Reprint, no changes")).toBeInTheDocument();
    expect(screen.getByText("Express")).toBeInTheDocument();
    // DocketManager block with the number
    expect(await screen.findByText(/DocketManager #85991/)).toBeInTheDocument();
    // proofs
    expect(screen.getByRole("heading", { name: "Proofs" })).toBeInTheDocument();
    expect(screen.getByText("Version 2")).toBeInTheDocument();
    // status actions for in_production
    // "quality check" is both the next status and a production status: two buttons
    expect(screen.getAllByRole("button", { name: "quality check" })).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Cancel Order" })).toBeInTheDocument();
  });

  it("says when the order is not found", async () => {
    vi.mocked(getPrinterOrder).mockRejectedValue(new Error("404"));
    renderPage();
    expect(await screen.findByText("Order not found.")).toBeInTheDocument();
  });
});
