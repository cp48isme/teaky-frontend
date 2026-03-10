import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMyOrder } from '../../api/orders';
import { getTrackingInfo } from '../../api/shipping';
import { useCart } from '../../contexts/CartContext';
import type { Order } from '../../types/order';
import type { TrackingInfo } from '../../types/shipping';
import Spinner from '../../components/ui/Spinner';

const STATUS_STEPS = [
  'submitted',
  'pending_approval',
  'approved',
  'in_production',
  'shipped',
  'delivered',
  'completed',
];

const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-800',
  pending_approval: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  in_production: 'bg-purple-100 text-purple-800',
  shipped: 'bg-teal-100 text-teal-800',
  delivered: 'bg-teal-100 text-teal-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

const REORDERABLE = new Set(['completed', 'delivered']);

export default function OrderDetailPage() {
  const { slug, orderId } = useParams<{ slug: string; orderId: string }>();
  const { addItem } = useCart();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);
  const [reordered, setReordered] = useState(false);
  const [trackingData, setTrackingData] = useState<TrackingInfo | null>(null);

  useEffect(() => {
    if (!slug || !orderId) return;
    getMyOrder(slug, orderId)
      .then((o) => {
        setOrder(o);
        if (o.tracking_number) {
          getTrackingInfo(o.tracking_number).then(setTrackingData).catch(() => {});
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-teak-dark" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <p className="text-gray-500">Order not found.</p>
      </div>
    );
  }

  const currentStepIndex = order.status === 'cancelled'
    ? -1
    : STATUS_STEPS.indexOf(order.status);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <Link to={`/p/${slug}/orders`} className="text-sm text-teak-dark hover:text-teak">
        &larr; Back to orders
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{order.order_number}</h1>
        <div className="flex items-center gap-2">
          {order.production_status && (
            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
              {order.production_status.replace(/_/g, ' ')}
            </span>
          )}
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {order.status.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Reorder Button */}
      {REORDERABLE.has(order.status) && (
        <div className="mt-4">
          {reordered ? (
            <div className="flex items-center gap-3 rounded-md border border-green-200 bg-green-50 px-4 py-3">
              <span className="text-sm text-green-700">Items added to your cart!</span>
              <Link
                to={`/p/${slug}/cart`}
                className="text-sm font-medium text-teak-dark hover:text-teak"
              >
                View Cart
              </Link>
            </div>
          ) : (
            <button
              onClick={async () => {
                if (!order) return;
                setReordering(true);
                try {
                  for (const item of order.line_items) {
                    await addItem({
                      product_id: item.product_id,
                      quantity: item.quantity,
                      size: item.size || undefined,
                      color: item.color || undefined,
                      unit_price: Number(item.unit_price),
                    });
                  }
                  setReordered(true);
                } catch {
                  alert('Failed to add items to cart');
                } finally {
                  setReordering(false);
                }
              }}
              disabled={reordering}
              className="rounded-md bg-teak-dark px-4 py-2 text-sm font-medium text-white hover:bg-teak disabled:opacity-50"
            >
              {reordering ? 'Adding to Cart...' : 'Reorder'}
            </button>
          )}
        </div>
      )}

      {/* Status Timeline */}
      {order.status !== 'cancelled' && (
        <div className="mt-6 flex gap-1">
          {STATUS_STEPS.map((step, i) => (
            <div
              key={step}
              className={`h-2 flex-1 rounded-full ${
                i <= currentStepIndex ? 'bg-teak-dark' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      )}

      {/* Line Items */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900">Items</h2>
        <div className="mt-3 space-y-3">
          {order.line_items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-lg border bg-white p-4">
              <div>
                <p className="font-medium text-gray-900">{item.product_name}</p>
                <div className="mt-1 flex gap-3 text-xs text-gray-500">
                  <span>Qty: {item.quantity}</span>
                  {item.size && <span>Size: {item.size}</span>}
                  {item.color && <span>Color: {item.color}</span>}
                  {item.needs_proof && (
                    <span className={
                      item.proof_status === 'approved'
                        ? 'text-green-600'
                        : item.proof_status === 'rejected'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }>
                      Proof: {item.proof_status}
                    </span>
                  )}
                </div>
              </div>
              <p className="font-medium text-gray-900">
                ${Number(item.line_total).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <h3 className="font-medium text-gray-900">Shipping Address</h3>
          <div className="mt-2 text-sm text-gray-600 space-y-1">
            <p>{order.shipping_address.name}</p>
            <p>{order.shipping_address.line1}</p>
            {order.shipping_address.line2 && <p>{order.shipping_address.line2}</p>}
            <p>
              {order.shipping_address.city}, {order.shipping_address.state}{' '}
              {order.shipping_address.postal_code}
            </p>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h3 className="font-medium text-gray-900">Order Summary</h3>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>${Number(order.shipping_cost).toFixed(2)}</span>
            </div>
            {Number(order.tax_amount) > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${Number(order.tax_amount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium text-gray-900 border-t pt-1">
              <span>Total</span>
              <span>${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
          {order.tracking_number && (
            <div className="mt-3 border-t pt-3">
              <h4 className="text-sm font-medium text-gray-900">Tracking</h4>
              <p className="mt-1 text-xs text-gray-500">
                {order.tracking_number}
              </p>
              {trackingData && (
                <div className="mt-1 text-xs text-gray-600 space-y-1">
                  <p>Status: <span className="font-medium">{trackingData.status}</span></p>
                  {trackingData.carrier && <p>Carrier: {trackingData.carrier}</p>}
                  {trackingData.estimated_delivery && (
                    <p>Est. Delivery: {new Date(trackingData.estimated_delivery).toLocaleDateString()}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
