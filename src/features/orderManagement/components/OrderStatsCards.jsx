import { AutoSkeleton } from "@/components/ui/Skeleton";
import ShoppingIcon from "@/assets/icons/shopping.svg";
import ClockOrangeIcon from "@/assets/icons/clockOrange.svg";
import CoinIcon from "@/assets/icons/coin.svg";
import AlarmClockIcon from "@/assets/icons/alarmclock.svg";
import { formatCurrency as formatCurrencyUtil } from "../utils/orderFormatters";
import SkeletonImage from "@/components/ui/SkeletonImage";

const formatCurrency = (value) => {
  const num = Number(value);
  if (num % 1 === 0) return `$${num}`;
  return formatCurrencyUtil(num);
};

const formatPercentage = (value) => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
};

const getChangeColor = (value) =>
  value >= 0 ? "text-green-600" : "text-red-600";

const PLACEHOLDER_STATS = {
  totalOrdersToday: { value: 156, percentChange: 12.5 },
  pendingOrders: { value: 8 },
  revenueToday: { value: 2450, percentChange: 8.3 },
  monthlyRevenue: { value: 45200, percentChange: 15.2 },
};

export default function OrderStatsCards({ stats, loading }) {
  if (!loading && !stats) return null;

  const displayStats = loading ? PLACEHOLDER_STATS : stats;

  const totalOrdersToday = displayStats?.totalOrdersToday?.value ?? 0;
  const pendingOrdersValue =
    typeof displayStats?.pendingOrders === "object"
      ? (displayStats?.pendingOrders?.value ?? 0)
      : (displayStats?.pendingOrders ?? 0);
  const revenueToday = displayStats?.revenueToday?.value ?? 0;
  const monthlyRevenueValue = displayStats?.monthlyRevenue?.value ?? 0;

  const cards = [
    {
      title: "Total Orders Today",
      value: totalOrdersToday,
      change: formatPercentage(
        displayStats?.totalOrdersToday?.percentChange ?? 0,
      ),
      changeLabel: "from yesterday",
      changeColor: getChangeColor(
        displayStats?.totalOrdersToday?.percentChange ?? 0,
      ),
      icon: ShoppingIcon,
      iconBg: "bg-blue-100",
    },
    {
      title: "Pending Orders",
      value: pendingOrdersValue,
      change: null,
      changeLabel: pendingOrdersValue > 0 ? "Requires attention" : null,
      changeColor: "text-orange-600",
      icon: ClockOrangeIcon,
      iconBg: "bg-orange-100",
    },
    {
      title: "Revenue Today",
      value: formatCurrency(revenueToday),
      change: formatPercentage(displayStats?.revenueToday?.percentChange ?? 0),
      changeLabel: "from yesterday",
      changeColor: getChangeColor(
        displayStats?.revenueToday?.percentChange ?? 0,
      ),
      icon: CoinIcon,
      iconBg: "bg-green-100",
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(monthlyRevenueValue),
      change: formatPercentage(
        displayStats?.monthlyRevenue?.percentChange ?? 0,
      ),
      changeLabel: "From last month",
      changeColor: getChangeColor(
        displayStats?.monthlyRevenue?.percentChange ?? 0,
      ),
      icon: AlarmClockIcon,
      iconBg: "bg-purple-100",
    },
  ];

  return (
    <AutoSkeleton loading={loading} config={{ animation: "shimmer" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-200 relative"
          >
            <div className="text-gray-600 text-sm mb-3">{card.title}</div>
            <div className="text-3xl font-bold text-gray-900 mb-2 w-fit">
              {card.value}
            </div>
            <div className="flex items-center justify-between gap-4">
              {(card.change || card.changeLabel) && (
                <div className={`text-sm font-medium ${card.changeColor}`}>
                  {card.change ? (
                    <>
                      {card.change} {card.changeLabel}
                    </>
                  ) : (
                    card.changeLabel
                  )}
                </div>
              )}
              <div className={`${card.iconBg} p-3 rounded-lg ml-auto shrink-0`}>
                <SkeletonImage src={card.icon} alt="" className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </AutoSkeleton>
  );
}
