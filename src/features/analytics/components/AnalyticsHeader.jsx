import { useCallback, useMemo } from "react";
import { RefreshCw } from "lucide-react";
import { CustomDateRangePicker } from "@/components/forms/CustomDateRangePicker";

export default function AnalyticsHeader({
  dateRange,
  onRefresh,
  onDateRangeChange,
  fetching,
}) {
  const today = useMemo(() => new Date(), []);

  const handleDateChange = useCallback(
    ({ value }) => {
      if (value?.from && value?.to) {
        onDateRangeChange(value.from, value.to);
      } else if (value?.from || value?.to) {
        onDateRangeChange(value.from ?? dateRange?.from, value.to ?? dateRange?.to);
      }
    },
    [onDateRangeChange, dateRange],
  );

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center max-w-2xl">
          <label className="whitespace-nowrap mr-2">Filter by Date</label>
          <CustomDateRangePicker
          ignoreLabel
            value={dateRange}
            onChange={handleDateChange}
            maxDateFrom={today}
            maxDateTo={today}
          />
        </div>

        <button
          onClick={onRefresh}
          disabled={fetching}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${fetching ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>
    </div>
  );
}
