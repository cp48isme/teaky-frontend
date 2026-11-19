import type { Order } from "../../types/order";
import { formatNeededBy } from "../../lib/neededBy";

interface Props {
  order: Order;
  portalName: string;
  placedBy: string;
}

/** Order: who, where, PO (13 Oct 2026) — the split, review 19 Nov 2026. */
export default function OrderSummaryPanel({ order, portalName, placedBy }: Props) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="font-medium text-gray-900">Order</h3>
      <dl className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
        <dt className="text-gray-500">Portal</dt>
        <dd className="text-gray-900">{portalName || "—"}</dd>
        <dt className="text-gray-500">Placed by</dt>
        <dd className="text-gray-900">{placedBy || "—"}</dd>
        <dt className="text-gray-500">Customer PO</dt>
        <dd className="text-gray-900">{order.po_number || "—"}</dd>
        <dt className="text-gray-500">Needed by</dt>
        <dd className="text-gray-900">{formatNeededBy(order.needed_by) || "—"}</dd>
        <dt className="text-gray-500">Proofs go to</dt>
        <dd className="text-gray-900">
          {order.proof_email || "—"}
          {order.proof_cc_email && ` (cc ${order.proof_cc_email})`}
        </dd>
        <dt className="text-gray-500">Placed</dt>
        <dd className="text-gray-900">
          {new Date(order.placed_at).toLocaleString()}
        </dd>
      </dl>
    </div>
  );
}
