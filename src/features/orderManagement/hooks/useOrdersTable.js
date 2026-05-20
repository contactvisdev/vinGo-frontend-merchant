import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks";
import { formatDateToYYYYMMDD } from "@/helpers/commonFunctions";
import {
  useGetOrdersQuery,
  useUpdateOrderDecisionMutation,
} from "@/store/api/orderApi";
import {
  DEFAULT_SEARCH_DEBOUNCE_DELAY,
  DEFAULT_ORDER_PAGE_SIZE,
  ORDER_TABLE_COLUMNS,
} from "@features/orderManagement/constants";

export function useOrdersTable() {
  const profile = useSelector((state) => state?.businessProfile?.profile);
  const merchantId = profile?._id;
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page")) || 1
  );
  const pageSize = DEFAULT_ORDER_PAGE_SIZE;
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [dateRange, setDateRange] = useState(() => {
    const from = searchParams.get("fromDate");
    const to = searchParams.get("toDate");
    return {
      from: from ? new Date(from) : null,
      to: to ? new Date(to) : null,
    };
  });
  const [status, setStatus] = useState(searchParams.get("status") || null);
  const [actionLoading, setActionLoading] = useState({});
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const debouncedSearch = useDebounce(search, DEFAULT_SEARCH_DEBOUNCE_DELAY);
  const fromDate = formatDateToYYYYMMDD(dateRange.from);
  const toDate = formatDateToYYYYMMDD(dateRange.to);
  const searchQuery = debouncedSearch.trim();

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (status) params.status = status;
    if (currentPage > 1) params.page = currentPage.toString();
    if (dateRange.from) params.fromDate = formatDateToYYYYMMDD(dateRange.from);
    if (dateRange.to) params.toDate = formatDateToYYYYMMDD(dateRange.to);
    
    setSearchParams(params, { replace: true });
  }, [search, status, currentPage, dateRange, setSearchParams]);

  const { data: ordersData, isLoading: loadingOrders, isFetching, error: ordersError, isError: ordersIsError } = useGetOrdersQuery(
    {
      page: currentPage,
      limit: pageSize,
      merchantId,
      search: searchQuery.length >= 1 ? searchQuery : undefined,
      status: status || undefined,
      ...(fromDate && toDate ? { fromDate, toDate } : {}),
    },
    { skip: !merchantId }
  );

  const [updateDecision] = useUpdateOrderDecisionMutation();

  const orderList = ordersData?.list || [];
  const pagination = ordersData?.pagination || {};
  const merchantStats = ordersData?.merchantStats || null;
  const loading = loadingOrders;

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Handle browser back/forward navigation
  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page")) || 1;
    const urlSearch = searchParams.get("search") || "";
    const urlStatus = searchParams.get("status") || null;
    const urlFromDate = searchParams.get("fromDate");
    const urlToDate = searchParams.get("toDate");

    if (urlPage !== currentPage) setCurrentPage(urlPage);
    if (urlSearch !== search) setSearch(urlSearch);
    if (urlStatus !== status) setStatus(urlStatus);
    if (urlFromDate || urlToDate) {
      setDateRange({
        from: urlFromDate ? new Date(urlFromDate) : null,
        to: urlToDate ? new Date(urlToDate) : null,
      });
    }
  }, [searchParams]);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.value || "");
  }, []);

  const handleDateRangeChange = useCallback((e) => {
    setDateRange(e.value);
    setCurrentPage(1);
  }, []);

  const handleStatusChange = useCallback((e) => {
    setStatus(e.value);
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setSearch("");
    setDateRange({ from: null, to: null });
    setStatus(null);
    setCurrentPage(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.totalPages || 1)) setCurrentPage(newPage);
  };

  const handleOrderAction = useCallback(
    async (orderId, action) => {
      setActionLoading((prev) => ({ ...prev, [orderId]: action }));
      try {
        await updateDecision({ orderId, action }).unwrap();
      } catch (error) {
        // Error handled by API / UI
      } finally {
        setActionLoading((prev) => ({ ...prev, [orderId]: null }));
      }
    },
    [updateDecision]
  );

  const maxSelectableDate = new Date();
  maxSelectableDate.setHours(23, 59, 59, 999);

  const columns = ORDER_TABLE_COLUMNS;

  return {
    orderList,
    pagination,
    merchantStats,
    loading,
    error: ordersError,
    isError: ordersIsError,
    currentPage,
    pageSize,
    search,
    dateRange,
    status,
    actionLoading,
    isSearchFocused,
    setIsSearchFocused,
    maxSelectableDate,
    columns,
    handleSearchChange,
    handleDateRangeChange,
    handleStatusChange,
    resetFilters,
    handlePageChange,
    handleOrderAction,
  };
}
