import { useState, useEffect, useCallback } from 'react';
import {
  getSummaryMetrics,
  getRevenueOverTime,
  getOrdersOverTime,
  getTopProducts,
  getPortalPerformance,
  getFulfillmentMetrics,
} from '../api/analytics';
import type {
  FulfillmentMetrics,
  OrdersOverTimeResponse,
  PortalPerformanceResponse,
  RevenueOverTimeResponse,
  SummaryMetrics,
  TimeGranularity,
  TopProductsResponse,
} from '../types/analytics';
import StatCard from '../components/dashboard/StatCard';
import DateRangeSelector from '../components/analytics/DateRangeSelector';
import RevenueChart from '../components/analytics/RevenueChart';
import OrdersChart from '../components/analytics/OrdersChart';
import TopProductsTable from '../components/analytics/TopProductsTable';
import PortalPerformanceTable from '../components/analytics/PortalPerformanceTable';
import FulfillmentCards from '../components/analytics/FulfillmentCards';
import Spinner from '../components/ui/Spinner';

function defaultStartDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().split('T')[0];
}

function todayDate(): string {
  return new Date().toISOString().split('T')[0];
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(todayDate);
  const [granularity, setGranularity] = useState<TimeGranularity>('daily');

  const [summary, setSummary] = useState<SummaryMetrics | null>(null);
  const [revenue, setRevenue] = useState<RevenueOverTimeResponse | null>(null);
  const [orders, setOrders] = useState<OrdersOverTimeResponse | null>(null);
  const [topProducts, setTopProducts] = useState<TopProductsResponse | null>(null);
  const [portalPerf, setPortalPerf] = useState<PortalPerformanceResponse | null>(null);
  const [fulfillment, setFulfillment] = useState<FulfillmentMetrics | null>(null);

  const fetchAll = useCallback(() => {
    setLoading(true);
    Promise.allSettled([
      getSummaryMetrics().then(setSummary),
      getRevenueOverTime(granularity, startDate, endDate).then(setRevenue),
      getOrdersOverTime(granularity, startDate, endDate).then(setOrders),
      getTopProducts(10, startDate, endDate).then(setTopProducts),
      getPortalPerformance(startDate, endDate).then(setPortalPerf),
      getFulfillmentMetrics(startDate, endDate).then(setFulfillment),
    ]).finally(() => setLoading(false));
  }, [granularity, startDate, endDate]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
        <DateRangeSelector
          startDate={startDate}
          endDate={endDate}
          granularity={granularity}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onGranularityChange={setGranularity}
        />
      </div>

      {/* Summary KPIs */}
      {summary && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Revenue"
            value={`$${summary.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          />
          <StatCard label="Orders" value={summary.order_count} />
          <StatCard
            label="Avg Order Value"
            value={`$${summary.average_order_value.toFixed(2)}`}
          />
          <StatCard label="Pending Proofs" value={summary.pending_proof_count} />
        </div>
      )}

      {/* Revenue Over Time */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-4 font-medium text-gray-900">Revenue Over Time</h3>
        <RevenueChart data={revenue?.data ?? []} />
      </div>

      {/* Orders Over Time */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-4 font-medium text-gray-900">Orders Over Time</h3>
        <OrdersChart data={orders?.data ?? []} />
      </div>

      {/* Top Products + Portal Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-4 font-medium text-gray-900">Top Products</h3>
          <TopProductsTable
            byRevenue={topProducts?.by_revenue ?? []}
            byQuantity={topProducts?.by_quantity ?? []}
          />
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-4 font-medium text-gray-900">Portal Performance</h3>
          <PortalPerformanceTable portals={portalPerf?.portals ?? []} />
        </div>
      </div>

      {/* Fulfillment Metrics */}
      {fulfillment && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="mb-4 font-medium text-gray-900">Fulfillment Speed</h3>
          <FulfillmentCards metrics={fulfillment} />
        </div>
      )}
    </div>
  );
}
