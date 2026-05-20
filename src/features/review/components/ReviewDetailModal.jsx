import { X, Star, Verified, ArrowRight } from "lucide-react";
import { formatReviewDate, formatReviewTime } from "@/helpers/formatters";

export default function ReviewDetailModal({ review, visible, onClose }) {
  if (!visible) return null;

  const hasReview = !!review;
  const customerName = review?.customerName || "Anonymous";
  const initial = customerName.charAt(0).toUpperCase();
  const createdAt = review?.created_at || review?.createdAt;
  const formattedDate = hasReview ? formatReviewDate(createdAt, { includeWeekday: true }) : "";
  const formattedTime = hasReview ? formatReviewTime(createdAt) : "";
  const rating = review?.orderRating || 0;
  const ratingPercent = (rating / 5) * 100;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/40 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5">
        {!hasReview ? (
          <div className="text-center py-12">
            <p className="text-on-surface-variant text-sm">Review details not available</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-5 pt-4 pb-4 flex justify-between items-center border-b border-surface-container/50 relative">
              <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-white p-0.5 shadow-md ring-1 ring-black/5">
                    <div className="w-full h-full rounded-[10px] bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white text-lg font-extrabold">
                      {initial}
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-sm">
                    <Verified className="w-3 h-3 text-primary fill-primary" />
                  </div>
                </div>
                <div>
                  <h2 className="text-base font-black text-on-surface tracking-tight mb-1">
                    {customerName}
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                      <span className="text-xs font-black text-on-surface">
                        {rating.toFixed(1)}
                      </span>
                      <span className="text-[10px] font-bold text-on-surface-variant/60">
                        / 5.0
                      </span>
                    </div>
                    <div className="w-20 h-1 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${ratingPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-black/5 hover:shadow-md hover:bg-primary hover:text-white transition-all text-on-surface-variant cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-6 space-y-6">
              {/* Ordered Items */}
              {Array.isArray(review.items) && review.items.length > 0 && (
                <section>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2.5">
                    Ordered Items
                  </h3>
                  <div className="grid grid-cols-2 gap-1.5 max-h-[180px] overflow-y-auto pr-1">
                    {review.items.map((item, i) => (
                      <div
                        key={item.itemId || i}
                        className="bg-white px-2.5 py-2 rounded-lg flex items-center gap-1.5 border border-surface-container-high shadow-sm cursor-default"
                      >
                        <span className="flex-1 text-xs font-semibold text-on-surface leading-tight truncate">
                          {item.name}
                        </span>
                        <span className="text-[9px] font-black text-primary px-1.5 py-0.5 bg-primary-container rounded-md uppercase shrink-0">
                          x{item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Review Message */}
              <section>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2.5">
                  Review Message
                </h3>
                <div className="px-6 py-8 bg-surface-container-low rounded-2xl border-2 border-primary/20">
                  <p
                    className={`text-base leading-relaxed text-center italic ${
                      review.review
                        ? "text-on-surface-variant font-semibold"
                        : "text-on-surface-variant/40 font-medium"
                    }`}
                  >
                    {review.review
                      ? `"${review.review}"`
                      : "No review text provided"}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <p className="text-[10px] font-medium text-on-surface-variant">
                    {formattedDate}
                  </p>
                  <span className="text-[10px] text-on-surface-variant/40">•</span>
                  <div className="px-2 py-0.5 bg-primary/10 rounded-md text-[10px] font-bold text-primary">
                    {formattedTime}
                  </div>
                </div>
              </section>

              {/* Footer Actions */}
              {/* <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border-2 border-surface-container-high text-on-surface-variant font-bold text-xs hover:bg-surface-container transition-all active:scale-95 cursor-pointer"
                >
                  Archive Review
                </button>
                <button className="group flex items-center gap-2 px-8 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-[0_8px_20px_-4px_rgba(233,30,99,0.4)] hover:shadow-[0_12px_28px_-4px_rgba(233,30,99,0.5)] transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
                  <span>Reply to Customer</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
