/**
 * Order Management Constants - single source for list, timeline, and status styles
 */

// --- List (Orders page) ---
export const ORDER_STATUS_OPTIONS = [
  { label: "All Status", value: null },
  { label: "Pending", value: "pending" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready", value: "ready" },
  { label: "Picked Up", value: "picked_up" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export const DEFAULT_ORDER_PAGE_SIZE = 10;
export const DEFAULT_SEARCH_DEBOUNCE_DELAY = 500;

export const ORDER_TABLE_COLUMNS = [
  { key: "orderId", label: "Order ID", skeletonClassName: "h-4 w-16" },
  { key: "customer", label: "Customer", skeletonClassName: "h-4 w-24" },
  { key: "drop_location", label: "Drop Location", hidden: "md", skeletonClassName: "h-4 w-20" },
  { key: "status", label: "Status", skeletonClassName: "h-6 w-16 rounded-full" },
  { key: "orderTime", label: "Order Time", hidden: "lg", skeletonClassName: "h-4 w-20", cellClassName: "text-gray-500" },
  { key: "total", label: "Total", skeletonClassName: "h-4 w-12" },
  { key: "action", label: "Action", skeletonClassName: "h-4 w-4" },
];


export const CATEGORY_LABEL_OVERRIDES = {
  grocery: {
    preparing: "Packing",
    ready_for_pickup: "Ready for Pickup",
  },
  pharmacy: {
    preparing: "Processing",
    ready_for_pickup: "Ready for Pickup",
  },
};

export const TIMELINE_STATUSES = [
  { key: "pending", label: "Pending", apiKey: "pending" },
  { key: "preparing", label: "Preparing", apiKey: "preparing" },
  { key: "ready_for_pickup", label: "Ready for Pickup", apiKey: "ready_for_pickup" },
  { key: "picked_up", label: "Picked Up", apiKey: "picked_up" },
  { key: "reached_drop", label: "Reached Drop", apiKey: "reached_drop" },
  { key: "delivered", label: "Delivered", apiKey: "delivered" },
];

export const PICKUP_TIMELINE_STATUSES = [
  { key: "pending", label: "Pending", apiKey: "pending" },
  { key: "preparing", label: "Preparing", apiKey: "preparing" },
  { key: "ready_for_pickup", label: "Ready for Pickup", apiKey: "ready_for_pickup" },
];

export const MERCHANT_UPDATABLE_STATUSES = [
  "pending",
  "preparing",
  "ready_for_pickup",
];

export const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-700",
  "in progress": "bg-blue-100 text-blue-700",
  preparing: "bg-blue-100 text-blue-700",
  at_restaurant: "bg-purple-100 text-purple-700",
  ready_for_pickup: "bg-purple-100 text-purple-700",
  ready: "bg-green-100 text-green-700",
  picked_up: "bg-yellow-100 text-yellow-700",
  "out for delivery": "bg-yellow-100 text-yellow-700",
  reached_drop: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  merchant_rejected: "bg-red-100 text-red-700",
  Pending: "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Ready: "bg-green-100 text-green-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

/** Alias for list page (Orders.jsx) */
export const ORDER_STATUS_STYLES = STATUS_STYLES;

export const mapApiStatus = (apiStatus) => {
  const statusMap = {
    pending: "pending",
    at_restaurant: "at_restaurant",
    picked_up: "picked_up",
    reached_drop: "reached_drop",
    delivered: "delivered",
    preparing: "preparing",
    ready_for_pickup: "ready_for_pickup",
  };
  return statusMap[apiStatus?.toLowerCase()] || apiStatus?.toLowerCase();
};

export const capitalizeStatus = (status) => {
  if (!status) return "Unknown";
  const cleaned = status.replace(/^merchant_/i, "");
  return cleaned
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
