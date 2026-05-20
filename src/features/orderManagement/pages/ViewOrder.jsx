import { useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetOrderByIdQuery,
  useVerifyPickupOtpMutation,
  useProcessOrderPaymentMutation,
} from "@/store/api/orderApi";
import usePermission from "@/hooks/usePermission";
import { useCategory } from "@/hooks/useCategory";
import { useModal } from "@/hooks/ui/useModal";
import { AutoSkeleton } from "@/components/ui/Skeleton";
import { useOrderOperations } from "../hooks/useOrderOperations";
import { useOrderTimeline } from "../hooks/useOrderTimeline";
import {
  OrderHeader,
  OrderTimeline,
  OrderSummary,
  CustomerDetails,
  ItemsOrdered,
  DriverDetails,
  GiftDetails,
  PaymentSummary,
} from "../components";
import BaseModal from "@/components/ui/Modal/Modal";
import { CustomOtpInput } from "@/components/forms/CustomOtpInput";
import { ShieldCheck, CircleCheckBig, AlertCircle, CreditCard } from "lucide-react";


export default function ViewOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hasPermission = usePermission();
  const canUpdateOrderStatus = hasPermission("orders", "canUpdateStatus");
  const { categorySlug } = useCategory();

  const {
    data: orderData,
    isLoading: loading,
    refetch,
  } = useGetOrderByIdQuery(id, { skip: !id });
  const {
    handleStatusUpdate,
    handleOrderAction,
    timelineLoading,
    decisionLoading,
  } = useOrderOperations(id, refetch);

  const [verifyPickupOtp, { isLoading: otpVerifying }] = useVerifyPickupOtpMutation();
  const [processOrderPayment, { isLoading: paymentProcessing }] =
    useProcessOrderPaymentMutation();
  const { isOpen: otpModalOpen, open: openOtpModal, close: closeOtpModal } = useModal();
  const {
    isOpen: paymentModalOpen,
    open: openPaymentModal,
    close: closePaymentModal,
  } = useModal();
  const [otpData, setOtpData] = useState({ otp: "" });
  const [otpVerified, setOtpVerified] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const handleOtpChange = useCallback(({ name, value }) => {
    setOtpData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleVerifyOtp = useCallback(async () => {
    if (!otpData.otp || otpData.otp.length < 4) return;
    await verifyPickupOtp({ orderId: id, otp: otpData.otp }).unwrap();
    setOtpData({ otp: "" });
    setOtpVerified(true);
    refetch();
  }, [otpData.otp, id, verifyPickupOtp, refetch]);

  const handleCloseOtpModal = useCallback(() => {
    setOtpData({ otp: "" });
    setOtpVerified(false);
    closeOtpModal();
  }, [closeOtpModal]);

  const handleProceedToPayment = useCallback(() => {
    setOtpData({ otp: "" });
    setOtpVerified(false);
    closeOtpModal();
    openPaymentModal();
  }, [closeOtpModal, openPaymentModal]);

  const handleConfirmPayment = useCallback(async () => {
    if (!id) return;
    try {
      await processOrderPayment({ orderId: id }).unwrap();
      setPaymentConfirmed(true);
      refetch();
    } catch {
      // Error toast handled by base query
    }
  }, [id, processOrderPayment, refetch]);

  const handleClosePaymentModal = useCallback(() => {
    setPaymentConfirmed(false);
    closePaymentModal();
  }, [closePaymentModal]);

  const timeline = orderData?.order?.timeline || [];
  const orderType = orderData?.orderType || "delivery";
  const orderStatus = orderData?.order?.status || "pending";
  const isRejected = orderStatus === "merchant_rejected";

  const rejectedEntry = timeline.find((t) => t.status === "merchant_rejected");
  const rejectedAt = rejectedEntry?.timestamp
    ? new Date(rejectedEntry.timestamp).toLocaleString()
    : isRejected && orderData?.updatedAt
      ? new Date(orderData.updatedAt).toLocaleString()
      : null;

  const {
    timelineStatuses,
    currentStatusIndex,
    getStatusItemProps,
  } = useOrderTimeline(timeline, timelineLoading, orderType, categorySlug);

  const showOtpVerification =
    orderType === "pickup" &&
    canUpdateOrderStatus &&
    !isRejected &&
    orderStatus !== "delivered" &&
    orderStatus !== "rejected" &&
    orderStatus !== "cancelled";

  const isReadyForPickup = orderStatus === "ready_for_pickup";

  if (!loading && !orderData) {
    return (
      <div className="w-full text-center py-16">
        <p className="text-gray-500 text-lg">Order not found</p>
        <button
          onClick={() => navigate("/orders")}
          className="mt-4 text-primary-600 hover:text-primary-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <AutoSkeleton loading={loading} config={{ animation: "pulse" }}>
      <div className="w-full min-w-0 max-w-full space-y-6 overflow-y-hidden">
        <OrderHeader
          orderData={orderData}
          orderId={id}
          canUpdateOrderStatus={canUpdateOrderStatus}
          decisionLoading={decisionLoading}
          onAcceptOrder={() => handleOrderAction("accept")}
          onRejectOrder={() => handleOrderAction("reject")}
          isRejected={isRejected}
        />

        {isRejected && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4">
            <AlertCircle size={20} className="text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-red-700 font-medium text-sm">This order has been rejected.</p>
              {rejectedAt && (
                <p className="text-red-500 text-xs mt-0.5">Rejected on {rejectedAt}</p>
              )}
            </div>
          </div>
        )}

        {!isRejected && (
          <OrderTimeline
            timelineStatuses={timelineStatuses}
            currentStatusIndex={currentStatusIndex}
            getStatusItemProps={getStatusItemProps}
            timelineLoading={timelineLoading}
            onStatusUpdate={handleStatusUpdate}
          />
        )}

        {showOtpVerification && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                  <ShieldCheck size={20} className="text-amber-600" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-gray-900">Pickup OTP Verification</h3>
                  <p className="text-sm text-gray-500">Verify the customer's OTP to complete the pickup</p>
                </div>
              </div>
              <button
                onClick={openOtpModal}
                disabled={!isReadyForPickup}
                className={`px-5 py-2.5 rounded-lg font-medium text-white transition-colors ${
                  isReadyForPickup
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                title={!isReadyForPickup ? "Order must be ready for pickup to verify OTP" : ""}
              >
                Verify OTP
              </button>
            </div>
          </div>
        )}

        {/* Bento grid: summary cards — adapts columns to visible card count */}
        {(() => {
          const hasGift = !!orderData?.giftDetails;
          const hasDriver = orderType === "delivery";
          const cardCount = 2 + (hasGift ? 1 : 0) + (hasDriver ? 1 : 0);
          const gridCols =
            cardCount === 4
              ? "xl:grid-cols-4"
              : cardCount === 3
                ? "xl:grid-cols-3"
                : "xl:grid-cols-2";
          return (
            <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-6`}>
              <OrderSummary orderData={orderData} orderId={id} />
              <CustomerDetails orderData={orderData} />
              {hasGift && <GiftDetails orderData={orderData} />}
              {hasDriver && <DriverDetails orderData={orderData} />}
            </div>
          );
        })()}

        {/* Items table + Payment summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ItemsOrdered orderData={orderData} />
          </div>
          <PaymentSummary orderData={orderData} />
        </div>
      </div>

      <BaseModal
        visible={otpModalOpen}
        onHide={handleCloseOtpModal}
        title={otpVerified ? null : "Verify Pickup OTP"}
        width="28rem"
        footer={
          otpVerified ? (
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleCloseOtpModal}
                className="px-5 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleProceedToPayment}
                className="px-6 py-2.5 rounded-lg font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                Proceed to Payment
              </button>
            </div>
          ) : (
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCloseOtpModal}
                className="px-5 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOtp}
                disabled={otpVerifying || !otpData.otp || otpData.otp.length < 4}
                className={`px-5 py-2.5 rounded-lg font-medium text-white transition-colors ${
                  otpVerifying || !otpData.otp || otpData.otp.length < 4
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                {otpVerifying ? "Verifying..." : "Verify"}
              </button>
            </div>
          )
        }
      >
        {otpVerified ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
              <CircleCheckBig size={36} className="text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">OTP Verified Successfully</h3>
            <p className="text-sm text-gray-500 text-center">
              The pickup OTP has been verified. The order status has been updated.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-sm text-gray-600 text-center">
              Enter the OTP provided by the customer to confirm pickup
            </p>
            <CustomOtpInput
              name="otp"
              data={otpData}
              onChange={handleOtpChange}
              length={4}
              ignoreLabel
            />
          </div>
        )}
      </BaseModal>

      <BaseModal
        visible={paymentModalOpen}
        onHide={handleClosePaymentModal}
        title={paymentConfirmed ? null : "Confirm Payment"}
        width="28rem"
        footer={
          paymentConfirmed ? (
            <div className="flex justify-center">
              <button
                onClick={handleClosePaymentModal}
                className="px-6 py-2.5 rounded-lg font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleClosePaymentModal}
                disabled={paymentProcessing}
                className="px-5 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={paymentProcessing}
                className={`px-5 py-2.5 rounded-lg font-medium text-white transition-colors ${
                  paymentProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                {paymentProcessing ? "Processing..." : "Confirm Payment"}
              </button>
            </div>
          )
        }
      >
        {paymentConfirmed ? (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
              <CircleCheckBig size={36} className="text-green-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Payment Processed
            </h3>
            <p className="text-sm text-gray-500 text-center">
              The order payment has been processed successfully.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center">
              <CreditCard size={28} className="text-primary" />
            </div>
            <p className="text-sm text-gray-600 text-center">
              Confirm the payment for this order. This will finalize the
              transaction and settle the payout.
            </p>
          </div>
        )}
      </BaseModal>
    </AutoSkeleton>
  );
}
