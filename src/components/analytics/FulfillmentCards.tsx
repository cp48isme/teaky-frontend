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

export default function FulfillmentCards({ metrics }: Props) {
  const cards = [
    { label: 'Placed to Approved', value: metrics.avg_placed_to_approved_hours },
    { label: 'Approved to Shipped', value: metrics.avg_approved_to_shipped_hours },
    { label: 'Shipped to Delivered', value: metrics.avg_shipped_to_delivered_hours },
    { label: 'Total (Placed to Delivered)', value: metrics.avg_placed_to_delivered_hours },
  ];

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg bg-gray-50 p-3 text-center">
            <p className="text-xs font-medium text-gray-500">{card.label}</p>
            <p className="mt-1 text-xl font-semibold text-gray-900">{formatHours(card.value)}</p>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-gray-400">
        Based on {metrics.orders_measured} delivered order{metrics.orders_measured !== 1 ? 's' : ''}
      </p>
    </div>
  );
}
