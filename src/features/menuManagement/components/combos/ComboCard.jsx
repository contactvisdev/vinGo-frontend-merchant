import { memo } from "react";
import { Trash, Package } from "lucide-react";
import { CustomToggle } from "@/components/forms/AllInput";
import IconButton from "@/components/ui/Button/IconButton";
import { getImageUrl } from "@/helpers/commonFunctions";
import PencilIcon from "@/assets/icons/pencil.svg";
import SkeletonImage from "@/components/ui/SkeletonImage";

const ComboCard = memo(function ComboCard({ row, onToggleAvailability, onEdit, onDelete }) {
  const itemCount = Array.isArray(row.itemIds) ? row.itemIds.length : 0;

  return (
    <div className="group relative rounded-xl border border-gray-200 overflow-hidden bg-white hover:shadow-lg hover:border-primary-200 hover:-translate-y-0.5 transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-linear-to-br from-amber-50 to-orange-50">
        {row && !row.combo_image ? (
            <div className="w-full h-full flex items-center justify-center">
            <div className="p-6 rounded-full bg-white/80 shadow-inner">
              <Package className="w-12 h-12 text-amber-400" strokeWidth={1.5} />
            </div>
          </div>
        ) : (
         <SkeletonImage
            src={getImageUrl(row.combo_image)}
            alt={row.combo_name}
            className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />

        
        )}
        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-sm shadow-md font-semibold text-primary text-sm">
          ${row.comboPrice ?? 0}
        </div>
        {itemCount > 0 && (
          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-black/60 text-white text-xs font-medium">
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate pr-2" title={row.combo_name}>
          {row.combo_name}
        </h3>
        <div className="flex items-center justify-between mt-4 gap-2">
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <span className="text-xs text-gray-500">Available</span>
            <CustomToggle
              data={{ availability: row.availability }}
              name="availability"
              onChange={() => onToggleAvailability(row)}
            />
          </div>
          <div className="flex gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(row); }}
              className="p-2 rounded-lg hover:bg-primary-50 text-gray-600 hover:text-primary transition-colors"
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

export { ComboCard };
