import { Sparkles } from "lucide-react";
import CustomButton from "@/components/ui/Button/Button";

export default function CombosEmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center my-auto px-4">
      <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-4">
        <Sparkles className="w-10 h-10 text-amber-500" strokeWidth={1.5} />
      </div>
      <p className="text-gray-600 font-medium mb-1">No combos yet</p>
      <p className="text-gray-500 text-sm text-center max-w-xs mb-6">
        Create bundles customers love. Add your first combo to get started.
      </p>
      <CustomButton label="Add combo" onClick={onAdd} />
    </div>
  );
}
