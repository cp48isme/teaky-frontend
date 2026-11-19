import { useEffect, useState } from "react";
import { downloadOrderInvoicePdf, updateOrder } from "../../api/orders";
import type { Order } from "../../types/order";
import { useAction } from "../useAction";

/** The Details card's form (the design note's "notes" concern, the split,
 * review 19 Nov 2026, item 12): tracking number, RGI order number, notes,
 * tags, Save and the invoice download. The fields follow the order each time
 * it is (re)loaded, as the page did. */
export function useOrderDetailsForm(
  orderId: string | undefined,
  order: Order | null,
  loadCount: number,
  setOrder: (order: Order) => void,
) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [rgiOrderNumber, setRgiOrderNumber] = useState("");
  const [notes, setNotes] = useState("");

  // What the page set on every fetch: the fields from the loaded order.
  useEffect(() => {
    if (!order) return;
    setTrackingNumber(order.tracking_number || "");
    setRgiOrderNumber(order.rgi_order_number || "");
    setNotes(order.notes || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadCount]);

  // Every mutation on this page reports through the status region (30 Oct
  // 2026): the server's reason on failure, what was saved on success. The
  // 29 Oct pass found the RGI order number Save answering a 200 with nothing
  // on screen; it now says "Order details saved".
  const saveDetails = useAction("Order details", (id: string) =>
    updateOrder(id, {
      tracking_number: trackingNumber || undefined,
      rgi_order_number: rgiOrderNumber.trim() || null,
      notes: notes || undefined,
    }),
  );
  const handleSaveDetails = async () => {
    if (!orderId) return;
    const updated = await saveDetails.run(orderId);
    if (updated) setOrder(updated);
  };

  // Tags (t08, 19 Nov 2026): saved on every change, the whole list; the
  // server audits the change.
  const saveTags = useAction("Order tags", (id: string, tags: string[]) =>
    updateOrder(id, { tags }),
  );
  const handleSaveTags = async (tags: string[]) => {
    if (!orderId) return undefined;
    const updated = await saveTags.run(orderId, tags);
    if (updated) setOrder(updated);
    return updated?.tags;
  };

  const downloadInvoice = useAction(
    "Invoice download",
    async (id: string) => {
      const blob = await downloadOrderInvoicePdf(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${order?.order_number || id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    },
    { success: false }, // the browser's download is the confirmation
  );
  const downloadingInvoice = downloadInvoice.pending;
  const handleDownloadInvoice = () => {
    if (!orderId) return;
    void downloadInvoice.run(orderId);
  };

  return {
    trackingNumber,
    setTrackingNumber,
    rgiOrderNumber,
    setRgiOrderNumber,
    notes,
    setNotes,
    handleSaveDetails,
    handleSaveTags,
    downloadingInvoice,
    handleDownloadInvoice,
  };
}

export type OrderDetailsForm = ReturnType<typeof useOrderDetailsForm>;
