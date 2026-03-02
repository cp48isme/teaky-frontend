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

function formatPeriod(period: string): string {
  if (!period) return '';
  const d = new Date(period);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function OrdersChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-gray-400">
        No order data for this period
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    label: formatPeriod(d.period),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="#9ca3af" />
        <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" allowDecimals={false} />
        <Tooltip
          formatter={(value) => [Number(value), 'Orders']}
          labelFormatter={(label) => String(label)}
        />
        <Bar dataKey="count" fill="#818cf8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
