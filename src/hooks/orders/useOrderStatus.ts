import { useState } from "react";
import {
  cancelOrder,
  updateOrderStatus,
  updateProductionStatus,
} from "../../api/orders";
import type { Order } from "../../types/order";
import { useAction } from "../useAction";

/** Status transitions, the production status and cancellation (the split,
 * review 19 Nov 2026, item 12). Every mutation reports through the status
 * region (30 Oct 2026): the server's reason on failure, what was saved on
 * success. */
export function useOrderStatus(
  orderId: string | undefined,
  setOrder: (order: Order) => void,
) {
  const [productionNotes, setProductionNotes] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const statusTransition = useAction(
    "Order status",
    (id: string, newStatus: string) =>
      updateOrderStatus(id, { status: newStatus }),
  );
  const handleStatusTransition = async (newStatus: string) => {
    if (!orderId) return;
    const updated = await statusTransition.run(orderId, newStatus);
    if (updated) setOrder(updated);
  };

  const productionUpdate = useAction(
    "Production status",
    (id: string, newStatus: string) =>
      updateProductionStatus(id, {
        production_status: newStatus,
        notes: productionNotes || undefined,
      }),
  );
  const updatingProduction = productionUpdate.pending;
  const handleProductionStatusUpdate = async (newStatus: string) => {
    if (!orderId) return;
    const updated = await productionUpdate.run(orderId, newStatus);
    if (!updated) return;
    setOrder(updated);
    setProductionNotes("");
  };

  const cancel = useAction(
    "Cancel order",
    (id: string, reason: string) => cancelOrder(id, { reason }),
    {
      success: "Order cancelled",
    },
  );
  const cancelling = cancel.pending;
  const handleCancel = async () => {
    if (!orderId || !cancelReason.trim()) return;
    const updated = await cancel.run(orderId, cancelReason);
    if (!updated) return;
    setOrder(updated);
    setShowCancelModal(false);
    setCancelReason("");
  };

  return {
    productionNotes,
    setProductionNotes,
    updatingProduction,
    handleStatusTransition,
    handleProductionStatusUpdate,
    showCancelModal,
    setShowCancelModal,
    cancelReason,
    setCancelReason,
    cancelling,
    handleCancel,
  };
}

export type OrderStatusActions = ReturnType<typeof useOrderStatus>;
