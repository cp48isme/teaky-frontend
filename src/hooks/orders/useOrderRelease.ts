import { useEffect, useState } from "react";
import {
  confirmReleaseNotFound,
  linkReleasedOrder,
  releaseOrder,
} from "../../api/orders";
import { getOrderSyncStatus, manualPushOrder } from "../../api/mis";
import { getProduct } from "../../api/products";
import { describeSync, type SyncDescription } from "../../lib/misSyncCopy";
import type { Order } from "../../types/order";
import type { OrderSyncStatus } from "../../types/mis";
import { useAction } from "../useAction";

interface Deps {
  order: Order | null;
  syncStatus: OrderSyncStatus | null;
  setOrder: (order: Order) => void;
  setSyncStatus: (status: OrderSyncStatus | null) => void;
  reload: () => Promise<void>;
  refreshSync: () => void;
}

/** The Docket side (the split, review 19 Nov 2026, item 12): hold-and-release
 * (ruling 2026-10-20) — release, record the number, not found — and the
 * manual push, with the price_needed read. */
export function useOrderRelease(orderId: string | undefined, deps: Deps) {
  const { order, syncStatus, setOrder, setSyncStatus, reload, refreshSync } =
    deps;
  const sync: SyncDescription = describeSync(syncStatus);
  const [linkNumber, setLinkNumber] = useState("");

  // A price_needed hold stands until every product on the order has a cost per
  // pack; the log entry alone cannot tell us that, so the products are read.
  const [priceHoldStands, setPriceHoldStands] = useState(false);
  useEffect(() => {
    let cancelled = false;
    if (!order || sync.reason !== "price_needed") {
      setPriceHoldStands(false);
      return;
    }
    const ids = Array.from(
      new Set(order.line_items.map((li) => li.product_id)),
    );
    Promise.all(ids.map((id) => getProduct(order.portal_id, id)))
      .then((products) => {
        if (!cancelled)
          setPriceHoldStands(products.some((p) => p.base_cost == null));
      })
      .catch(() => {
        if (!cancelled) setPriceHoldStands(true);
      });
    return () => {
      cancelled = true;
    };
  }, [order, sync.reason]);

  // The push resolves even when DocketManager refused the job; the sync log
  // says which, so a failed push is reported as one.
  const push = useAction(
    "Push to DocketManager",
    async (id: string) => {
      await manualPushOrder(id);
      const status = await getOrderSyncStatus(id);
      setSyncStatus(status);
      const described = describeSync(status);
      if (described.tone === "failed") throw new Error(described.headline);
      return described;
    },
    { success: (described) => described.headline },
  );
  const pushing = push.pending;
  const handleManualPush = () => {
    if (!orderId) return;
    void push.run(orderId);
  };

  // After any release action the order and the DocketManager block both change.
  const afterRelease = async (updated: Order) => {
    setOrder(updated);
    refreshSync();
  };

  const releaseAction = useAction("Release", (id: string) => releaseOrder(id), {
    success: "Order released to production",
  });
  const linkRelease = useAction(
    "DocketManager order number",
    (id: string, number: string) =>
      linkReleasedOrder(id, { dm_order_number: number }),
    { success: "DocketManager order number recorded" },
  );
  const releaseNotFound = useAction(
    "Release",
    (id: string) => confirmReleaseNotFound(id),
    {
      success:
        "Recorded: not in DocketManager. The order can be released again.",
    },
  );
  const releasing =
    releaseAction.pending || linkRelease.pending || releaseNotFound.pending;

  const handleRelease = async () => {
    if (!orderId || releasing) return;
    const updated = await releaseAction.run(orderId);
    if (updated) {
      await afterRelease(updated);
    } else {
      reload();
    }
  };

  const handleLinkRelease = async () => {
    if (!orderId || !linkNumber.trim() || releasing) return;
    const updated = await linkRelease.run(orderId, linkNumber.trim());
    if (!updated) return;
    await afterRelease(updated);
    setLinkNumber("");
  };

  const handleReleaseNotFound = async () => {
    if (!orderId || releasing) return;
    if (
      !confirm(
        "You checked DocketManager and the job is not there? The order can then be released again.",
      )
    )
      return;
    const updated = await releaseNotFound.run(orderId);
    if (updated) await afterRelease(updated);
  };

  return {
    sync,
    priceHoldStands,
    pushing,
    handleManualPush,
    afterRelease,
    releasing,
    linkNumber,
    setLinkNumber,
    handleRelease,
    handleLinkRelease,
    handleReleaseNotFound,
  };
}

export type OrderReleaseActions = ReturnType<typeof useOrderRelease>;
