import { memo } from "react";
import { Trash } from "lucide-react";
import PencilIcon from "@/assets/icons/pencil.svg";
import { CATALOG_GRADIENT_PALETTE } from "../../constants";
import SkeletonImage from "@/components/ui/SkeletonImage";

const ProductTypeCard = memo(function ProductTypeCard({ row, gradientIndex, onEdit, onDelete, onToggleActive }) {
  const initial = (row.name || "?").charAt(0).toUpperCase();
  const gradient = CATALOG_GRADIENT_PALETTE[gradientIndex % CATALOG_GRADIENT_PALETTE.length];

  return (
    <div className="group relative rounded-xl border overflow-hidden bg-white transition-all duration-300 shadow-sm border-gray-200 hover:shadow-xl hover:border-primary-200/60 hover:-translate-y-1">
      <div className="p-5 pb-4">
        <div className="flex items-start gap-4">
          <div
            className={`w-16 h-16 rounded-2xl bg-linear-to-br ${gradient} flex items-center justify-center text-white font-bold text-2xl shrink-0 shadow-lg ring-2 ring-white/50`}
          >
            {initial}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <h3 className="font-semibold text-gray-900 text-base truncate" title={row.name}>
              {row.name}
            </h3>
            {row.categoryId?.name && (
              <p className="text-gray-500 text-sm mt-0.5">{row.categoryId.name}</p>
            )}
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`text-xs font-medium ${row.isActive ? "text-green-700" : "text-red-700"}`}>
                {row.isActive ? "Active" : "Inactive"}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onToggleActive(row); }}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  row.isActive ? "bg-primary" : "bg-gray-300"
                }`}
                aria-label={row.isActive ? "Deactivate" : "Activate"}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                    row.isActive ? "translate-x-4.5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
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

export { ProductTypeCard };
