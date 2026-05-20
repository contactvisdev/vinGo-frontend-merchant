import Pagination from "@/components/ui/Table/Pagination";
import { useRecentOrders } from "../hooks";
import OrdersTable from "./OrdersTable";

export default function RecentOrders() {
  const {
    orders,
    pagination,
    currentPage,
    pageSize,
    loadingOrders,
    handlePageChange,
  } = useRecentOrders();

  return (
    <div className="w-full">
      <OrdersTable orders={orders} loading={loadingOrders} />
      <Pagination
        currentPage={pagination.currentPage || currentPage}
        totalPages={pagination.totalPages || 1}
        totalItems={pagination.totalItems || 0}
        pageSize={pagination.limit || pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
