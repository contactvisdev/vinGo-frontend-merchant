import { useMemo } from "react";
import {
  TIMELINE_STATUSES,
  PICKUP_TIMELINE_STATUSES,
  MERCHANT_UPDATABLE_STATUSES,
  CATEGORY_LABEL_OVERRIDES,
} from "@features/orderManagement/constants";

export const useOrderTimeline = (
  timeline = [],
  timelineLoading = null,
  orderType = "delivery",
  categorySlug = "restaurant",
) => {
  const timelineStatuses = useMemo(() => {
    const base =
      orderType?.toLowerCase() === "pickup" ? PICKUP_TIMELINE_STATUSES : TIMELINE_STATUSES;
    const overrides = CATEGORY_LABEL_OVERRIDES[categorySlug] || {};
    if (Object.keys(overrides).length === 0) return base;
    return base.map((status) =>
      overrides[status.key]
        ? { ...status, label: overrides[status.key] }
        : status,
    );
  }, [orderType, categorySlug]);

  const completedStatuses = useMemo(() => {
    return new Set(timeline.map((t) => t.status?.toLowerCase()));
  }, [timeline]);

  const currentStatusIndex = useMemo(() => {
    for (let i = timelineStatuses.length - 1; i >= 0; i--) {
      if (completedStatuses.has(timelineStatuses[i].key)) {
        return i;
      }
    }
    return -1;
  }, [completedStatuses, timelineStatuses]);

  const getStatusItemProps = (statusItem, index) => {
    const statusInTimeline = completedStatuses.has(statusItem.key);
    const isCurrent = index === currentStatusIndex;
    const isCompleted = statusInTimeline && !isCurrent;
    const isClickable =
      index === currentStatusIndex + 1 &&
      !timelineLoading &&
      MERCHANT_UPDATABLE_STATUSES.includes(statusItem.key);
    const isLoading =
      timelineLoading === statusItem.key &&
      statusItem.key !== "reached_drop" &&
      statusItem.key !== "picked_up" &&
      statusItem.key !== "delivered";

    return {
      statusInTimeline,
      isCurrent,
      isCompleted,
      isClickable,
      isLoading,
    };
  };

  return {
    completedStatuses,
    currentStatusIndex,
    getStatusItemProps,
    timelineStatuses,
  };
};
