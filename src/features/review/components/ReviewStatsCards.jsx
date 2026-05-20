import { AutoSkeleton } from "@/components/ui/Skeleton";
import StarBlueIcon from "@/assets/icons/starBlue.svg";
import StarOrangeIcon from "@/assets/icons/starOrange.svg";
import ThumbupMessageIcon from "@/assets/icons/thumbupMessage.svg";
import ThumbupGreenIcon from "@/assets/icons/thumbupGreen.svg";
import StarRating from "@/components/ui/StarRating";
import SkeletonImage from "@/components/ui/SkeletonImage";

const formatRating = (value) => (value ? value.toFixed(1) : "0.0");

const getTextColor = (text) => {
  if (!text) return "text-gray-600";
  return text.startsWith("-") ? "text-red-600" : "text-green-600";
};

const getValueColor = (value) => {
  if (value == null) return "text-gray-600";
  return value < 0 ? "text-red-600" : "text-green-600";
};

const PLACEHOLDER_STATS = {
  totalReviews: 128,
  reviewsChangeText: "+12 this week",
  rating: 4.5,
  ratingChangeFromLastMonth: 0.3,
  pendingResponses: 5,
  responseRate: "85%",
  responseRateChangeText: "+5% improvement",
};

export default function ReviewStatsCards({ stats, loading }) {
  if (!loading && !stats) return null;

  const displayStats = loading ? PLACEHOLDER_STATS : stats;

  const cards = [
    {
      title: "Total Reviews",
      value: displayStats?.totalReviews || 0,
      changeLabel: displayStats?.reviewsChangeText || null,
      changeColor: getTextColor(displayStats?.reviewsChangeText),
      icon: StarBlueIcon,
      iconBg: "bg-blue-100",
    },
    {
      title: "Average Rating",
      value: formatRating(displayStats?.rating),
      showStarRating: true,
      rawRating: displayStats?.rating || 0,
      changeLabel:
        displayStats?.ratingChangeFromLastMonth != null
          ? `${displayStats.ratingChangeFromLastMonth >= 0 ? "+" : ""}${displayStats.ratingChangeFromLastMonth.toFixed(1)} from last month`
          : null,
      changeColor: getValueColor(displayStats?.ratingChangeFromLastMonth),
      icon: StarOrangeIcon,
      iconBg: "bg-yellow-100",
    },
    {
      title: "Pending Responses",
      value: displayStats?.pendingResponses || 0,
      changeLabel:
        displayStats?.pendingResponses > 0 ? "Requires attention" : null,
      changeColor: "text-orange-600",
      icon: ThumbupMessageIcon,
      iconBg: "bg-orange-100",
    },
    {
      title: "Response Rate",
      value: displayStats?.responseRate || "0%",
      changeLabel: displayStats?.responseRateChangeText || null,
      changeColor: getTextColor(displayStats?.responseRateChangeText),
      icon: ThumbupGreenIcon,
      iconBg: "bg-green-100",
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
            <div className="text-3xl inline-flex gap-3 font-bold text-gray-900 mb-2">
              {card.value}
              {card.showStarRating && (
                <StarRating rating={card.rawRating} size={18} />
              )}
            </div>
            <div className="flex items-center justify-between gap-4">
              {card.changeLabel && (
                <div className={`text-sm font-medium ${card.changeColor}`}>
                  {card.changeLabel}
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
