import { memo } from "react";
import { formatReviewDate } from "@/helpers/formatters";

const ReviewCard = memo(function ReviewCard({ review, onView }) {
  const customerName = review.customerName || "Anonymous";
  const reviewRating = review.orderRating || 0;
  const reviewText = review.review || "No review text";
  const createdAt = review.created_at || "";
  const items = Array.isArray(review.items) ? review.items : [];

  const formattedDate = formatReviewDate(createdAt) || createdAt; 

  const initials = customerName.split(" ").map(n => n.charAt(0)).join("").toUpperCase().substring(0, 2);
  
  const reviewedItemsStr = items.length > 0 
    ? `${items[0].name}${items.length > 1 ? ` (+${items.length - 1} more)` : ""}` 
    : "Multiple Items";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-200 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary tracking-widest shrink-0">
              {initials}
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{customerName}</h4>
              <p className="text-xs text-gray-500 mt-0.5">{formattedDate}</p>
            </div>
          </div>
          <div className="bg-primary/5 px-3 py-1.5 rounded-full flex items-center gap-1 shrink-0">
            <span className="text-primary font-bold text-sm">{reviewRating.toFixed(1)}</span>
            <i className="pi pi-star-fill text-primary text-[14px]"></i>
          </div>
        </div>
        
        <div className="mb-4">
          {items.length > 0 && (
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1 truncate">
              Item Reviewed: {reviewedItemsStr}
            </span>
          )}
          <p className="text-sm italic text-gray-800 leading-relaxed line-clamp-3">
            "{reviewText}"
          </p>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-100 flex justify-between items-center mt-2">
        <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">
          {review.itemType === "grocery" ? "Verified Purchase" : "Verified Diner"}
        </span>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onView(review);
          }}
          className="text-xs font-bold text-primary hover:underline cursor-pointer bg-transparent border-none p-0 tracking-wide"
        >
          View Details
        </button>
      </div>
    </div>
  );
});

export default ReviewCard;
