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
  SummaryMetrics,
  RevenueDataPoint,
  OrderCountDataPoint,
  TopProductsResponse,
  PortalPerformanceResponse,
  FulfillmentMetrics as FulfillmentMetricsType,
  TimeGranularity,
} from '../types/analytics';
import Spinner from '../components/ui/Spinner';
import StatCard from '../components/dashboard/StatCard';
import DateRangeSelector from '../components/analytics/DateRangeSelector';
import RevenueChart from '../components/analytics/RevenueChart';
import OrdersChart from '../components/analytics/OrdersChart';
import TopProductsTable from '../components/analytics/TopProductsTable';
import PortalPerformanceTable from '../components/analytics/PortalPerformanceTable';
import FulfillmentCards from '../components/analytics/FulfillmentCards';

function defaultStartDate(): string {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return d.toISOString().slice(0, 10);
}

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [granularity, setGranularity] = useState<TimeGranularity>('daily');
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(todayDate);

  const [summary, setSummary] = useState<SummaryMetrics | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [ordersData, setOrdersData] = useState<OrderCountDataPoint[]>([]);
  const [topProducts, setTopProducts] = useState<TopProductsResponse | null>(null);
  const [portalPerf, setPortalPerf] = useState<PortalPerformanceResponse | null>(null);
  const [fulfillment, setFulfillment] = useState<FulfillmentMetricsType | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const isoStart = new Date(startDate).toISOString();
    const isoEnd = new Date(endDate + 'T23:59:59').toISOString();

    await Promise.allSettled([
      getSummaryMetrics().then(setSummary),
      getRevenueOverTime(granularity, isoStart, isoEnd).then((r) =>
        setRevenueData(r.data),
      ),
      getOrdersOverTime(granularity, isoStart, isoEnd).then((r) =>
        setOrdersData(r.data),
      ),
      getTopProducts(10, isoStart, isoEnd).then(setTopProducts),
      getPortalPerformance(isoStart, isoEnd).then(setPortalPerf),
      getFulfillmentMetrics(isoStart, isoEnd).then(setFulfillment),
    ]);
    setLoading(false);
  }, [granularity, startDate, endDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner className="h-8 w-8 text-teak-dark" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-heading text-xl font-bold text-brand-dark">Analytics</h2>
        <DateRangeSelector
          granularity={granularity}
          onGranularityChange={setGranularity}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
        />
      </div>

      {/* Summary stat cards */}
      {summary && (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Total Revenue"
            value={`$${summary.total_revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          />
          <StatCard label="Total Orders" value={summary.order_count} />
          <StatCard
            label="Avg Order Value"
            value={`$${summary.average_order_value.toFixed(2)}`}
          />
          <StatCard label="Pending Proofs" value={summary.pending_proof_count} />
        </div>
      )}

      {/* Charts */}
      <RevenueChart data={revenueData} />
      <OrdersChart data={ordersData} />

      {/* Tables */}
      {topProducts && (
        <TopProductsTable
          byRevenue={topProducts.by_revenue}
          byQuantity={topProducts.by_quantity}
        />
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {portalPerf && <PortalPerformanceTable portals={portalPerf.portals} />}
        <div>{fulfillment && <FulfillmentCards metrics={fulfillment} />}</div>
      </div>
    </div>
  );
}
