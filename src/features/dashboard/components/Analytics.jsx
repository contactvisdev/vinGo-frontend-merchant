import { useDashboardOverview } from "../hooks";
import MetricCard from "./MetricCard";
import { AutoSkeleton } from "@/components/ui/Skeleton";

const METRIC_PLACEHOLDER = {
  icon: "Shopping",
  iconBg: "bg-blue-100",
  value: "24",
  label: "Total Orders Today",
  badge: "+5.2%",
  badgeColor: "text-green-600",
};

export default function Analytics() {
  const { metrics, loading } = useDashboardOverview();
  

  return (
    <AutoSkeleton loading={loading} config={{ animation: "shimmer" }}>
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <AutoSkeleton.Repeat count={4}>
              <MetricCard {...METRIC_PLACEHOLDER} />
            </AutoSkeleton.Repeat>
          ) : (
            metrics.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))
          )}
        </div>
      </div>
    </AutoSkeleton>
  );
}
