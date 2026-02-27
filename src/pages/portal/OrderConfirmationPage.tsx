import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMyOrder } from '../../api/orders';
import { usePortalContext } from '../../contexts/PortalContext';
import type { Order } from '../../types/order';
import Spinner from '../../components/ui/Spinner';

export default function OrderConfirmationPage() {
  const { slug, orderId } = useParams<{ slug: string; orderId: string }>();
  const { portal } = usePortalContext();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const primaryColor = portal?.brand_config?.primary_color || '#4F46E5';

  useEffect(() => {
    if (!slug || !orderId) return;
    getMyOrder(slug, orderId)
      .then(setOrder)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug, orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-indigo-600" />
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

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="mt-4 text-2xl font-bold text-gray-900">Order Placed!</h1>
      <p className="mt-2 text-gray-500">
        Your order <span className="font-medium text-gray-900">{order.order_number}</span> has
        been placed successfully.
      </p>

      <div className="mx-auto mt-8 max-w-md rounded-lg border bg-white p-6 text-left">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Items</span>
            <span>{order.line_items.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total</span>
            <span className="font-medium">${Number(order.total).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Link
          to={`/p/${slug}/orders`}
          className="rounded-md px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: primaryColor }}
        >
          View My Orders
        </Link>
        <Link
          to={`/p/${slug}/products`}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
