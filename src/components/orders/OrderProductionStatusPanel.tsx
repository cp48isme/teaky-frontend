import type { Order } from "../../types/order";
import { PRODUCTION_STATUSES } from "../../types/order";

interface Props {
  order: Order;
  productionNotes: string;
  setProductionNotes: (value: string) => void;
  updating: boolean;
  onUpdate: (status: string) => void;
}

/** The production status card (the split, review 19 Nov 2026, item 12),
 * shown for approved and in-production orders. */
export default function OrderProductionStatusPanel({
  order,
  productionNotes,
  setProductionNotes,
  updating,
  onUpdate,
}: Props) {
  return (
    <div className="rounded-lg border bg-white p-4 space-y-3">
      <h3 className="font-medium text-gray-900">Production Status</h3>
      <div className="flex flex-wrap gap-1.5">
        {PRODUCTION_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => onUpdate(status)}
            disabled={updating || order.production_status === status}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50 ${
              order.production_status === status
                ? "bg-teak-dark text-white"
                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {status.replace(/_/g, " ")}
          </button>
        ))}
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-500">
            Production Notes
          </label>
          <input
            type="text"
            value={productionNotes}
            onChange={(e) => setProductionNotes(e.target.value)}
            placeholder="Optional notes about this status..."
            className="mt-1 block w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
          />
        </div>
      </div>
      {order.production_notes && (
        <p className="text-xs text-gray-500">
          Last note: {order.production_notes}
        </p>
      )}
    </div>
  );
}
