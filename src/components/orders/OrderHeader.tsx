import type { Order } from "../../types/order";
import type { ReleaseDescription } from "../../lib/releaseCopy";
import Breadcrumbs from "../ui/Breadcrumbs";
import type { OrderStatusActions } from "../../hooks/orders/useOrderStatus";

const STATUS_COLORS: Record<string, string> = {
  submitted: "bg-blue-100 text-blue-800",
  pending_approval: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  in_production: "bg-purple-100 text-purple-800",
  quality_check: "bg-orange-100 text-orange-800",
  shipped: "bg-teal-100 text-teal-800",
  delivered: "bg-teal-100 text-teal-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const PRODUCTION_STATUS_COLORS: Record<string, string> = {
  received: "bg-blue-50 text-blue-700",
  in_prepress: "bg-yellow-50 text-yellow-700",
  printing: "bg-purple-50 text-purple-700",
  finishing: "bg-orange-50 text-orange-700",
  quality_check: "bg-cyan-50 text-cyan-700",
  ready_to_ship: "bg-green-50 text-green-700",
  shipped: "bg-teak/10 text-teak-dark",
  picked_up: "bg-teal-50 text-teal-700",
};

const VALID_TRANSITIONS: Record<string, string[]> = {
  submitted: ["pending_approval", "approved"],
  pending_approval: ["approved"],
  approved: ["in_production"],
  in_production: ["quality_check", "shipped"],
  quality_check: ["shipped"],
  shipped: ["delivered"],
  delivered: ["completed"],
};

const CANCELLABLE = new Set([
  "submitted",
  "pending_approval",
  "approved",
  "in_production",
]);

interface Props {
  order: Order;
  release: ReleaseDescription | null;
  status: OrderStatusActions;
}

/** The top of the order page (the split, review 19 Nov 2026, item 12):
 * breadcrumbs, the number, the status pills, the placed-by and cancellation
 * notes, the status actions and the cancel modal. */
export default function OrderHeader({ order, release }: Omit<Props, "status">) {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Orders", to: "/orders" },
          { label: order.order_number },
        ]}
      />

      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-brand-dark">
          {order.order_number}
        </h2>
        <div className="flex items-center gap-2">
          {order.production_status && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                PRODUCTION_STATUS_COLORS[order.production_status] ||
                "bg-gray-100 text-gray-700"
              }`}
            >
              {order.production_status.replace(/_/g, " ")}
            </span>
          )}
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              STATUS_COLORS[order.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {order.status.replace(/_/g, " ")}
          </span>
          {release && release.state !== "released" && (
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
              {release.label}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

/** The notes under the release block and the status actions: kept apart from
 * the title so the release panel sits between them, as on the page. */
export function OrderStatusActions({ order, status }: Omit<Props, "release">) {
  const nextStatuses = VALID_TRANSITIONS[order.status] || [];
  const {
    handleStatusTransition,
    showCancelModal,
    setShowCancelModal,
    cancelReason,
    setCancelReason,
    cancelling,
    handleCancel,
  } = status;
  return (
    <>
      {/* Placed By badge */}
      {order.placed_by_id && (
        <div className="rounded-md bg-amber-50 border border-amber-200 px-3 py-2 text-sm text-amber-800">
          Staff-assisted order (placed on behalf of customer)
        </div>
      )}

      {/* Cancellation info */}
      {order.status === "cancelled" && order.cancellation_reason && (
        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-800">
          <strong>Cancelled:</strong> {order.cancellation_reason}
          {order.cancelled_at && (
            <span className="ml-2 text-xs text-red-600">
              ({new Date(order.cancelled_at).toLocaleString()})
            </span>
          )}
        </div>
      )}

      {/* Status Actions */}
      <div className="flex flex-wrap gap-2">
        {nextStatuses.map((s) => (
          <button
            key={s}
            onClick={() => handleStatusTransition(s)}
            className="rounded-md bg-teak-dark px-3 py-1.5 text-xs font-medium text-white hover:bg-teak"
          >
            {s.replace(/_/g, " ")}
          </button>
        ))}
        {CANCELLABLE.has(order.status) && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            Cancel Order
          </button>
        )}
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">
              Cancel Order
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              This action cannot be undone. Please provide a reason.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={3}
              placeholder="Reason for cancellation..."
              className="mt-3 w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                }}
                className="rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100"
              >
                Go Back
              </button>
              <button
                onClick={handleCancel}
                disabled={!cancelReason.trim() || cancelling}
                className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
