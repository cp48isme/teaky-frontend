import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listPrinterOrders } from "../api/orders";
import { listPortals } from "../api/portals";
import type { Order } from "../types/order";
import { describeRelease, isHeld } from "../lib/releaseCopy";
import { listHeldQueue } from "../api/releaseUnits";
import { formatAge } from "../lib/releaseUnitCopy";
import type { HeldQueueEntry } from "../types/releaseUnit";
import { RELEASE_LABELS } from "../lib/releaseCopy";
import Spinner from "../components/ui/Spinner";
import SearchBox from "../components/ui/SearchBox";
import { matchesSearch } from "../lib/search";

const STATUS_FILTERS = [
  { label: "All", value: "" },
  // Client-side: orders nobody has given an RGI order number yet (ruling 2026-10-20).
  { label: "Missing RGI order #", value: "missing_rgi" },
  // Client-side: orders held in Teaky (ruling 2026-10-20), whatever their status.
  { label: "Held for proof", value: "held" },
  { label: "Submitted", value: "submitted" },
  { label: "Pending Approval", value: "pending_approval" },
  { label: "Approved", value: "approved" },
  { label: "In Production", value: "in_production" },
  { label: "Quality Check", value: "quality_check" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

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

export default function PrinterOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  // Release units (H v2 §5.4): every group not released or cancelled, with an age.
  const [queue, setQueue] = useState<HeldQueueEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  // Search (Cause 6, 30 Oct 2026): the products grid's box and rule, not a
  // second one. Matches the Teaky order number, the RGI number and the
  // portal name, case-insensitively, on a partial string.
  const [searchQuery, setSearchQuery] = useState("");
  const [portalNames, setPortalNames] = useState<Record<string, string>>({});

  useEffect(() => {
    listPortals()
      .then((portals) =>
        setPortalNames(Object.fromEntries(portals.map((p) => [p.id, p.name]))),
      )
      .catch(() => {});
  }, []);

  const visibleOrders = orders.filter((o) =>
    matchesSearch(searchQuery, [
      o.order_number,
      o.rgi_order_number,
      portalNames[o.portal_id],
    ]),
  );

  useEffect(() => {
    // The queue renders only under the held filter, so a stale list is never
    // shown; fetch when the filter is chosen.
    if (statusFilter !== "held") return;
    listHeldQueue()
      .then(setQueue)
      .catch(() => setQueue([]));
  }, [statusFilter]);

  useEffect(() => {
    setLoading(true);
    const held = statusFilter === "held";
    const missingRgi = statusFilter === "missing_rgi";
    listPrinterOrders(
      held || missingRgi ? undefined : statusFilter || undefined,
    )
      .then((all) =>
        setOrders(
          held
            ? all.filter(isHeld)
            : missingRgi
              ? all.filter(
                  (o) => !o.rgi_order_number && o.status !== "cancelled",
                )
              : all,
        ),
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-3xl font-extrabold text-brand-dark lg:text-4xl">
          Orders
        </h1>
        <Link
          to="/orders/new"
          className="rounded-md bg-coral px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-coral/90"
        >
          New Order
        </Link>
      </div>

      <SearchBox
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by order #, RGI # or portal"
        aria-label="Search orders"
      />

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === f.value
                ? "bg-teak-dark text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-8 w-8 text-teak-dark" />
        </div>
      ) : visibleOrders.length === 0 ? (
        <p className="py-8 text-center text-gray-500">
          {orders.length === 0
            ? "No orders found."
            : `No orders match “${searchQuery.trim()}”.`}
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          {statusFilter === "held" && queue.length > 0 && (
            <div
              className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3"
              data-testid="held-queue"
            >
              <h2 className="text-sm font-medium">
                Groups waiting on the desk — oldest first, unknown outcomes on
                top
              </h2>
              <table className="mt-2 w-full text-xs">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-1 pr-2">Order</th>
                    <th className="py-1 pr-2">Group</th>
                    <th className="py-1 pr-2">State</th>
                    <th className="py-1 pr-2">Waiting</th>
                    <th className="py-1">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((e) => (
                    <tr key={e.unit_id} className="border-t border-amber-200">
                      <td className="py-1 pr-2">
                        {e.source_order_id ? (
                          <Link
                            to={`/orders/${e.source_order_id}`}
                            className="text-teak-dark underline"
                          >
                            {e.order_number ?? e.purchase_order_reference}
                          </Link>
                        ) : (
                          e.purchase_order_reference
                        )}
                      </td>
                      <td className="py-1 pr-2">
                        {e.purchase_order_reference}
                      </td>
                      <td className="py-1 pr-2">
                        {e.release_state
                          ? RELEASE_LABELS[e.release_state]
                          : "—"}
                      </td>
                      <td className="py-1 pr-2">{formatAge(e.age_seconds)}</td>
                      <td className="py-1">
                        {e.open_holds.join("; ") || e.reason || ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Order
                </th>
                <th
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500"
                  title="RGI's own order number for the job"
                >
                  RGI #
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Portal
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Items
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Total
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {visibleOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      to={`/orders/${order.id}`}
                      className="font-medium text-teak-dark hover:text-teak"
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {order.rgi_order_number ? (
                      order.rgi_order_number
                    ) : (
                      <span className="font-sans text-amber-700">none</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {portalNames[order.portal_id] ?? ""}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.placed_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {order.line_items.length}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        STATUS_COLORS[order.status] ||
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status.replace(/_/g, " ")}
                    </span>
                    {isHeld(order) && (
                      <span className="ml-1 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                        {describeRelease(order)?.label}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
