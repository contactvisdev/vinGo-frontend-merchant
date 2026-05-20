import { Sparkles } from "lucide-react";
import CustomButton from "@/components/ui/Button/Button";

export default function PromoCategoryEmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center my-auto px-4">
      <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mb-4">
        <Sparkles className="w-10 h-10 text-rose-500" strokeWidth={1.5} />
      </div>
      <p className="text-gray-600 font-medium mb-1">No promotions yet</p>
      <p className="text-gray-500 text-sm text-center max-w-xs mb-6">
        Create deals that attract customers. Add your first promotional category to get started.
      </p>
      <CustomButton label="Add promotional category" onClick={onAdd} />
    </div>
  );
}
