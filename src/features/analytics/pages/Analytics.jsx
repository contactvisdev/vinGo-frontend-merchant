import { useAnalytics } from "@features/analytics/hooks";
import AutoSkeleton from "@/components/ui/Skeleton/AutoSkeleton";
import {
  AnalyticsHeader,
  KPICard,
  SalesPerformanceChart,
  TopSellingCategoriesChart,
  CustomerRatingsChart,
  DeliveryPerformance,
} from "@features/analytics/components";

const SAMPLE_KPI = {
  totalReviews: { value: "0", trend: "0% from last month", trendType: "neutral", icon: "Star" },
  totalOrders: { value: "0", trend: "0% from last month", trendType: "neutral", icon: "ShoppingBag" },
  averageOrderValue: { value: "$0", trend: "0 from last month", trendType: "neutral", icon: "BarChart3" },
  repeatCustomers: { value: "0%", trend: "0% from last month", trendType: "neutral", icon: "Users" },
};
const SAMPLE_DELIVERY = { totalDeliveries: "0", onTimeDelivery: "0%", lateDeliveries: "0", avgDeliveryTime: "0 min" };

function LineChartPlaceholder() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ minHeight: 400 }}>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Sales Performance</h3>
      <div className="space-y-10">
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ height: 2 }} className="w-full bg-gray-100 rounded" />
        ))}
      </div>
      <div className="flex justify-between mt-4">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="text-xs text-gray-400">00/0</span>
        ))}
      </div>
      <div className="flex items-center justify-center gap-8 mt-4">
        <div className="flex items-center gap-2"><div style={{ width: 12, height: 12 }} className="rounded-full bg-gray-200" /><span className="text-xs text-gray-400">Revenue</span></div>
        <div className="flex items-center gap-2"><div style={{ width: 12, height: 12 }} className="rounded-full bg-gray-200" /><span className="text-xs text-gray-400">Orders</span></div>
      </div>
    </div>
  );
}

function BarChartPlaceholder() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ minHeight: 400 }}>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Top-Selling Categories</h3>
      <div className="flex items-end gap-4" style={{ height: 260 }}>
        {[180, 130, 220, 100, 160].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-gray-100 rounded-lg" style={{ height: h }} />
            <span className="text-xs text-gray-400">Category</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PieChartPlaceholder() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ minHeight: 400 }}>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Customer Ratings Summary</h3>
      <div className="flex items-center justify-center gap-12" style={{ height: 280 }}>
        <div style={{ width: 220, height: 220 }} className="rounded-full bg-gray-100 flex-shrink-0" />
        <div className="flex flex-col justify-center gap-6">
          {["1 Star", "2 Star", "3 Star", "4 Star", "5 Star"].map((label) => (
            <div key={label} className="flex items-center gap-3">
              <div style={{ width: 14, height: 14 }} className="rounded-full bg-gray-200 flex-shrink-0" />
              <span className="text-sm text-gray-400">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalyticsContent({
  loading,
  kpiMetrics,
  salesChartData,
  categoriesData,
  ratingsData,
  deliveryData,
  dateRange,
  status,
  fetching,
  handleRefresh,
  handleDateRangeChange,
  handleStatusChange,
}) {
  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Total Reviews"
          value={kpiMetrics.totalReviews.value}
          trend={kpiMetrics.totalReviews.trend}
          trendType={kpiMetrics.totalReviews.trendType}
          icon={kpiMetrics.totalReviews.icon}
        />
        <KPICard
          title="Total Orders"
          value={kpiMetrics.totalOrders.value}
          trend={kpiMetrics.totalOrders.trend}
          trendType={kpiMetrics.totalOrders.trendType}
          icon={kpiMetrics.totalOrders.icon}
        />
        <KPICard
          title="Average Order Value"
          value={kpiMetrics.averageOrderValue.value}
          trend={kpiMetrics.averageOrderValue.trend}
          trendType={kpiMetrics.averageOrderValue.trendType}
          icon={kpiMetrics.averageOrderValue.icon}
        />
        <KPICard
          title="Repeat Customers"
          value={kpiMetrics.repeatCustomers.value}
          trend={kpiMetrics.repeatCustomers.trend}
          trendType={kpiMetrics.repeatCustomers.trendType}
          icon={kpiMetrics.repeatCustomers.icon}
        />
      </div>
      <AnalyticsHeader
        dateRange={dateRange}
        status={status}
        onRefresh={handleRefresh}
        onDateRangeChange={handleDateRangeChange}
        onStatusChange={handleStatusChange}
        fetching={fetching}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {loading ? <LineChartPlaceholder /> : <SalesPerformanceChart data={salesChartData} />}
        {loading ? <BarChartPlaceholder /> : <TopSellingCategoriesChart data={categoriesData} />}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? <PieChartPlaceholder /> : <CustomerRatingsChart data={ratingsData} />}
        <DeliveryPerformance data={deliveryData} />
      </div>
    </div>
  );
}

export default function Analytics() {
  const {
    kpiMetrics,
    salesChartData,
    categoriesData,
    ratingsData,
    deliveryData,
    dateRange,
    status,
    loading,
    fetching,
    handleRefresh,
    handleDateRangeChange,
    handleStatusChange,
  } = useAnalytics();

  return (
    <AutoSkeleton loading={loading}>
      <AnalyticsContent
        loading={loading}
        kpiMetrics={loading ? SAMPLE_KPI : kpiMetrics}
        salesChartData={salesChartData}
        categoriesData={categoriesData}
        ratingsData={ratingsData}
        deliveryData={loading ? SAMPLE_DELIVERY : deliveryData}
        dateRange={dateRange}
        status={status}
        fetching={fetching}
        handleRefresh={handleRefresh}
        handleDateRangeChange={handleDateRangeChange}
        handleStatusChange={handleStatusChange}
      />
    </AutoSkeleton>
  );
}
