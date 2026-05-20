import { useEffect, useRef, useCallback } from "react";
import { ShoppingBag, Check, X } from "lucide-react";
import IconButton from "@/components/ui/Button/IconButton";
import { useNavigate } from "react-router-dom";
import {
  ORDER_STATUS_OPTIONS,
  ORDER_STATUS_STYLES,
  capitalizeStatus,
} from "@features/orderManagement/constants";
import {
  formatOrderId,
  formatCustomerName,
  formatDeliveryAddress,
  formatCurrency,
} from "@features/orderManagement/utils/orderFormatters";
import { Table } from "@/components/ui/Table";
import { OrderStatsCards, OrdersFilters } from "@features/orderManagement/components";
import usePermission from "@/hooks/usePermission";
import { useOrdersTable } from "@features/orderManagement/hooks";
import EyeIcon from "@/assets/icons/eye.svg";
import SkeletonImage from "@/components/ui/SkeletonImage";

export default function Orders() {
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  const hasPermission = usePermission();
  const canUpdateOrderStatus = hasPermission("orders", "canUpdateStatus");

  const {
    orderList,
    pagination,
    merchantStats,
    loading,
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
  } = useOrdersTable();

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
  }, [orderList, isSearchFocused]);

  const renderRow = useCallback(
    (order, index) => {
      const orderDetails = order.orders?.[0] || {};
      const orderStatus = orderDetails.status || order.status || "";
      const totalAmount = orderDetails.totalAmount || order.totalAmount || 0;
      const customerName = formatCustomerName(order.customerName);
      const orderId = order._id || order.id;
      const dropLocation = orderDetails.drop_location || {};
      const pickupLocation = orderDetails.location || {};
      const addressDisplay = formatDeliveryAddress(dropLocation, pickupLocation);

      return (
        <tr key={orderId || index} className="border-b border-gray-200">
          <td className="p-2 sm:p-3 text-primary-600">
            {formatOrderId(orderId, String(index + 1))}
          </td>
          <td className="p-2 sm:p-3">{customerName}</td>
          <td className="p-2 sm:p-3 hidden md:table-cell">{addressDisplay}</td>
          <td className="p-2 sm:p-3">
            <span
              className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                ORDER_STATUS_STYLES[orderStatus] ||
                ORDER_STATUS_STYLES[orderStatus?.toLowerCase()] ||
                "bg-gray-100 text-gray-700"
              }`}
            >
              {capitalizeStatus(orderStatus)}
            </span>
          </td>
          <td className="p-2 sm:p-3 hidden lg:table-cell text-gray-500">
            {order.createdAt ? (
              <>
                <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                <div className="text-xs">
                  {new Date(order.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </>
            ) : (
              "N/A"
            )}
          </td>
          <td className="p-2 sm:p-3">{formatCurrency(totalAmount)}</td>
          <td className="p-2 sm:p-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/orders/${orderId}`)}
                className="cursor-pointer w-5 h-5"
                aria-label="View order"
              >
                <SkeletonImage src={EyeIcon} alt="" />
              </button>
              {orderStatus?.toLowerCase() === "pending" && canUpdateOrderStatus && (
                <>
                  <IconButton
                    icon={Check}
                    onClick={() => handleOrderAction(orderId, "accept")}
                    disabled={actionLoading[orderId] === "accept"}
                    loading={actionLoading[orderId] === "accept"}
                    title="Accept Order"
                    variant="success"
                    size={16}
                  />
                  <IconButton
                    icon={X}
                    onClick={() => handleOrderAction(orderId, "reject")}
                    disabled={actionLoading[orderId] === "reject"}
                    loading={actionLoading[orderId] === "reject"}
                    title="Reject Order"
                    variant="danger"
                    size={16}
                  />
                </>
              )}
            </div>
          </td>
        </tr>
      );
    },
    [navigate, canUpdateOrderStatus, actionLoading, handleOrderAction]
  );

  return (
    <div className="w-full">
      <OrdersFilters
        search={search}
        dateRange={dateRange}
        status={status}
        loading={loading}
        isSearchFocused={isSearchFocused}
        searchInputRef={searchInputRef}
        maxSelectableDate={maxSelectableDate}
        onSearchChange={handleSearchChange}
        onSearchFocus={() => setIsSearchFocused(true)}
        onSearchBlur={() => setIsSearchFocused(false)}
        onDateRangeChange={handleDateRangeChange}
        onStatusChange={handleStatusChange}
        onResetFilters={resetFilters}
      />

      <OrderStatsCards stats={merchantStats} loading={loading} />

      <Table
        columns={columns}
        data={orderList}
        loading={loading}
        skeletonRows={5}
        emptyMessage="No Orders Found"
        emptyIcon={ShoppingBag}
        pagination={{
          currentPage: pagination.currentPage || currentPage,
          totalPages: pagination.totalPages || 1,
          totalItems: pagination.totalItems || 0,
          limit: pagination.limit || pageSize,
        }}
        onPageChange={handlePageChange}
        renderRow={renderRow}
      />
    </div>
  );
}
