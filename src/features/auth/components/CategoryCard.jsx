import { UtensilsCrossed, Package, Pill } from "lucide-react";

const CATEGORY_ICONS = {
  restaurant: UtensilsCrossed,
  grocery: Package,
  pharmacy: Pill,
};

const CATEGORY_COLORS = {
  restaurant: {
    bg: "bg-orange-50",
    icon: "text-orange-500",
    activeBorder: "border-orange-400",
    activeRing: "ring-orange-100",
  },
  grocery: {
    bg: "bg-emerald-50",
    icon: "text-emerald-500",
    activeBorder: "border-emerald-400",
    activeRing: "ring-emerald-100",
  },
  pharmacy: {
    bg: "bg-blue-50",
    icon: "text-blue-500",
    activeBorder: "border-blue-400",
    activeRing: "ring-blue-100",
  },
};

const DEFAULT_COLORS = {
  bg: "bg-primary-50",
  icon: "text-primary",
  activeBorder: "border-primary",
  activeRing: "ring-primary-100",
};

export default function CategoryCard({ category, isSelected, onSelect, disabled }) {
  const slug = category.name.toLowerCase();
  const Icon = CATEGORY_ICONS[slug] || UtensilsCrossed;
  const colors = CATEGORY_COLORS[slug] || DEFAULT_COLORS;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onSelect(category)}
      className={`group w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
        disabled
          ? "border-neutral-200 bg-neutral-50 cursor-not-allowed opacity-60 pointer-events-none"
          : `cursor-pointer ${
              isSelected
                ? `${colors.activeBorder} ring-4 ${colors.activeRing} bg-white shadow-sm`
                : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm"
            }`
      }`}
    >
      <div
        className={`shrink-0 w-11 h-11 rounded-lg flex items-center justify-center transition-colors ${
          disabled
            ? "bg-neutral-100 text-neutral-400"
            : isSelected
              ? `${colors.bg} ${colors.icon}`
              : "bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200"
        }`}
      >
        <Icon size={22} strokeWidth={2} />
      </div>

      <span className="flex-1 text-base font-medium text-neutral-800">
        {category.name}
      </span>

      <div
        className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          disabled ? "border-neutral-300" : isSelected
            ? `${colors.activeBorder} ${colors.bg}`
            : "border-neutral-300"
        }`}
      >
        {isSelected && !disabled && (
          <div
            className={`w-2.5 h-2.5 rounded-full ${colors.icon.replace("text-", "bg-")}`}
          />
        )}
      </div>
    </button>
  );
}
