import type { Order } from "../../types/order";
import AuthedDownloadLink from '../ui/AuthedDownloadLink';
import type { Proof } from "../../types/proof";
import type { OrderProofActions } from "../../hooks/orders/useOrderProofs";
import SignatureCapture from "../proofs/SignatureCapture";
import ActionButton from "../ui/ActionButton";

interface Props {
  order: Order;
  proofs: Proof[];
  actions: OrderProofActions;
}

/** Proofs: submit one for a line, approve with a signature, reject with a
 * reason (the split, review 19 Nov 2026, item 12). Rendered only when a line
 * needs a proof. */
export default function OrderProofsPanel({ order, proofs, actions }: Props) {
  const {
    proofFileUrl,
    setProofFileUrl,
    selectedLineItem,
    setSelectedLineItem,
    rejectReason,
    setRejectReason,
    signingProofId,
    setSigningProofId,
    handleSubmitProof,
    handleApproveProof,
    handleRejectProof,
  } = actions;
  if (!order.line_items.some((i) => i.needs_proof)) return null;
  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="font-medium text-gray-900">Proofs</h3>

      {/* Submit Proof */}
      <div className="mt-3 flex flex-wrap gap-2 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500">
            Line Item
          </label>
          <select
            value={selectedLineItem}
            onChange={(e) => setSelectedLineItem(e.target.value)}
            className="mt-1 rounded border border-gray-300 px-2 py-1.5 text-sm"
          >
            <option value="">Select...</option>
            {order.line_items
              .filter((i) => i.needs_proof)
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.product_name} {item.size && `(${item.size})`}
                </option>
              ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-500">
            Proof File URL
          </label>
          <input
            type="url"
            value={proofFileUrl}
            onChange={(e) => setProofFileUrl(e.target.value)}
            placeholder="https://..."
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
          />
        </div>
        <button
          onClick={handleSubmitProof}
          disabled={!selectedLineItem || !proofFileUrl}
          className="rounded bg-teak-dark px-3 py-1.5 text-xs font-medium text-white hover:bg-teak disabled:opacity-50"
        >
          Submit Proof
        </button>
      </div>

      {/* Existing Proofs */}
      {proofs.length > 0 && (
        <div className="mt-4 space-y-3">
          {proofs.map((proof) => (
            <div key={proof.id} className="rounded border p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Version {proof.version}
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                        proof.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : proof.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {proof.status}
                    </span>
                  </p>
                  {proof.file_url && (
                    <AuthedDownloadLink
                      href={proof.file_url}
                      className="text-xs text-teak-dark hover:underline"
                    >
                      View File
                    </AuthedDownloadLink>
                  )}
                  {proof.rejection_reason && (
                    <p className="mt-1 text-xs text-red-600">
                      Reason: {proof.rejection_reason}
                    </p>
                  )}
                </div>
                {proof.status === "pending" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setSigningProofId(
                          signingProofId === proof.id ? null : proof.id,
                        )
                      }
                      className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700"
                    >
                      {signingProofId === proof.id
                        ? "Cancel"
                        : "Approve with Signature"}
                    </button>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Reason..."
                        className="w-32 rounded border px-2 py-1 text-xs"
                      />
                      <ActionButton
                        onClick={() => handleRejectProof(proof.id)}
                        reason={
                          rejectReason.trim() ? null : "Enter a reason to reject"
                        }
                        reasonClassName="self-center text-xs text-gray-500"
                        className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </ActionButton>
                    </div>
                  </div>
                )}
              </div>
              {/* Signature Capture for Approval */}
              {proof.status === "pending" && signingProofId === proof.id && (
                <div className="mt-3 border-t pt-3">
                  <SignatureCapture
                    onSubmit={(signatureData) =>
                      handleApproveProof(proof.id, signatureData)
                    }
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
