import { useState, useEffect, type MouseEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { listMyOrders } from '../../api/orders';
import type { Order } from '../../types/order';
import Spinner from '../../components/ui/Spinner';
import { humanize } from '../../lib/labels';
import { useReorder, canReorder } from '../../hooks/useReorder';

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

export default function MyOrdersPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { reorder, reordering } = useReorder();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reorderError, setReorderError] = useState<string | null>(null);

  const handleReorder = async (e: MouseEvent, order: Order) => {
    e.preventDefault();
    setReorderError(null);
    try {
      const result = await reorder(order);
      if (result.added === 0) {
        setReorderError('None of the items on that order are in the catalog any more.');
        return;
      }
      navigate(`/p/${slug}/cart`);
    } catch {
      setReorderError('Could not add those items to your cart.');
    }
  };

  useEffect(() => {
    if (!slug) return;
    listMyOrders(slug)
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-teak-dark" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
      {reorderError && <p className="mt-2 text-sm text-red-600">{reorderError}</p>}

      {orders.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-gray-500">You haven't placed any orders yet.</p>
          <Link
            to={`/p/${slug}/products`}
            className="mt-4 inline-block text-sm text-teak-dark hover:text-teak"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/p/${slug}/orders/${order.id}`}
              className="block rounded-lg border bg-white p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{order.order_number}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(order.placed_at).toLocaleDateString()} &middot;{' '}
                    {order.line_items.length} item{order.line_items.length !== 1 && 's'}
                    {order.po_number && <> &middot; PO {order.po_number}</>}
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    {order.line_items
                      .map((li) => `${li.product_name} × ${li.quantity}`)
                      .join(', ')}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {humanize(order.status)}
                  </span>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    ${Number(order.total).toFixed(2)}
                  </p>
                  {canReorder(order) && (
                    <button
                      type="button"
                      onClick={(e) => handleReorder(e, order)}
                      disabled={reordering}
                      className="mt-2 rounded-md border border-teak-dark px-3 py-1 text-xs font-medium text-teak-dark hover:bg-teak/10 disabled:opacity-50"
                    >
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
