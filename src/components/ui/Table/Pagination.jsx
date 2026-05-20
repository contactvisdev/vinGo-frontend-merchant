import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = React.memo(function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange = () => {},
}) {
  const safeTotalItems = Math.max(0, totalItems || 0);
  const safePageSize = Math.max(1, pageSize || 1);
  const hasResults = safeTotalItems > 0;
  const startResult = hasResults ? (currentPage - 1) * safePageSize + 1 : 0;
  const endResult = hasResults
    ? Math.min(currentPage * safePageSize, safeTotalItems)
    : 0;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 2xl:text-sm lg:text-xs text-[10px] rounded transition-colors ${
            currentPage === i
              ? "bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center p-0"
              : "bg-transparent text-gray-600 hover:bg-gray-200"
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  // if (totalItems === 0) {
  //   return (
  //     <div className="flex justify-between items-center px-5 py-4">
  //       <div className="text-gray-600 2xl:text-sm lg:text-xs text-[10px]">
  //         No results
  //       </div>
  //     </div>
  //   );
  // }

  const resultsLabel = hasResults
    ? `Showing ${startResult} to ${endResult} of ${safeTotalItems} results`
    : "Showing 0 results";

  return (
    <div className="flex justify-between items-center px-5 py-4">
      <div className="text-gray-600 2xl:text-sm lg:text-xs text-[10px]">
        {resultsLabel}
      </div>
     <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-transparent border-none text-gray-600 2xl:text-sm lg:text-xs text-[10px] rounded transition-colors hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <ChevronLeft size={16} />
          Previous
        </button>

        {renderPageNumbers()}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-transparent border-none text-gray-600 2xl:text-xs lg:text-xs text-[10px] rounded transition-colors hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          Next
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
});

Pagination.displayName = "Pagination";

export default Pagination;

