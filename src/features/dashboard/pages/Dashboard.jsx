import BaseCard from "@/components/ui/Card/Card";
import usePermission from "@/hooks/usePermission";
import { Analytics, SalesChart, RecentOrders } from "@features/dashboard/components";

export default function Dashboard() {
  const hasPermission = usePermission();
  const canViewOverview = hasPermission("dashboard", "canViewOverview");
  const canViewRecentOrders = hasPermission("dashboard", "canViewRecentOrders");
  const canViewMetrics = hasPermission("dashboard", "canViewMetrics");

  return (
    <div className="w-full space-y-6">
      {canViewOverview && (
        <section className="w-full">
          <Analytics />
        </section>
      )}
      {canViewRecentOrders && (
        <section className="w-full">
          <SalesChart />
        </section>
      )}
      {canViewMetrics && (
        <section className="w-full">
          <BaseCard
            title="Recent Orders"
            borderStyle="border-neutral-300"
            paddingStyle="p-4 sm:p-6 lg:p-8 2xl:p-10"
            titleFontStyle="font-medium text-lg sm:text-xl"
          >
            <RecentOrders />
          </BaseCard>
        </section>
      )}
    </div>
  );
}
