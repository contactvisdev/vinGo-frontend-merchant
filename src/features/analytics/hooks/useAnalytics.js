import { useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  useGetAnalyticsOverviewQuery,
  useGetAnalyticsSalesPerformanceQuery,
} from "@/store/api/analyticsApi";
import { formatDateToYYYYMMDD } from "@/helpers/commonFunctions";
import { chartPalette, primary, error, warning, success, chart } from "@/helpers/constants/themeColors";

const RATING_COLORS = [
  error.DEFAULT,    
  warning.DEFAULT,  
  chart.amber,      
  success.DEFAULT,  
  success[700],     
];

const CATEGORY_COLORS = [
  primary.DEFAULT,
  chart.orange,
  chart.amber,
  chart.teal,
  chart.sky,
  chart.sage,
];

const DEFAULT_KPI = {
  totalReviews: {
    value: "--",
    trend: "",
    trendType: "neutral",
    icon: "Star",
  },
  totalOrders: {
    value: "--",
    trend: "",
    trendType: "neutral",
    icon: "ShoppingBag",
  },
  averageOrderValue: {
    value: "--",
    trend: "",
    trendType: "neutral",
    icon: "BarChart3",
  },
  repeatCustomers: {
    value: "--",
    trend: "",
    trendType: "neutral",
    icon: "Users",
  },
};

const STATIC_DELIVERY = {
  totalDeliveries: "20",
  onTimeDelivery: "90%",
  lateDeliveries: "2",
  avgDeliveryTime: "20 min",
};

function getDefaultDateRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return { from, to };
}

export const useAnalytics = () => {
  const profile = useSelector((state) => state.businessProfile.profile);
  const merchantId = profile?._id;

  const [dateRange, setDateRange] = useState(getDefaultDateRange);
  const [status, setStatus] = useState("all");

  // Overview query
  const {
    data: overviewData,
    isLoading: overviewLoading,
    isFetching: overviewFetching,
    error: overviewError,
    isError: overviewIsError,
    refetch: refetchOverview,
  } = useGetAnalyticsOverviewQuery(
    { merchantId },
    { skip: !merchantId },
  );

  // Sales performance query
  const salesParams = useMemo(() => {
    if (!merchantId) return null;
    return {
      merchantId,
      from: formatDateToYYYYMMDD(dateRange.from),
      to: formatDateToYYYYMMDD(dateRange.to),
    };
  }, [merchantId, dateRange]);

  const {
    data: salesData,
    isLoading: salesLoading,
    isFetching: salesFetching,
    error: salesError,
    isError: salesIsError,
    refetch: refetchSales,
  } = useGetAnalyticsSalesPerformanceQuery(salesParams, {
    skip: !salesParams,
  });

  // KPI metrics from overview - use API icon values directly
  const kpiMetrics = useMemo(() => {
    if (!overviewData) return DEFAULT_KPI;
    return {
      totalReviews: {
        value: overviewData.totalReviews?.value ?? "--",
        trend: overviewData.totalReviews?.trend ?? "",
        trendType: overviewData.totalReviews?.trendType ?? "neutral",
        icon: overviewData.totalReviews?.icon ?? "Star",
      },
      totalOrders: {
        value: overviewData.totalOrders?.value ?? "--",
        trend: overviewData.totalOrders?.trend ?? "",
        trendType: overviewData.totalOrders?.trendType ?? "neutral",
        icon: overviewData.totalOrders?.icon ?? "ShoppingBag",
      },
      averageOrderValue: {
        value: overviewData.averageOrderValue?.value ?? "--",
        trend: overviewData.averageOrderValue?.trend ?? "",
        trendType: overviewData.averageOrderValue?.trendType ?? "neutral",
        icon: overviewData.averageOrderValue?.icon ?? "BarChart3",
      },
      repeatCustomers: {
        value: overviewData.repeatCustomers?.value ?? "--",
        trend: overviewData.repeatCustomers?.trend ?? "",
        trendType: overviewData.repeatCustomers?.trendType ?? "neutral",
        icon: overviewData.repeatCustomers?.icon ?? "Users",
      },
    };
  }, [overviewData]);

  // Sales performance chart data — transform array of { date, revenue, orders }
  const salesChartData = useMemo(() => {
    if (!salesData?.sales?.length)
      return { labels: [], revenue: [], orders: [] };
    return {
      labels: salesData.sales.map((item) => {
        const d = new Date(item.date);
        return `${d.getDate()}/${d.getMonth() + 1}`;
      }),
      revenue: salesData.sales.map((item) => item.revenue),
      orders: salesData.sales.map((item) => item.orders),
    };
  }, [salesData]);

  // Top-selling categories — transform array of { category, totalSold }
  const categoriesData = useMemo(() => {
    if (!salesData?.topCategories?.length)
      return { labels: [], values: [], colors: [] };
    return {
      labels: salesData.topCategories.map((cat) => cat.category),
      values: salesData.topCategories.map((cat) => cat.totalSold),
      colors: CATEGORY_COLORS.slice(0, salesData.topCategories.length),
    };
  }, [salesData]);

  // Customer ratings — always 1-5 stars, default to 0
  const ratingsData = useMemo(() => {
    const defaultLabels = ["1 Star", "2 Star", "3 Star", "4 Star", "5 Star"];
    if (!salesData?.ratings?.length)
      return { labels: defaultLabels, values: [0, 0, 0, 0, 0], colors: RATING_COLORS };
    return {
      labels: salesData.ratings.map((r) => r.star),
      values: salesData.ratings.map((r) => r.count),
      colors: RATING_COLORS,
    };
  }, [salesData]);

  // Delivery performance — static for now (no API yet)
  const deliveryData = STATIC_DELIVERY;

  const handleRefresh = useCallback(() => {
    refetchOverview();
    refetchSales();
  }, [refetchOverview, refetchSales]);

  const handleDateRangeChange = useCallback((from, to) => {
    setDateRange({ from, to });
  }, []);

  const handleStatusChange = useCallback((newStatus) => {
    setStatus(newStatus);
  }, []);

  const loading = overviewLoading || salesLoading;
  const fetching = overviewFetching || salesFetching;

  return {
    kpiMetrics,
    salesChartData,
    categoriesData,
    ratingsData,
    deliveryData,
    dateRange,
    status,
    loading,
    fetching,
    error: overviewError || salesError,
    isError: overviewIsError || salesIsError,
    handleRefresh,
    handleDateRangeChange,
    handleStatusChange,
  };
};
