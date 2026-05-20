import {
  ShoppingBag,
  Star,
  BarChart3,
  Users,
} from "lucide-react";

const iconMap = {
  ShoppingBag,
  Star,
  BarChart3,
  Users,
};

const iconColorMap = {
  ShoppingBag: { bg: "bg-red-100", text: "text-red-500" },
  Star: { bg: "bg-amber-100", text: "text-amber-500" },
  BarChart3: { bg: "bg-blue-100", text: "text-blue-500" },
  Users: { bg: "bg-green-100", text: "text-green-500" },
};

const trendTextColor = {
  positive: "text-green-600",
  negative: "text-red-500",
  neutral: "text-gray-500",
};

export default function KPICard({ title, value, trend, trendType, icon }) {
  const IconComponent = iconMap[icon] || ShoppingBag;
  const { bg: iconBg, text: iconText } = iconColorMap[icon] || iconColorMap.ShoppingBag;
  const trendColor = trendTextColor[trendType] || trendTextColor.neutral;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow duration-200">
      <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
      <div className="text-3xl font-bold text-gray-900 mb-3">{value}</div>
      <div className="flex items-end justify-between">
        <span className={`text-sm font-medium ${trendColor}`}>
          {trend}
        </span>
        <div className={`p-2.5 rounded-xl ${iconBg}`}>
          <IconComponent className={`w-5 h-5 ${iconText}`} />
        </div>
      </div>
    </div>
  );
}
