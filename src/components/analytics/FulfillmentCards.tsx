import type { FulfillmentMetrics } from '../../types/analytics';

interface Props {
  metrics: FulfillmentMetrics;
}

function formatHours(hours: number | null): string {
  if (hours === null) return '-';
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${hours.toFixed(1)}h`;
  return `${(hours / 24).toFixed(1)}d`;
}

interface MetricCardProps {
  label: string;
  value: string;
  sublabel: string;
}

function MetricCard({ label, value, sublabel }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium uppercase text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      <p className="mt-0.5 text-xs text-gray-400">{sublabel}</p>
    </div>
  );
}

export default function FulfillmentCards({ metrics }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700">Fulfillment Speed</h3>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          label="Placed to Approved"
          value={formatHours(metrics.avg_placed_to_approved_hours)}
          sublabel="avg time"
        />
        <MetricCard
          label="Approved to Shipped"
          value={formatHours(metrics.avg_approved_to_shipped_hours)}
          sublabel="avg time"
        />
        <MetricCard
          label="Shipped to Delivered"
          value={formatHours(metrics.avg_shipped_to_delivered_hours)}
          sublabel="avg time"
        />
        <MetricCard
          label="End to End"
          value={formatHours(metrics.avg_placed_to_delivered_hours)}
          sublabel={`${metrics.orders_measured} orders measured`}
        />
      </div>
    </div>
  );
}
