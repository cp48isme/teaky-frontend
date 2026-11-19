import { useParams } from "react-router-dom";
import { describeRelease } from "../lib/releaseCopy";
import Spinner from "../components/ui/Spinner";
import OrderFilesSection from "../components/orders/OrderFilesSection";
import OrderCostsPanel from "../components/orders/OrderCostsPanel";
import OrderHeader, { OrderStatusActions } from "../components/orders/OrderHeader";
import OrderReleasePanel from "../components/orders/OrderReleasePanel";
import OrderDocketPanel from "../components/orders/OrderDocketPanel";
import OrderProductionStatusPanel from "../components/orders/OrderProductionStatusPanel";
import OrderSummaryPanel from "../components/orders/OrderSummaryPanel";
import OrderLinesPanel from "../components/orders/OrderLinesPanel";
import OrderShippingPanel from "../components/orders/OrderShippingPanel";
import OrderDetailsPanel from "../components/orders/OrderDetailsPanel";
import OrderProofsPanel from "../components/orders/OrderProofsPanel";
import { useOrderDetail } from "../hooks/orders/useOrderDetail";
import { useOrderStatus } from "../hooks/orders/useOrderStatus";
import { useOrderRelease } from "../hooks/orders/useOrderRelease";
import { useOrderDetailsForm } from "../hooks/orders/useOrderDetailsForm";
import { useOrderProofs } from "../hooks/orders/useOrderProofs";

/** The printer's order page (the split, review 19 Nov 2026, item 12): the
 * route param, five hooks that own the state and the calls, and the panels
 * in the order they always had. No state lives here. */
export default function PrinterOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const detail = useOrderDetail(orderId);
  const {
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
  } = detail;
  const status = useOrderStatus(orderId, setOrder);
  const releaseActions = useOrderRelease(orderId, {
    order,
    syncStatus,
    setOrder,
    setSyncStatus,
    reload,
    refreshSync,
  });
  const form = useOrderDetailsForm(orderId, order, loadCount, setOrder);
  const proofActions = useOrderProofs(orderId, reload);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-teak-dark" />
      </div>
    );
  }

  if (!order) {
    return <p className="py-8 text-center text-gray-500">Order not found.</p>;
  }

  const showProductionStatus = ["approved", "in_production"].includes(
    order.status,
  );
  const release = describeRelease(order, releaseActions.sync);

  return (
    <div className="space-y-6">
      <OrderHeader order={order} release={release} />
      <OrderReleasePanel
        order={order}
        release={release}
        actions={releaseActions}
        reload={reload}
      />
      <OrderStatusActions order={order} status={status} />

      {/* Costs and gross profit (plan §5.3): printer-side only */}
      <div className="mt-6">
        <OrderCostsPanel orderId={order.id} subtotal={Number(order.subtotal)} />
      </div>

      {showProductionStatus && (
        <OrderProductionStatusPanel
          order={order}
          productionNotes={status.productionNotes}
          setProductionNotes={status.setProductionNotes}
          updating={status.updatingProduction}
          onUpdate={status.handleProductionStatusUpdate}
        />
      )}

      <OrderSummaryPanel
        order={order}
        portalName={portalName}
        placedBy={placedBy}
      />

      <OrderLinesPanel order={order} />

      {/* Shipping, Tracking & Invoice */}
      <div className="grid gap-6 lg:grid-cols-2">
        <OrderShippingPanel order={order} trackingInfo={trackingInfo} />
        <OrderDetailsPanel order={order} form={form} />
      </div>

      {/* Order Files (one section; the inline duplicate was removed 2026-10-15) */}
      <OrderFilesSection orderId={orderId!} />

      <OrderDocketPanel
        syncStatus={syncStatus}
        sync={releaseActions.sync}
        release={release}
        priceHoldStands={releaseActions.priceHoldStands}
        pushing={releaseActions.pushing}
        onPush={releaseActions.handleManualPush}
      />

      <OrderProofsPanel order={order} proofs={proofs} actions={proofActions} />
    </div>
  );
}
