import React from "react";
import { FolderOpen } from "lucide-react";
import CustomButton from "@/components/ui/Button/Button";

/**
 * @param {object} props
 * @param {() => void} props.onAdd
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {string} [props.btnLabel]
 */
export default function CatalogEmptyState({
  onAdd,
  title = "No categories yet",
  description = "Organize your menu with categories. Add your first category to get started.",
  btnLabel = "Add category",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div
        className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4"
        aria-hidden="true"
      >
        <FolderOpen className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
      </div>
      <p className="text-gray-600 font-medium mb-1">{title}</p>
      <p className="text-gray-500 text-sm text-center max-w-xs mb-6">
        {description}
      </p>
      <CustomButton label={btnLabel} onClick={onAdd} />
    </div>
  );
}
