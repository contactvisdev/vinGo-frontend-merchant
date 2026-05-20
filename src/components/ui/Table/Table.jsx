import React from "react";
import { SkeletonLoader } from "../Skeleton/Skeleton";
import Pagination from "./Pagination";

const Table = ({
  columns = [],
  data = [],
  loading = false,
  skeletonRows = 5,
  emptyMessage = "No data available",
  emptyIcon: EmptyIcon = null,
  pagination = null,
  onPageChange = () => {},
  className = "",
  headerClassName = "",
  bodyClassName = "",
  rowClassName = "",
  renderRow = null,
}) => {
  // Helper function to get responsive classes for hidden columns
  const getHiddenClass = (column) => {
    if (!column.hidden) return "";
    if (column.hidden === "lg") return "hidden lg:table-cell";
    if (column.hidden === "md") return "hidden md:table-cell";
    if (column.hidden === true) return "hidden md:table-cell";
    return column.hidden; // Allow custom class string
  };

  // Render empty state
  if (!loading && (!data || data.length === 0)) {
    return (
      <div className={`overflow-x-auto border border-gray-200 rounded-lg flex flex-col ${className}`}>
        <table className="min-w-full text-left border-collapse">
          <thead className={`text-black text-sm bg-gray-100 ${headerClassName}`}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key || column.label || index}
                  className={`p-2 sm:p-3 ${column.headerClassName || ""} ${getHiddenClass(column)}`}
                >
                  {column.label || column.header}
                </th>
              ))}
            </tr>
          </thead>
        </table>
        <div className="w-full flex-1 flex flex-col items-center justify-center py-16 px-4">
          {EmptyIcon && (
            <div className="bg-gray-100 rounded-full p-6 mb-6">
              <EmptyIcon size={64} className="text-gray-400" />
            </div>
          )}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {emptyMessage}
          </h3>
        </div>
      </div>
    );
  }

  // Render table with data (or skeleton when loading)
  return (
    <>
      <div className={`overflow-x-auto ${className}`}>
        <table className="min-w-full text-left border-collapse">
          <thead className={`text-black text-sm bg-gray-100 ${headerClassName}`}>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key || column.label || index}
                  className={`p-2 sm:p-3 ${column.headerClassName || ""} ${getHiddenClass(column)}`}
                >
                  {column.label || column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={bodyClassName}>
            {loading
              ? Array.from({ length: skeletonRows }, (_, rowIndex) => (
                  <tr key={rowIndex} className={`border-b border-gray-200 ${rowClassName}`}>
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`p-2 sm:p-3 ${getHiddenClass(column)} ${column.cellClassName || ""}`}
                      >
                        <SkeletonLoader variant="text" className="h-4 w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              : data.map((row, rowIndex) => {
                  if (renderRow) {
                    return renderRow(row, rowIndex);
                  }
                  return (
                    <tr
                      key={row.id || row._id || rowIndex}
                      className={`border-b border-gray-200 ${rowClassName}`}
                    >
                      {columns.map((column, colIndex) => {
                        const cellValue =
                          column.render
                            ? column.render(row, rowIndex)
                            : column.accessor
                            ? typeof column.accessor === "function"
                              ? column.accessor(row)
                              : row[column.accessor]
                            : null;

                        return (
                          <td
                            key={colIndex}
                            className={`p-2 sm:p-3 ${getHiddenClass(column)} ${column.cellClassName || ""}`}
                          >
                            {cellValue}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      {!loading && pagination && (
        <Pagination
          currentPage={pagination.currentPage || 1}
          totalPages={pagination.totalPages || 1}
          totalItems={pagination.totalItems || 0}
          pageSize={pagination.limit || pagination.pageSize || 10}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
};

export default Table;
