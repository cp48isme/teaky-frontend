import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import OrderProofsPanel from "../OrderProofsPanel";
import { anOrder } from "./orderFixture";

vi.mock("../../proofs/SignatureCapture", () => ({ default: ({ onSubmit }: { onSubmit: (s: string) => void }) => <button onClick={() => onSubmit("sig")}>Sign</button> }));

const proof = { id: "pr1", order_id: "o1", line_item_id: "li1", version: 2, file_url: "https://x/p.pdf", thumbnail_url: null, status: "pending", specs: null, submitted_by: null, reviewed_by: null, reviewed_at: null, rejection_reason: null };

function actions(overrides = {}) {
  return {
    proofFileUrl: "",
    setProofFileUrl: vi.fn(),
    selectedLineItem: "",
    setSelectedLineItem: vi.fn(),
    rejectReason: "",
    setRejectReason: vi.fn(),
    signingProofId: null as string | null,
    setSigningProofId: vi.fn(),
    handleSubmitProof: vi.fn(),
    handleApproveProof: vi.fn(),
    handleRejectProof: vi.fn(),
    ...overrides,
  };
}

describe("OrderProofsPanel", () => {
  it("renders nothing when no line needs a proof", () => {
    const order = anOrder();
    order.line_items[0] = { ...order.line_items[0], needs_proof: false };
    const { container } = render(<OrderProofsPanel order={order} proofs={[]} actions={actions()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("submits only with a line and a URL, rejects only with a reason, and approves through the signature", async () => {
    const user = userEvent.setup();
    const a = actions({ selectedLineItem: "li1", proofFileUrl: "https://x/new.pdf", rejectReason: "Wrong logo", signingProofId: "pr1" });
    render(<OrderProofsPanel order={anOrder()} proofs={[proof as never]} actions={a} />);
    await user.click(screen.getByRole("button", { name: "Submit Proof" }));
    expect(a.handleSubmitProof).toHaveBeenCalled();
    expect(screen.getByText("Version 2")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Reject" }));
    expect(a.handleRejectProof).toHaveBeenCalledWith("pr1");
    await user.click(screen.getByRole("button", { name: "Sign" }));
    expect(a.handleApproveProof).toHaveBeenCalledWith("pr1", "sig");
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument(); // signing is open
  });

  it("keeps Submit disabled without a line and URL and says why Reject is disabled", () => {
    render(<OrderProofsPanel order={anOrder()} proofs={[proof as never]} actions={actions()} />);
    expect(screen.getByRole("button", { name: "Submit Proof" })).toBeDisabled();
    expect(screen.getByText("Enter a reason to reject")).toBeInTheDocument();
  });
});
