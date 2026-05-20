import { useMemo } from "react";
import { Calendar } from "primereact/calendar";
import { formatDate } from "@/helpers/formatters";

const today = new Date();

// Calendar expects [Date, Date] with both at start of day for correct highlight
function calendarValueFromRange(range) {
  if (!range || !range[0] || !range[1]) return null;
  const start = new Date(range[0]);
  start.setHours(0, 0, 0, 0);
  const end = new Date(range[1]);
  end.setHours(0, 0, 0, 0);
  return [start, end];
}

export default function DateRangePicker({
  range,
  pendingRange,
  calendarVisible,
  rangeRef,
  onToggle,
  onDateChange,
  onPrev,
  onNext,
  isNextDisabled = false,
}) {
  const calendarValue = useMemo(() => {
    if (pendingRange && pendingRange[0]) {
      const start = new Date(pendingRange[0]);
      start.setHours(0, 0, 0, 0);
      const end = pendingRange[1] ? new Date(pendingRange[1]) : null;
      if (end) end.setHours(0, 0, 0, 0);
      return [start, end];
    }
    return calendarValueFromRange(range);
  }, [range, pendingRange]);

  return (
    <div className="flex items-center gap-2 text-sm text-primary flex-wrap">
      <button
        type="button"
        onClick={onPrev}
        className="p-1 rounded hover:bg-gray-100 hover:text-primary-600 disabled:opacity-50 disabled:pointer-events-none"
        aria-label="Previous period"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div className="relative" ref={rangeRef}>
        <span
          className="font-medium text-xs sm:text-sm cursor-pointer"
          onClick={onToggle}
        >
          {range && range[0] && range[1]
            ? `${formatDate(range[0])} to ${formatDate(range[1])}`
            : "Select date range"}
        </span>

        {calendarVisible && (
          <div className="absolute z-50 mt-2 right-0 bg-white shadow-lg border border-gray-200 rounded-lg p-2">
            <Calendar
              inline
              selectionMode="range"
              value={calendarValue}
              onChange={(e) => onDateChange(e.value)}
              maxDate={today}
              dateFormat="dd/mm/yy"
            />
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onNext}
        disabled={isNextDisabled}
        className="p-1 rounded hover:bg-gray-100 hover:text-primary-600 disabled:opacity-50 disabled:pointer-events-none"
        aria-label="Next period"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
}

