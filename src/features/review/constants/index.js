export const RATING_OPTIONS = [
  { label: "All Ratings", value: null },
  { label: "5 Stars", value: "5" },
  { label: "4 Stars", value: "4" },
  { label: "3 Stars", value: "3" },
  { label: "2 Stars", value: "2" },
  { label: "1 Star", value: "1" },
];

export const DEFAULT_SEARCH_DEBOUNCE_DELAY = 500;

export const DEFAULT_REVIEWS_PAGE_SIZE = 12;

export const REVIEWS_TABLE_COLUMNS = [
  { header: "Customer", accessor: "customer" },
  { header: "Rating", accessor: "rating" },
  { header: "Review", accessor: "review" },
  { header: "Date", accessor: "date" },
  { header: "Action", accessor: "action" },
];
