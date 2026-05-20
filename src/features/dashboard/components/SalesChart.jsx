import { useSalesChart } from "../hooks";
import ChartContainer from "./ChartContainer";
import DateRangePicker from "./DateRangePicker";
import { AutoSkeleton } from "@/components/ui/Skeleton";

export default function SalesChart() {
  const {
    chartRef,
    chartInstance,
    chartData,
    activeView,
    range,
    pendingRange,
    calendarVisible,
    rangeRef,
    loadingChart,
    handleViewChange,
    toggleCalendar,
    handleDateRangeChange,
    handlePrevPeriod,
    handleNextPeriod,
    canGoNext,
  } = useSalesChart();

  return (
    <AutoSkeleton loading={loadingChart} config={{ animation: "shimmer" }}>
      <div className="w-full mx-auto p-4 sm:p-6 bg-white rounded-2xl border border-gray-200">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
          <h2 className="font-medium text-black text-xl sm:text-2xl">
            Sales & Order Trends
          </h2>

          {/* Date Range */}
          <DateRangePicker
            range={range}
            pendingRange={pendingRange}
            calendarVisible={calendarVisible}
            rangeRef={rangeRef}
            onToggle={toggleCalendar}
            onDateChange={handleDateRangeChange}
            onPrev={handlePrevPeriod}
            onNext={handleNextPeriod}
            isNextDisabled={!canGoNext}
          />

          {/* Toggle Buttons */}
          <div className="flex gap-10 rounded-lg p-1 mt-2 sm:mt-0">
            <button
              onClick={() => handleViewChange("weekly")}
              className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                activeView === "weekly"
                  ? "bg-primary text-white"
                  : "text-[#A6A6A6] hover:text-gray-900 border border-[#E0E0E0]"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => handleViewChange("monthly")}
              className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                activeView === "monthly"
                  ? "bg-primary text-white"
                  : "text-[#A6A6A6] hover:text-gray-900 border border-[#E0E0E0]"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="w-full" style={{ height: "250px", minHeight: "250px" }}>
          {loadingChart ? (
            <div className="w-full h-full rounded-xl bg-gray-50 border border-gray-100" />
          ) : (
            <ChartContainer
              chartData={chartData}
              chartRef={chartRef}
              chartInstanceRef={chartInstance}
              loading={loadingChart}
            />
          )}
        </div>
      </div>
    </AutoSkeleton>
  );
}
