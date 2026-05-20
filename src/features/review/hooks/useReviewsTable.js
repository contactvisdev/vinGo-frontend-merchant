import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useGetReviewsQuery } from "@/store/api/reviewApi";
import { useDebounce } from "@/hooks";
import { formatDateToYYYYMMDD } from "@/helpers/commonFunctions";
import {
  DEFAULT_SEARCH_DEBOUNCE_DELAY,
  DEFAULT_REVIEWS_PAGE_SIZE,
  REVIEWS_TABLE_COLUMNS,
} from "@features/review/constants";

export const useReviewsTable = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const pageSize = DEFAULT_REVIEWS_PAGE_SIZE;
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [dateRange, setDateRange] = useState(() => {
    const from = searchParams.get("fromDate");
    const to = searchParams.get("toDate");
    return {
      from: from ? new Date(from) : null,
      to: to ? new Date(to) : null,
    };
  });
  const [rating, setRating] = useState(searchParams.get("rating") || null);

  const profile = useSelector((state) => state?.businessProfile?.profile);
  const merchantId = profile?._id;

  const debouncedSearch = useDebounce(search, DEFAULT_SEARCH_DEBOUNCE_DELAY);

  const fromDate = formatDateToYYYYMMDD(dateRange.from);
  const toDate = formatDateToYYYYMMDD(dateRange.to);

  const searchQuery = debouncedSearch.trim();
  const shouldIncludeSearch = searchQuery.length >= 1;

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (rating) params.rating = rating;
    if (currentPage > 1) params.page = currentPage.toString();
    if (dateRange.from) params.fromDate = formatDateToYYYYMMDD(dateRange.from);
    if (dateRange.to) params.toDate = formatDateToYYYYMMDD(dateRange.to);
    
    setSearchParams(params, { replace: true });
  }, [search, rating, currentPage, dateRange, setSearchParams]);

  const {
    data,
    isLoading: queryLoading,
    isFetching: queryFetching,
  } = useGetReviewsQuery(
    {
      page: currentPage,
      limit: pageSize,
      merchantId,
      search: shouldIncludeSearch ? searchQuery : undefined,
      rating: rating || undefined,
      ...(fromDate && toDate ? { startDate: fromDate, endDate: toDate } : {}),
    },
    { skip: !merchantId }
  );

  const reviews = data?.reviews;
  const summary = data?.summary;
  const reviewList = reviews?.list || [];
  const pagination = reviews?.pagination || {};

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page")) || 1;
    const urlSearch = searchParams.get("search") || "";
    const urlRating = searchParams.get("rating") || null;
    const urlFromDate = searchParams.get("fromDate");
    const urlToDate = searchParams.get("toDate");

    if (urlPage !== currentPage) setCurrentPage(urlPage);
    if (urlSearch !== search) setSearch(urlSearch);
    if (urlRating !== rating) setRating(urlRating);
    if (urlFromDate || urlToDate) {
      setDateRange({
        from: urlFromDate ? new Date(urlFromDate) : null,
        to: urlToDate ? new Date(urlToDate) : null,
      });
    }
  }, [searchParams]);

  const handleSearchChange = (e) => setSearch(e.value || "");

  const handleDateRangeChange = (e) => {
    setDateRange(e.value);
    setCurrentPage(1);
  };

  const handleRatingChange = (e) => {
    setRating(e.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setDateRange({ from: null, to: null });
    setRating(null);
    setCurrentPage(1);
  };

  return {
    reviewList,
    pagination,
    summary,
    loadingReviews: queryLoading,
    fetchingReviews: queryFetching,
    currentPage,
    pageSize,
    search,
    dateRange,
    rating,
    columns: REVIEWS_TABLE_COLUMNS,
    handleSearchChange,
    handleDateRangeChange,
    handleRatingChange,
    handlePageChange,
    resetFilters,
  };
};
