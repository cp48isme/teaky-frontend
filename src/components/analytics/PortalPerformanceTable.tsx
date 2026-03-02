import type { PortalPerformance } from '../../types/analytics';

interface Props {
  portals: PortalPerformance[];
}

export default function PortalPerformanceTable({ portals }: Props) {
  if (portals.length === 0) {
    return <p className="py-4 text-center text-sm text-gray-400">No portal data</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b text-left text-xs font-medium text-gray-500">
          <th className="pb-2">Portal</th>
          <th className="pb-2 text-right">Orders</th>
          <th className="pb-2 text-right">Revenue</th>
        </tr>
      </thead>
      <tbody>
        {portals.map((p) => (
          <tr key={p.portal_id} className="border-b last:border-0">
            <td className="py-2 font-medium text-gray-900">{p.portal_name}</td>
            <td className="py-2 text-right text-gray-600">{p.order_count}</td>
            <td className="py-2 text-right font-medium">${p.total_revenue.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
