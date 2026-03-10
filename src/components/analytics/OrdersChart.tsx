import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { OrderCountDataPoint } from '../../types/analytics';

interface Props {
  data: OrderCountDataPoint[];
}

function formatPeriod(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function OrdersChart({ data }: Props) {
  const chartData = data.map((d) => ({
    period: formatPeriod(d.period),
    count: d.count,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm text-gray-500">
        No order data for the selected period
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <h3 className="mb-4 font-heading text-sm font-semibold text-brand-dark">Orders Over Time</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="period" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => [Number(v), 'Orders']} />
          <Bar dataKey="count" fill="#7CB342" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
