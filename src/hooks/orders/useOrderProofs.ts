import { useState } from "react";
import { approveProof, rejectProof, submitProof } from "../../api/proofs";
import { useAction } from "../useAction";

/** Proof submission, approval with a signature and rejection (the split,
 * review 19 Nov 2026, item 12); each re-reads the order and its proofs. */
export function useOrderProofs(
  orderId: string | undefined,
  reload: () => Promise<void>,
) {
  const [proofFileUrl, setProofFileUrl] = useState("");
  const [selectedLineItem, setSelectedLineItem] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [signingProofId, setSigningProofId] = useState<string | null>(null);

  const proofSubmit = useAction(
    "Proof",
    async (id: string, lineItemId: string, fileUrl: string) => {
      await submitProof(id, { line_item_id: lineItemId, file_url: fileUrl });
    },
    { success: "Proof submitted" },
  );
  const handleSubmitProof = async () => {
    if (!orderId || !selectedLineItem || !proofFileUrl) return;
    const result = await proofSubmit.run(
      orderId,
      selectedLineItem,
      proofFileUrl,
    );
    if (result === undefined) return;
    setProofFileUrl("");
    setSelectedLineItem("");
    await reload();
  };

  const proofApprove = useAction(
    "Proof approval",
    async (proofId: string, signatureData?: string) => {
      await approveProof(
        proofId,
        signatureData ? { signature_data: signatureData } : undefined,
      );
    },
    { success: "Proof approved" },
  );
  const handleApproveProof = async (
    proofId: string,
    signatureData?: string,
  ) => {
    const result = await proofApprove.run(proofId, signatureData);
    if (result === undefined) return;
    setSigningProofId(null);
    await reload();
  };

  const proofReject = useAction(
    "Proof rejection",
    async (proofId: string, reason: string) => {
      await rejectProof(proofId, { reason });
    },
    { success: "Proof rejected" },
  );
  const handleRejectProof = async (proofId: string) => {
    if (!rejectReason.trim()) return; // the Reject button says why it is disabled
    const result = await proofReject.run(proofId, rejectReason);
    if (result === undefined) return;
    setRejectReason("");
    await reload();
  };

  return {
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
  };
}

export type OrderProofActions = ReturnType<typeof useOrderProofs>;
