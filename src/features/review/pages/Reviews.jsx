import { useCallback, useMemo, useRef, useEffect, useState } from "react";
import Pagination from "@/components/ui/Table/Pagination";
import BaseCard from "@/components/ui/Card/Card";
import {
  ReviewStatsCards,
  ReviewCard,
  ReviewsFilters,
  ReviewsEmptyState,
  ReviewDetailModal,
} from "@features/review/components";
import { AutoSkeleton } from "@/components/ui/Skeleton";
import usePermission from "@/hooks/usePermission";
import { useReviewsTable, useReviewModal } from "../hooks";

const REVIEW_PLACEHOLDER = {
  _id: "__skeleton__",
  customerName: "John Doe",
  orderRating: 4.5,
  review: "Great food and fast delivery service overall",
  created_at: new Date().toISOString(),
  items: [{ itemId: "1", name: "Burger", quantity: 2 }],
};

export default function Reviews() {
  const {
    reviewList,
    pagination,
    summary,
    loadingReviews,
    fetchingReviews,
    currentPage,
    pageSize,
    search,
    dateRange,
    rating,
    handleSearchChange,
    handleDateRangeChange,
    handleRatingChange,
    handlePageChange,
    resetFilters,
  } = useReviewsTable();

  const { selectedReview, isModalOpen, openReviewModal, closeModal } =
    useReviewModal();
  const hasPermission = usePermission();
  const canViewReview = hasPermission("reviews", "canView");

  const isLoading = loadingReviews || fetchingReviews;
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  const maxSelectableDate = useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d;
  }, []);

  useEffect(() => {
    if (isSearchFocused && searchInputRef.current) {
      const timeoutId = setTimeout(() => {
        let inputElement = null;

        if (searchInputRef.current) {
          const element = searchInputRef.current.getElement?.() || searchInputRef.current;
          inputElement =
            element?.querySelector?.("input.p-inputtext") ||
            element?.querySelector?.("input") ||
            document.getElementById("search");
        }

        if (inputElement && document.activeElement !== inputElement && isSearchFocused) {
          inputElement.focus();
        }
      }, 10);

      return () => clearTimeout(timeoutId);
    }
  }, [reviewList, isSearchFocused]);

  const handleViewReview = useCallback(
    (review) => {
      if (canViewReview) openReviewModal(review);
    },
    [canViewReview, openReviewModal]
  );

  const list = Array.isArray(reviewList) ? reviewList : [];
  const totalPages = pagination?.totalPages || 1;
  const showPagination = totalPages > 1;

  return (
    <div className="w-full h-full flex flex-col">
      <ReviewStatsCards stats={summary} loading={loadingReviews} />

      <ReviewsFilters
        search={search}
        dateRange={dateRange}
        rating={rating}
        isLoading={isLoading}
        isSearchFocused={isSearchFocused}
        searchInputRef={searchInputRef}
        maxSelectableDate={maxSelectableDate}
        onSearchChange={handleSearchChange}
        onSearchFocus={() => setIsSearchFocused(true)}
        onSearchBlur={() => setIsSearchFocused(false)}
        onDateRangeChange={handleDateRangeChange}
        onRatingChange={handleRatingChange}
        onResetFilters={resetFilters}
      />

      <BaseCard extraClassName="px-6! py-4! flex-1">
        {!isLoading && list.length === 0 ? (
          <ReviewsEmptyState />
        ) : (
          <>
            <AutoSkeleton loading={isLoading} config={{ animation: "shimmer" }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                {isLoading ? (
                  <AutoSkeleton.Repeat count={12}>
                    <ReviewCard review={REVIEW_PLACEHOLDER} onView={() => {}} />
                  </AutoSkeleton.Repeat>
                ) : (
                  list.map((review) => (
                    <ReviewCard
                      key={review._id}
                      review={review}
                      onView={handleViewReview}
                    />
                  ))
                )}
              </div>
            </AutoSkeleton>
            {!isLoading && showPagination && (
              <div className="mt-4">
                <Pagination
                  currentPage={pagination?.currentPage || currentPage}
                  totalPages={totalPages}
                  totalItems={pagination?.totalItems || list.length}
                  pageSize={pagination?.limit || pageSize}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </BaseCard>

      <ReviewDetailModal
        review={selectedReview}
        visible={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
}
