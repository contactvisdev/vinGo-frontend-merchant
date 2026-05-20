import { RefreshCcw } from "lucide-react";
import BaseCard from "@/components/ui/Card/Card";
import { CustomDateRangePicker } from "@/components/forms/CustomDateRangePicker";
import { CustomDropdown } from "@/components/forms/CustomDropdown";
import { CustomSearchInput } from "@/components/forms/CustomSearchInput";
import { RATING_OPTIONS } from "@features/review/constants";

export default function ReviewsFilters({
  search,
  dateRange,
  rating,
  isLoading,
  isSearchFocused,
  searchInputRef,
  maxSelectableDate,
  onSearchChange,
  onSearchFocus,
  onSearchBlur,
  onDateRangeChange,
  onRatingChange,
  onResetFilters,
}) {
  return (
    <BaseCard extraClassName="mb-5! py-[1.625rem]! px-6!">
      <div className="flex flex-wrap items-center gap-3">
        <div className="w-55">
          <CustomSearchInput
            ref={searchInputRef}
            name="search"
            placeholder="Search"
            col={12}
            disabled={isLoading && !isSearchFocused}
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
            disabled={isLoading}
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
          disabled={isLoading}
          className={`flex items-center gap-1.5 text-primary-600 hover:text-primary-700 text-sm font-medium whitespace-nowrap ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <RefreshCcw size={14} />
          Refresh
        </button>

        <div className="w-50">
          <CustomDropdown
            placeholder="Select Rating"
            col={12}
            disabled={isLoading}
            options={RATING_OPTIONS}
            optionLabel="label"
            optionValue="value"
            value={rating}
            ignoreLabel={true}
            ignoreError={true}
            onChange={onRatingChange}
            maxHeight="320px"
          />
        </div>
      </div>
    </BaseCard>
  );
}
