import ShoppingIcon from "@/assets/icons/shopping.svg";
import CoinIcon from "@/assets/icons/coin.svg";
import TruckIcon from "@/assets/icons/truck.svg";
import StarOrangeIcon from "@/assets/icons/starOrange.svg";

const iconMap = {
  Shopping: ShoppingIcon,
  Coin: CoinIcon,
  Truck: TruckIcon,
  Alert: StarOrangeIcon,
};

const ALLOWED_BG = new Set([
  "bg-blue-100",
  "bg-green-100",
  "bg-orange-100",
  "bg-red-100",
]);

const ALLOWED_BADGE_COLOR = new Set([
  "text-green-600",
  "text-orange-600",
  "text-red-600",
  "text-gray-500",
]);

export default function MetricCard({
  icon,
  iconBg,
  value,
  label,
  badge,
  badgeColor,
}) {
  const iconSrc = iconMap[icon];
  const safeBg = ALLOWED_BG.has(iconBg) ? iconBg : "bg-gray-100";
  const safeBadgeColor = ALLOWED_BADGE_COLOR.has(badgeColor) ? badgeColor : "text-gray-500";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className={`${safeBg} p-2 sm:p-3 rounded-lg shrink-0`}>
          {iconSrc && (
            <img
              src={iconSrc}
              alt={`${label} icon`}
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
            />
          )}
        </div>
        <span className={`text-xs sm:text-sm font-medium ${safeBadgeColor}`}>
          {badge}
        </span>
      </div>
      <div>
        <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
          {value}
        </div>
        <div className="text-xs sm:text-sm text-gray-600">{label}</div>
      </div>
    </div>
  );
}

