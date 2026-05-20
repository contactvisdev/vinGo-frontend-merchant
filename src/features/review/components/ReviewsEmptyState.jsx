import { Star } from "lucide-react";

export default function ReviewsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mb-4">
        <Star className="w-10 h-10 text-amber-500" strokeWidth={1.5} />
      </div>
      <p className="text-gray-600 font-medium mb-1">No reviews found</p>
      <p className="text-gray-500 text-sm text-center max-w-xs">
        Reviews from your customers will appear here.
      </p>
    </div>
  );
}
