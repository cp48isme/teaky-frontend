import type { OrderSyncStatus } from "../../types/mis";
import type { ReleaseDescription } from "../../lib/releaseCopy";
import type { SyncDescription } from "../../lib/misSyncCopy";

interface Props {
  syncStatus: OrderSyncStatus | null;
  sync: SyncDescription;
  release: ReleaseDescription | null;
  priceHoldStands: boolean;
  pushing: boolean;
  onPush: () => void;
}

/** The DocketManager block (plain language; hold-aware) — the other half of
 * the Docket side (the split, review 19 Nov 2026, item 12). */
export default function OrderDocketPanel({
  syncStatus,
  sync,
  release,
  priceHoldStands,
  pushing,
  onPush,
}: Props) {
  if (!syncStatus) return null;
  return (
    <div className="rounded-lg border bg-white p-4 space-y-3">
      <h3 className="font-medium text-gray-900">DocketManager</h3>
      <p
        className={`text-sm ${
          sync.tone === "ok"
            ? "text-green-800"
            : sync.tone === "hold"
              ? "text-amber-800"
              : sync.tone === "failed"
                ? "text-red-700"
                : "text-gray-700"
        }`}
      >
        {sync.headline}
      </p>
      {sync.next && <p className="text-sm text-gray-700">{sync.next}</p>}
      <p className="text-xs text-gray-500">
        {syncStatus.last_sync_at
          ? `Last attempt ${new Date(syncStatus.last_sync_at).toLocaleString()}`
          : "No attempt yet"}
        {syncStatus.dm_order_id && ` · DocketManager #${syncStatus.dm_order_id}`}
      </p>
      {release && release.state !== "released" ? (
        <p className="text-xs text-amber-800">
          This order reaches DocketManager only through “Release to production”
          above.
        </p>
      ) : priceHoldStands ? (
        <p className="text-xs text-amber-800">
          Push is unavailable until every product on this order has a cost per
          pack.
        </p>
      ) : (
        <button
          onClick={onPush}
          disabled={pushing}
          className="rounded bg-teak-dark px-3 py-1.5 text-xs font-medium text-white hover:bg-teak disabled:opacity-50"
        >
          {pushing ? "Pushing…" : "Push to DocketManager"}
        </button>
      )}
    </div>
  );
}
