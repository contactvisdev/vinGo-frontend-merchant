import { formatDateTime, formatCurrency } from "../utils/orderFormatters";
import { Receipt } from "lucide-react";

export default function OrderSummary({ orderData, orderId }) {
  const orderDetails = orderData?.order || {};
  const orderType = orderData?.orderType || "delivery";
  const paymentMethod = orderData?.paymentMethod || "Cash on Delivery";
  const paymentStatus = orderData?.paymentStatus || "pending";
  const totalAmount = orderDetails.totalAmount || 0;
  const currency = orderDetails.currency || "USD";
  const createdAt = orderData?.createdAt;
  const displayOrderId = orderData?.displayOrderId
    ? `#${orderData.displayOrderId}`
    : `#${(orderData?._id || orderId || "").slice(-8)}`;

  const paymentStatusColor =
    paymentStatus === "completed"
      ? "text-green-700"
      : paymentStatus === "pending"
        ? "text-amber-700"
        : paymentStatus === "failed"
          ? "text-red-700"
          : "text-gray-700";

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Receipt size={20} className="text-primary" />
          Order Summary
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Order ID
            </span>
            <span className="text-sm font-semibold text-right">{displayOrderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Payment Status
            </span>
            <span className={`text-sm font-semibold capitalize text-right ${paymentStatusColor}`}>
              {paymentStatus === "pending" ? "Awaiting Payment" : paymentStatus}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Method
            </span>
            <span className="text-sm font-semibold capitalize text-right">
              {paymentMethod || "Cash on Delivery"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Order Type
            </span>
            <span className="text-sm font-semibold capitalize text-right">{orderType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              Currency
            </span>
            <span className="text-sm font-semibold text-right">{currency}</span>
          </div>
          {createdAt && (
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Placed On
              </span>
              <span className="text-sm font-semibold text-right">{formatDateTime(createdAt)}</span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-gray-200/50">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
          Total Amount
        </p>
        <p className="text-3xl font-extrabold text-primary">
          {formatCurrency(totalAmount)}
        </p>
      </div>
    </div>
  );
}
