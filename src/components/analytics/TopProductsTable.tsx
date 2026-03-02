import { useState } from 'react';
import type { TopProduct } from '../../types/analytics';

interface Props {
  byRevenue: TopProduct[];
  byQuantity: TopProduct[];
}

export default function TopProductsTable({ byRevenue, byQuantity }: Props) {
  const [tab, setTab] = useState<'revenue' | 'quantity'>('revenue');
  const data = tab === 'revenue' ? byRevenue : byQuantity;

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <button
          onClick={() => setTab('revenue')}
          className={`rounded px-2 py-1 text-xs font-medium ${
            tab === 'revenue' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          By Revenue
        </button>
        <button
          onClick={() => setTab('quantity')}
          className={`rounded px-2 py-1 text-xs font-medium ${
            tab === 'quantity' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          By Quantity
        </button>
      </div>
      {data.length === 0 ? (
        <p className="py-4 text-center text-sm text-gray-400">No product data</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs font-medium text-gray-500">
              <th className="pb-2">Product</th>
              <th className="pb-2">SKU</th>
              <th className="pb-2 text-right">Qty</th>
              <th className="pb-2 text-right">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.product_id} className="border-b last:border-0">
                <td className="py-2 font-medium text-gray-900">{p.product_name}</td>
                <td className="py-2 text-gray-500">{p.product_sku || '-'}</td>
                <td className="py-2 text-right text-gray-600">{p.total_quantity}</td>
                <td className="py-2 text-right font-medium">${p.total_revenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
