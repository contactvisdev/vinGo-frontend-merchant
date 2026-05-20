import { SkeletonLoader } from "@/components/ui/Skeleton/Skeleton";
import OrderRow from "./OrderRow";

export default function OrdersTable({ orders, loading }) {
  if (!loading && (!orders || orders.length === 0)) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-gray-500">No orders found</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead className="text-black text-sm bg-gray-100">
            <tr>
              <th className="p-2 sm:p-3">Order ID</th>
              <th className="p-2 sm:p-3">Customer</th>
              <th className="p-2 sm:p-3 hidden md:table-cell">Items</th>
              <th className="p-2 sm:p-3">Status</th>
              <th className="p-2 sm:p-3 hidden lg:table-cell">Order Time</th>
              <th className="p-2 sm:p-3">Total</th>
              <th className="p-2 sm:p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }, (_, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="p-2 sm:p-3"><SkeletonLoader variant="text" className="h-4 w-16" /></td>
                    <td className="p-2 sm:p-3"><SkeletonLoader variant="text" className="h-4 w-24" /></td>
                    <td className="p-2 sm:p-3 hidden md:table-cell"><SkeletonLoader variant="text" className="h-4 w-32" /></td>
                    <td className="p-2 sm:p-3"><SkeletonLoader variant="text" className="h-6 w-20 rounded-full" /></td>
                    <td className="p-2 sm:p-3 hidden lg:table-cell"><SkeletonLoader variant="text" className="h-4 w-28" /></td>
                    <td className="p-2 sm:p-3"><SkeletonLoader variant="text" className="h-4 w-16" /></td>
                    <td className="p-2 sm:p-3"><SkeletonLoader variant="text" className="h-8 w-8 rounded" /></td>
                  </tr>
                ))
              : orders.map((order, index) => (
                  <OrderRow key={order._id || index} order={order} index={index} />
                ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
