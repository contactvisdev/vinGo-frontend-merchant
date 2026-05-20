import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useUpdateOrderDecisionMutation,
  useMarkOrderReadyForPickupMutation,
  useUpdateOrderStatusMutation,
} from "@/store/api/orderApi";
import { MERCHANT_UPDATABLE_STATUSES } from "@features/orderManagement/constants";

export const useOrderOperations = (orderId, refetch) => {
  const profile = useSelector((state) => state?.businessProfile?.profile);
  const merchantId = profile?._id;

  const [updateDecisionMutation] = useUpdateOrderDecisionMutation();
  const [markReadyMutation] = useMarkOrderReadyForPickupMutation();
  const [updateStatusMutation] = useUpdateOrderStatusMutation();

  const [timelineLoading, setTimelineLoading] = useState(null);
  const [decisionLoading, setDecisionLoading] = useState(null);

  const handleStatusUpdate = async (newStatus) => {
    if (!orderId || !merchantId) return;

    if (!MERCHANT_UPDATABLE_STATUSES.includes(newStatus)) {
      return;
    }

    setTimelineLoading(newStatus);
    try {
      if (newStatus === "ready_for_pickup") {
        await markReadyMutation({ orderId, action: "ready" }).unwrap();
      } else {
        await updateStatusMutation({
          orderId,
          status: newStatus,
          merchantId,
        }).unwrap();
      }

      refetch();
    } catch {
      if (import.meta.env.DEV) console.log("Status update failed");
    } finally {
      setTimelineLoading(null);
    }
  };

  const handleOrderAction = async (action) => {
    if (!orderId) return;

    setDecisionLoading(action);
    try {
      await updateDecisionMutation({ orderId, action }).unwrap();
      refetch();
    } catch {
      if (import.meta.env.DEV) console.log("Decision update failed");
    } finally {
      setDecisionLoading(null);
    }
  };

  return {
    handleStatusUpdate,
    handleOrderAction,
    timelineLoading,
    decisionLoading,
  };
};
