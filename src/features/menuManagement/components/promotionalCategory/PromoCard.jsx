import { memo } from "react";
import { Trash, Tag, Calendar } from "lucide-react";
import { CustomSwitch } from "@/components/forms/CustomSwitch";
import IconButton from "@/components/ui/Button/IconButton";
import { getImageUrl } from "@/helpers/commonFunctions";
import PencilIcon from "@/assets/icons/pencil.svg";
import SkeletonImage from "@/components/ui/SkeletonImage";

const formatPromoDate = (dateString) => {
  if (!dateString) return "No expiry";
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};

const PromoCard = memo(function PromoCard({ row, statusOverrides, onStatusToggle, onEdit, onDelete }) {
  const displayStatus = statusOverrides[row._id] ?? row.status;
  const isActive = (displayStatus || "").toLowerCase() === "active";
  const discount = row.DiscountPercentage ?? 0;

  return (
    <div className="group relative flex flex-col rounded-xl border border-gray-200 overflow-hidden bg-white hover:shadow-lg hover:border-rose-200 hover:-translate-y-0.5 transition-all duration-300 h-full">
      <div className="relative aspect-video overflow-hidden bg-linear-to-br from-rose-50 via-amber-50 to-orange-50 shrink-0">
        {row.promo_image ? (
          <SkeletonImage
            src={getImageUrl(row.promo_image)}
            alt={row.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="p-5 rounded-full bg-white/90 shadow-inner">
              <Tag className="w-14 h-14 text-rose-400" strokeWidth={1.5} />
            </div>
          </div>
        )}
        <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-rose-500 text-white font-bold text-xs sm:text-sm xl:text-lg shadow-lg flex items-center gap-1">
          {discount}% OFF
        </div>
        <div className="absolute top-2 right-2 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-white/95 backdrop-blur-sm shadow-md flex items-center gap-1 text-gray-700 text-[10px] sm:text-xs font-medium">
          <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-500" />
          {formatPromoDate(row.expiresOn)}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1 min-h-0">
        <div>
          <h3 className="font-semibold text-gray-900 truncate pr-2" title={row.title}>
            {row.title}
          </h3>
          {row.description && (
            <p className="text-gray-500 text-sm mt-0.5 line-clamp-2 min-h-10">{row.description}</p>
          )}
          {Array.isArray(row.offer_details) && row.offer_details.length > 0 && (
            <ul className="mt-2 space-y-0.5 text-xs text-gray-600">
              {row.offer_details.slice(0, 4).map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 line-clamp-1">
                  <span className="text-rose-500 mt-0.5 shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
              {row.offer_details.length > 4 && (
                <li className="text-gray-500 italic">+{row.offer_details.length - 4} more</li>
              )}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between mt-auto pt-4 gap-2 border-t border-gray-100">
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs text-gray-500">Active</span>
            <CustomSwitch
              name="status"
              value={isActive}
              hideSwitchText
              ignoreLabel
              onChange={({ value }) => onStatusToggle(row, value)}
            />
          </div>
          <div className="flex gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(row); }}
              className="p-2 rounded-lg hover:bg-rose-50 text-gray-600 hover:text-rose-600 transition-colors"
              aria-label="Edit"
            >
              <SkeletonImage src={PencilIcon} className="w-4 h-4" alt="Edit" />
            </button>
            <IconButton
              icon={Trash}
              onClick={(e) => { e.stopPropagation(); onDelete(row._id); }}
              className="hover:bg-red-50 text-red-500"
              ariaLabel="Delete"
              variant="danger"
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export { PromoCard, formatPromoDate };