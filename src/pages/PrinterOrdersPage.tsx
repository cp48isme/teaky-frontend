import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listPrinterOrders } from '../api/orders';
import type { Order } from '../types/order';
import Spinner from '../components/ui/Spinner';

const STATUS_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Pending Approval', value: 'pending_approval' },
  { label: 'Approved', value: 'approved' },
  { label: 'In Production', value: 'in_production' },
  { label: 'Quality Check', value: 'quality_check' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const STATUS_COLORS: Record<string, string> = {
  submitted: 'bg-blue-100 text-blue-800',
  pending_approval: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  in_production: 'bg-purple-100 text-purple-800',
  quality_check: 'bg-orange-100 text-orange-800',
  shipped: 'bg-teal-100 text-teal-800',
  delivered: 'bg-teal-100 text-teal-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function PrinterOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    setLoading(true);
    listPrinterOrders(statusFilter || undefined)
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-brand-dark">Orders</h2>
        <Link
          to="/orders/new"
          className="rounded-md bg-teak-dark px-4 py-2 text-sm font-medium text-white hover:bg-teak"
        >
          New Order
        </Link>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              statusFilter === f.value
                ? 'bg-teak-dark text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="h-8 w-8 text-teak-dark" />
        </div>
      ) : orders.length === 0 ? (
        <p className="py-8 text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Order</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Items</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      to={`/orders/${order.id}`}
                      className="font-medium text-teak-dark hover:text-teak"
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(order.placed_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{order.line_items.length}</td>
                  <td className="px-4 py-3 font-medium">${Number(order.total).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
