import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetOverviewQuery } from "@/store/api/dashboardApi";

const getTrendColor = (trend) => {
  if (!trend || trend === "+0%" || trend === "0%") return "text-gray-500";
  return trend.startsWith("-") ? "text-red-600" : "text-green-600";
};

export const useDashboardOverview = () => {
  const profile = useSelector((state) => state.businessProfile.profile);

  const { data: overview, isLoading: loading } = useGetOverviewQuery(
    {
      itemType: profile?.categoryName?.toLowerCase(),
      merchantId: profile?._id,
    },
    { skip: !profile?._id }
  );

  const metrics = useMemo(
    () => [
      {
        icon: "Shopping",
        iconBg: "bg-blue-100",
        value: overview?.totalOrders ?? "0",
        label: "Total Orders",
        badge: overview?.orderTrend ?? "+0%",
        badgeColor: getTrendColor(overview?.orderTrend),
      },
      {
        icon: "Coin",
        iconBg: "bg-green-100",
        value: overview?.totalRevenue ? `$${overview.totalRevenue}` : "$0",
        label: "Total Revenue",
        badge: overview?.revenueTrend ?? "+0%",
        badgeColor: getTrendColor(overview?.revenueTrend),
      },
      {
        icon: "Truck",
        iconBg: "bg-orange-100",
        value: overview?.pendingDeliveries ?? "0",
        label: "Pending Deliveries",
        badge: overview?.deliveryCount ?? "0",
        badgeColor: getTrendColor(overview?.deliveryCount),
      },
      {
        icon: "Alert",
        iconBg: "bg-red-100",
        value: overview?.averageRating ?? "0",
        label: "Average Rating",
        badge: overview?.ratingTrend ?? "+0%",
        badgeColor: getTrendColor(overview?.ratingTrend),
      },
    ],
    [overview]
  );

  return {
    metrics,
    loading,
  };
};
