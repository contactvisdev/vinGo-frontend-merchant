import { memo } from "react";
import { Trash, GripVertical } from "lucide-react";
import PencilIcon from "@/assets/icons/pencil.svg";
import { CATALOG_GRADIENT_PALETTE } from "../../constants";
import SkeletonImage from "@/components/ui/SkeletonImage";

const CatalogCard = memo(function CatalogCard({ row, gradientIndex, onEdit, onDelete, dragHandleProps, isDragging }) {
  const initial = (row.catalogName || "?").charAt(0).toUpperCase();
  const gradient = CATALOG_GRADIENT_PALETTE[gradientIndex % CATALOG_GRADIENT_PALETTE.length];

  return (
    <div className={`group relative rounded-xl border overflow-hidden bg-white transition-all duration-300 shadow-sm ${
      isDragging
        ? "border-primary-300 shadow-xl scale-[1.03] z-50 ring-2 ring-primary-200/50"
        : "border-gray-200 hover:shadow-xl hover:border-primary-200/60 hover:-translate-y-1"
    }`}>
      <div className="p-5 pb-4">
        <div className="flex items-start gap-4">
          {dragHandleProps && (
            <button
              {...dragHandleProps}
              className="mt-1 p-1 -ml-1 rounded text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing touch-none"
              aria-label="Drag to reorder"
            >
              <GripVertical className="w-5 h-5" />
            </button>
          )}
          <div
            className={`w-16 h-16 rounded-2xl bg-linear-to-br ${gradient} flex items-center justify-center text-white font-bold text-2xl shrink-0 shadow-lg ring-2 ring-white/50`}
          >
            {initial}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="font-semibold text-gray-900 text-base truncate" title={row.catalogName}>
              {row.catalogName}
            </h3>
            <p className="text-gray-500 text-sm mt-0.5">Menu category</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(row); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-primary-50 hover:text-primary transition-colors"
            aria-label="Edit"
          >
            <SkeletonImage src={PencilIcon} className="w-4 h-4" alt="" />
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(row._id); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            aria-label="Delete"
          >
            <Trash className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
});

export { CatalogCard };
