import { useNavigate } from "react-router-dom";
import { ChevronRight, Check, X } from "lucide-react";

export default function OrderHeader({
  orderData,
  orderId,
  canUpdateOrderStatus,
  decisionLoading,
  onAcceptOrder,
  onRejectOrder,
  isRejected,
}) {
  const orderIdValue = orderData?._id || orderId;
  const orderIdDisplay = orderIdValue ? `#${orderIdValue.slice(-8)}` : `#${orderId}`;
  const status = orderData?.order?.status || "pending";
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <button
          onClick={() => navigate("/orders")}
          className="hover:text-primary-600 text-sm flex items-center gap-1"
        >
          Orders
        </button>
        <span>
          <ChevronRight size={16} />
        </span>
        <span className="text-primary text-sm">View Order Details</span>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-medium text-black">
            Orders Details-{orderIdDisplay}
          </h1>
          <p className="text-black mt-1 text-base">
            Manage order information and track delivery status
          </p>
          {isRejected && (
            <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
              <X size={14} />
             Order Rejected
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {status?.toLowerCase() === "pending" && canUpdateOrderStatus && !isRejected && (
            <>
              <button
                onClick={onAcceptOrder}
                disabled={decisionLoading === "accept"}
                className={`px-6 py-2.5 rounded-lg font-medium text-white transition-colors flex items-center gap-2 ${
                  decisionLoading === "accept"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                title="Accept Order"
              >
                <Check size={18} />
                {decisionLoading === "accept" ? "Accepting..." : "Accept Order"}
              </button>
              <button
                onClick={onRejectOrder}
                disabled={decisionLoading === "reject"}
                className={`px-6 py-2.5 rounded-lg font-medium text-white transition-colors flex items-center gap-2 ${
                  decisionLoading === "reject"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                title="Reject Order"
              >
                <X size={18} />
                {decisionLoading === "reject" ? "Rejecting..." : "Reject Order"}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
