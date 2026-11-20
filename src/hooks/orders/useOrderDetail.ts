import { useCallback, useEffect, useState } from "react";
import { getPrinterOrder } from "../../api/orders";
import { listProofs } from "../../api/proofs";
import { getOrderSyncStatus } from "../../api/mis";
import { getTrackingInfo } from "../../api/shipping";
import { getPortal } from "../../api/portals";
import { listMembers } from "../../api/team";
import type { Order } from "../../types/order";
import type { Proof } from "../../types/proof";
import type { OrderSyncStatus } from "../../types/mis";
import type { TrackingInfo } from "../../types/shipping";

/** The order and everything read beside it (the split, review 19 Nov 2026,
 * item 12): proofs, the DocketManager sync status, tracking, the portal's
 * name and who placed it. `reload` re-reads all of it; `setOrder` takes a
 * mutation's answer; `refreshSync` re-reads the DocketManager block alone
 * (after a release action the order and the block both change). */
export interface OrderDetail {
  order: Order | null;
  proofs: Proof[];
  loading: boolean;
  syncStatus: OrderSyncStatus | null;
  trackingInfo: TrackingInfo | null;
  portalName: string;
  placedBy: string;
  setOrder: (order: Order) => void;
  setSyncStatus: (status: OrderSyncStatus | null) => void;
  reload: () => Promise<void>;
  refreshSync: () => void;
  /** Bumped on every (re)load — the Details form follows the loaded order
   * exactly when the page did (each fetch), not on every mutation. */
  loadCount: number;
}

export function useOrderDetail(orderId: string | undefined): OrderDetail {
  const [order, setOrder] = useState<Order | null>(null);
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<OrderSyncStatus | null>(null);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  // Who and where (13 Oct 2026): the portal, the person who placed it, the PO.
  const [portalName, setPortalName] = useState("");
  const [placedBy, setPlacedBy] = useState("");
  const [loadCount, setLoadCount] = useState(0);

  const reload = useCallback(async () => {
    if (!orderId) return;
    try {
      const [o, p] = await Promise.all([
        getPrinterOrder(orderId),
        listProofs(orderId),
      ]);
      setOrder(o);
      setProofs(p);
      setLoadCount((n) => n + 1);
      getPortal(o.portal_id)
        .then((portal) => setPortalName(portal.name))
        .catch(() => {});
      listMembers()
        .then((members) => {
          const who = members.find(
            (m) => m.user_id === (o.placed_by_id ?? o.user_id),
          );
          setPlacedBy(
            who
              ? who.display_name
                ? `${who.display_name} (${who.email})`
                : who.email
              : "",
          );
        })
        .catch(() => {});
      // Fetch sync status (best-effort)
      getOrderSyncStatus(orderId)
        .then(setSyncStatus)
        .catch(() => {});
      // Fetch tracking info if tracking number exists
      if (o.tracking_number) {
        getTrackingInfo(o.tracking_number)
          .then(setTrackingInfo)
          .catch(() => {});
      }
    } catch {
      // handled by loading state
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const refreshSync = useCallback(() => {
    if (!orderId) return;
    getOrderSyncStatus(orderId)
      .then(setSyncStatus)
      .catch(() => {});
  }, [orderId]);

  return {
    order,
    proofs,
    loading,
    syncStatus,
    trackingInfo,
    portalName,
    placedBy,
    setOrder,
    setSyncStatus,
    reload,
    refreshSync,
    loadCount,
  };
}
