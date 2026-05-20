export const formatCurrency = (value) => {
  if (!value && value !== 0) return "$0";
  const numValue = typeof value === "string" ? parseFloat(value) : value;
  return `$${numValue.toLocaleString("en-US", { minimumFractionDigits: numValue % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}`;
};


export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber || typeof accountNumber !== "string") return "—";
  const trimmed = accountNumber.trim();
  if (!trimmed) return "—";
  if (trimmed.length < 4) return "****";
  return `****${trimmed.slice(-4)}`;
};

export const formatDate = (date) => {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return "";

  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
};

export const formatLocaleDateTime = (date) => {
  if (!date) return "N/A";

  const d = new Date(date);
  if (isNaN(d.getTime())) return "N/A";

  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/**
 * Format date for display (e.g. "Jan 15, 2025" or "Mon, Jan 15, 2025")
 * @param {string|Date} createdAt
 * @param {{ includeWeekday?: boolean }} [options]
 * @returns {string}
 */
export const formatReviewDate = (createdAt, options = {}) => {
  if (!createdAt) return "N/A";
  const d = createdAt instanceof Date ? createdAt : new Date(createdAt);
  if (isNaN(d.getTime())) return "N/A";

  return d.toLocaleDateString(undefined, {
    ...(options.includeWeekday && { weekday: "short" }),
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Format time for display (e.g. "2:30 PM")
 * @param {string|Date} createdAt
 * @returns {string}
 */
export const formatReviewTime = (createdAt) => {
  if (!createdAt) return "";
  const d = createdAt instanceof Date ? createdAt : new Date(createdAt);
  if (isNaN(d.getTime())) return "";

  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
