import type { Order } from "../../types/order";
import type { OrderDetailsForm } from "../../hooks/orders/useOrderDetailsForm";
import OrderTagsSection from "../production/OrderTagsSection";

interface Props {
  order: Order;
  form: OrderDetailsForm;
}

/** The Details card (the design note's notes concern, the split, review
 * 19 Nov 2026, item 12): RGI order number, tracking number, tags, notes,
 * Save and the invoice download. */
export default function OrderDetailsPanel({ order, form }: Props) {
  const {
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
  } = form;
  return (
    <div className="rounded-lg border bg-white p-4 space-y-3">
      <h3 className="font-medium text-gray-900">Details</h3>
      <div>
        <label
          className="block text-xs font-medium text-gray-500"
          title="RGI's own order number for this job. Orders without one are listed under “Missing RGI order #”."
        >
          RGI order #
        </label>
        <input
          type="text"
          value={rgiOrderNumber}
          onChange={(e) => setRgiOrderNumber(e.target.value)}
          maxLength={100}
          placeholder="not yet assigned"
          className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500">
          Tracking Number
        </label>
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <OrderTagsSection tags={order.tags ?? []} onSave={handleSaveTags} />
      <div>
        <label className="block text-xs font-medium text-gray-500">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleSaveDetails}
          className="rounded bg-teak-dark px-3 py-1.5 text-xs font-medium text-white hover:bg-teak"
        >
          Save
        </button>
        <button
          onClick={handleDownloadInvoice}
          disabled={downloadingInvoice}
          className="rounded border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {downloadingInvoice ? "Downloading..." : "Download Invoice"}
        </button>
      </div>
    </div>
  );
}
