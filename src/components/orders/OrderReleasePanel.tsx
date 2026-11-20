import type { Order } from "../../types/order";
import type { ReleaseDescription } from "../../lib/releaseCopy";
import type { OrderReleaseActions } from "../../hooks/orders/useOrderRelease";
import ReleaseUnitsPanel from "./ReleaseUnitsPanel";

interface Props {
  order: Order;
  release: ReleaseDescription | null;
  actions: OrderReleaseActions;
  reload: () => Promise<void>;
}

/** Release to production (the split, review 19 Nov 2026, item 12): the
 * release-unit cards (H v2) when the order has units, else the order-level
 * hold-and-release block (ruling 2026-10-20). */
export default function OrderReleasePanel({
  order,
  release,
  actions,
  reload,
}: Props) {
  const {
    afterRelease,
    releasing,
    linkNumber,
    setLinkNumber,
    handleRelease,
    handleLinkRelease,
    handleReleaseNotFound,
  } = actions;
  const releaseTone =
    release?.tone === "ok"
      ? "border-green-200 bg-green-50 text-green-900"
      : release?.tone === "ready"
        ? "border-teak bg-teak/10 text-teak-dark"
        : release?.tone === "human" || release?.tone === "retry"
          ? "border-red-200 bg-red-50 text-red-900"
          : "border-amber-200 bg-amber-50 text-amber-900";
  const hasUnits = !!(order.release_units && order.release_units.length > 0);
  return (
    <>
      {/* Release units (H v2, 2 Nov 2026): one card per group the printer
          places as one RGI order. The order-level block below stays only for
          orders that have no units. */}
      {hasUnits && (
        <ReleaseUnitsPanel
          order={order}
          units={order.release_units!}
          onChanged={async (updated) => {
            if (updated) {
              await afterRelease(updated);
            } else {
              await reload();
            }
          }}
        />
      )}
      {/* Hold-and-release (ruling 2026-10-20): a changed order reaches
          DocketManager only through this block. */}
      {release && !hasUnits && (
        <div className={`rounded-lg border p-4 space-y-3 ${releaseTone}`}>
          <h3 className="font-medium">Release to production</h3>
          <p className="text-sm">{release.headline}</p>
          {release.next && <p className="text-sm">{release.next}</p>}
          {release.canRelease && (
            <button
              onClick={handleRelease}
              disabled={releasing}
              className="rounded bg-teak-dark px-3 py-1.5 text-xs font-medium text-white hover:bg-teak disabled:opacity-50"
            >
              {releasing
                ? "Releasing…"
                : release.state === "retryable"
                  ? "Release again"
                  : "Release to production"}
            </button>
          )}
          {release.needsHuman && (
            <div className="flex flex-wrap items-end gap-2">
              <div>
                <label className="block text-xs font-medium">
                  DocketManager order number
                </label>
                <input
                  type="text"
                  value={linkNumber}
                  onChange={(e) => setLinkNumber(e.target.value)}
                  placeholder="e.g. 85954"
                  className="rounded border border-gray-300 px-2 py-1 text-sm"
                />
              </div>
              <button
                onClick={handleLinkRelease}
                disabled={releasing || !linkNumber.trim()}
                className="rounded bg-teak-dark px-3 py-1.5 text-xs font-medium text-white hover:bg-teak disabled:opacity-50"
              >
                It is there — record the number
              </button>
              <button
                onClick={handleReleaseNotFound}
                disabled={releasing}
                className="rounded border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                Not there — allow a new release
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
