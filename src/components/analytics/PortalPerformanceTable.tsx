import type { PortalPerformance } from '../../types/analytics';

interface Props {
  portals: PortalPerformance[];
}

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function PortalPerformanceTable({ portals }: Props) {
  if (portals.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-semibold text-gray-700">Portal Performance</h3>
        <p className="text-sm text-gray-500">No portal data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-700">Portal Performance</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase text-gray-500">
            <th className="pb-2">Portal</th>
            <th className="pb-2 text-right">Orders</th>
            <th className="pb-2 text-right">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {portals.map((p) => (
            <tr key={p.portal_id} className="border-b border-gray-50">
              <td className="py-2 font-medium text-gray-900">{p.portal_name}</td>
              <td className="py-2 text-right text-gray-700">{p.order_count}</td>
              <td className="py-2 text-right text-gray-700">{formatCurrency(p.total_revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
