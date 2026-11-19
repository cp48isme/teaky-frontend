import type { Order } from "../../types/order";
import type { TrackingInfo } from "../../types/shipping";

interface Props {
  order: Order;
  trackingInfo: TrackingInfo | null;
}

/** Shipping address and, when there is a tracking number, the carrier's
 * status (the split, review 19 Nov 2026, item 12). */
export default function OrderShippingPanel({ order, trackingInfo }: Props) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <h3 className="font-medium text-gray-900">Shipping Address</h3>
      <div className="mt-2 text-sm text-gray-600 space-y-1">
        <p>{order.shipping_address.name}</p>
        <p>{order.shipping_address.line1}</p>
        {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
        <p>
          {order.shipping_address.city}, {order.shipping_address.state}{" "}
          {order.shipping_address.postal_code}
        </p>
        {order.shipping_address.attention && (
          <p>Attention: {order.shipping_address.attention}</p>
        )}
        {order.shipping_address.phone && (
          <p>Phone: {order.shipping_address.phone}</p>
        )}
      </div>

      {/* Tracking Info */}
      {trackingInfo && (
        <div className="mt-4 border-t pt-3">
          <h4 className="text-sm font-medium text-gray-900">Tracking</h4>
          <div className="mt-1 text-xs text-gray-600 space-y-1">
            <p>
              Status: <span className="font-medium">{trackingInfo.status}</span>
            </p>
            {trackingInfo.carrier && <p>Carrier: {trackingInfo.carrier}</p>}
            {trackingInfo.estimated_delivery && (
              <p>
                Est. Delivery:{" "}
                {new Date(trackingInfo.estimated_delivery).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
