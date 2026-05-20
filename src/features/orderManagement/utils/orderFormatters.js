import { formatCurrency as formatCurrencyFromHelpers } from "@/helpers/formatters";

export const formatCurrency = formatCurrencyFromHelpers;

export const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDeliveryAddress = (dropLocation = {}, pickupLocation = {}) => {
  if (dropLocation?.address_line1 && dropLocation?.address_line2) {
    return `${dropLocation.address_line1}, ${dropLocation.address_line2}, ${dropLocation.city || ""}, ${dropLocation.state || ""}`;
  }
  if (dropLocation?.city && dropLocation?.state) {
    return `${dropLocation.city}, ${dropLocation.state}`;
  }
  return pickupLocation?.complete_address || "N/A";
};

export const formatOrderId = (orderId, fallbackId) => {
  const id = orderId || fallbackId;
  return id ? `#${id.slice(-8)}` : "#N/A";
};

export const formatCustomerName = (customerName) => {
  if (
    customerName &&
    customerName !== "null null" &&
    customerName.trim() !== "" &&
    customerName !== "null"
  ) {
    return customerName;
  }
  return "N/A";
};
