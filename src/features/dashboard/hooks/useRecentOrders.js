import { useState } from "react";
import { useSelector } from "react-redux";
import { useGetRecentOrdersQuery } from "@/store/api/dashboardApi";
import { DEFAULT_RECENT_ORDERS_PAGE_SIZE } from "../constants";

export const useRecentOrders = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = DEFAULT_RECENT_ORDERS_PAGE_SIZE;

  const profile = useSelector((state) => state.businessProfile.profile);

  const { data, isLoading: loadingOrders } = useGetRecentOrdersQuery(
    { page: currentPage, limit: pageSize, merchantId: profile?._id },
    { skip: !profile?._id }
  );

  const orders = data?.list || [];
  const pagination = data?.pagination || {};

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  return {
    orders,
    pagination,
    currentPage,
    pageSize,
    loadingOrders,
    handlePageChange,
  };
};
