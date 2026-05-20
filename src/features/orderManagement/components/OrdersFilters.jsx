import { RefreshCcw } from "lucide-react";
import BaseCard from "@/components/ui/Card/Card";
import { CustomDateRangePicker } from "@/components/forms/CustomDateRangePicker";
import { CustomDropdown } from "@/components/forms/CustomDropdown";
import { CustomSearchInput } from "@/components/forms/CustomSearchInput";
import { ORDER_STATUS_OPTIONS } from "@features/orderManagement/constants";

export default function OrdersFilters({
  search,
  dateRange,
  status,
  loading,
  isSearchFocused,
  searchInputRef,
  maxSelectableDate,
  onSearchChange,
  onSearchFocus,
  onSearchBlur,
  onDateRangeChange,
  onStatusChange,
  onResetFilters,
}) {
  return (
    <BaseCard extraClassName="mb-5! py-[1.625rem]! px-6!">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-55">
          <CustomSearchInput
            ref={searchInputRef}
            name="search"
            placeholder="Search by order item or customer name"
            extraClassName="placeholder:text-[#A1A1A1]"
            col={12}
            disabled={loading && !isSearchFocused}
            value={search}
            ignoreLabel={true}
            ignoreError={true}
            onChange={onSearchChange}
            onFocus={onSearchFocus}
            onBlur={onSearchBlur}
          />
        </div>

        <div className="w-105">
          <CustomDateRangePicker
            name="dateRange"
            col={12}
            disabled={loading}
            value={dateRange}
            ignoreLabel={true}
            ignoreError={true}
            onChange={onDateRangeChange}
            maxDateFrom={maxSelectableDate}
            maxDateTo={maxSelectableDate}
          />
        </div>

        <button
          onClick={onResetFilters}
          className="flex items-center gap-1.5 text-primary-600 hover:text-primary-700 text-sm font-medium whitespace-nowrap"
        >
          <RefreshCcw size={14} />
          Refresh
        </button>

        <div className="w-50">
          <CustomDropdown
            placeholder="Select Status"
            col={12}
            disabled={loading}
            options={ORDER_STATUS_OPTIONS}
            optionLabel="label"
            optionValue="value"
            value={status}
            ignoreLabel={true}
            ignoreError={true}
            onChange={onStatusChange}
            maxHeight="440px"
          />
        </div>
      </div>
    </BaseCard>
  );
}
