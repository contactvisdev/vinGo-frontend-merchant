import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Chart, registerables } from "chart.js";
import { useSelector } from "react-redux";
import { useGetSalesChartQuery } from "@/store/api/dashboardApi";

Chart.register(...registerables);

function getWeekStart(d) {
  const date = new Date(d);
  const day = date.getDay();
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getWeekEnd(d) {
  const start = getWeekStart(d);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

function getMonthStart(d) {
  const date = new Date(d);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getMonthEnd(d) {
  const date = new Date(d);
  date.setMonth(date.getMonth() + 1, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

function getCurrentWeekRange() {
  const now = new Date();
  const start = getWeekStart(now);
  let end = getWeekEnd(now);
  if (end > now) {
    end = new Date(now);
    end.setHours(23, 59, 59, 999);
  }
  return [start, end];
}

function getCurrentMonthRange() {
  const now = new Date();
  const start = getMonthStart(now);
  let end = getMonthEnd(now);
  if (end > now) {
    end = new Date(now);
    end.setHours(23, 59, 59, 999);
  }
  return [start, end];
}

function toDateString(d) {
  if (!d) return undefined;
  const date = new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const useSalesChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [activeView, setActiveView] = useState("weekly");
  const [range, setRange] = useState(() => getCurrentWeekRange());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [pendingRange, setPendingRange] = useState(null);
  const rangeRef = useRef(null);

  const getTodayEnd = () => {
    const t = new Date();
    t.setHours(23, 59, 59, 999);
    return t;
  };

  const profile = useSelector((state) => state.businessProfile.profile);

  const queryParams = useMemo(() => {
    if (!profile?._id || !range?.[0] || !range?.[1]) return null;
    return {
      type: activeView,
      merchantId: profile._id,
      startDate: toDateString(range[0]),
      endDate: toDateString(range[1]),
    };
  }, [profile?._id, activeView, range]);

  const { data: salesChart, isLoading, isFetching } = useGetSalesChartQuery(
    queryParams,
    { skip: !queryParams }
  );
  const loadingChart = isLoading || isFetching;

  const chartData = useMemo(() => {
    if (!salesChart?.result?.length) {
      const isWeekly = activeView === "weekly";
      return {
        labels: isWeekly ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["Week 1", "Week 2", "Week 3", "Week 4"],
        revenues: new Array(isWeekly ? 7 : 4).fill(0),
        orders: new Array(isWeekly ? 7 : 4).fill(0),
      };
    }

    if (salesChart.type === "monthly") {
      const resultMap = Object.fromEntries(salesChart.result.map((r) => [r.label, r]));
      const start = new Date(salesChart.startDate);
      const end = new Date(salesChart.endDate);
      end.setHours(23, 59, 59, 999);
      const labels = [], revenues = [], orders = [];

      for (const current = new Date(start); current <= end; current.setDate(current.getDate() + 1)) {
        const label = `${current.getDate()}/${current.getMonth() + 1}`;
        const entry = resultMap[label];
        labels.push(label);
        revenues.push(entry?.totalRevenue || 0);
        orders.push(entry?.totalOrders || 0);
      }
      return { labels, revenues, orders };
    }

    return {
      labels: salesChart.result.map((r) => r.label),
      revenues: salesChart.result.map((r) => r.totalRevenue || 0),
      orders: salesChart.result.map((r) => r.totalOrders || 0),
    };
  }, [salesChart, activeView]);

  const handleViewChange = (view) => {
    setActiveView(view);
    setPendingRange(null);
    setRange(view === "weekly" ? getCurrentWeekRange() : getCurrentMonthRange());
  };

  const toggleCalendar = () => {
    setCalendarVisible((prev) => {
      if (!prev) setPendingRange(null);
      return !prev;
    });
  };

  const handleDateRangeChange = useCallback((newValue) => {
    if (!newValue || !Array.isArray(newValue)) return;
    const start = newValue[0] ? new Date(newValue[0]) : null;
    const end = newValue[1] ? new Date(newValue[1]) : null;
    if (!start) return;
    start.setHours(0, 0, 0, 0);
    // Only one date selected: store as pending so user can pick end date
    if (!end) {
      setPendingRange([start, null]);
      return;
    }
    end.setHours(0, 0, 0, 0);
    const sameDay = start.getTime() === end.getTime();
    if (sameDay) {
      setPendingRange([start, null]); // wait for a different end date
      return;
    }
    const maxEnd = new Date();
    maxEnd.setHours(23, 59, 59, 999);
    const t1 = start.getTime();
    const t2 = end.getTime();
    const startNorm = new Date(Math.min(t1, t2));
    startNorm.setHours(0, 0, 0, 0);
    const endNorm = new Date(Math.max(t1, t2));
    endNorm.setHours(23, 59, 59, 999);
    if (endNorm > maxEnd) endNorm.setTime(maxEnd.getTime());
    setRange([startNorm, endNorm]);
    setPendingRange(null);
    setCalendarVisible(false);
  }, []);

  const canGoNext = useMemo(() => {
    if (!range?.[1]) return false;
    const rangeEnd = new Date(range[1]);
    rangeEnd.setHours(23, 59, 59, 999);
    return rangeEnd.getTime() < getTodayEnd().getTime();
  }, [range]);

  const navigatePeriod = useCallback((direction) => {
    if (direction > 0 && !canGoNext) return;
    setRange((prev) => {
      if (!prev?.[0] || !prev?.[1]) return prev;
      const [start, end] = [new Date(prev[0]), new Date(prev[1])];
      const isWeekly = activeView === "weekly";

      if (isWeekly) {
        start.setDate(start.getDate() + direction * 7);
        end.setDate(end.getDate() + direction * 7);
      } else {
        start.setMonth(start.getMonth() + direction);
        end.setMonth(end.getMonth() + direction);
      }

      if (direction > 0) {
        const maxEnd = getTodayEnd();
        if (end > maxEnd) end.setTime(maxEnd.getTime());
      }
      return [start, end];
    });
  }, [activeView, canGoNext]);

  // Close calendar on outside click
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (!calendarVisible) return;
      if (rangeRef.current && !rangeRef.current.contains(e.target)) {
        setCalendarVisible(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, [calendarVisible]);

  return {
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
    handlePrevPeriod: () => navigatePeriod(-1),
    handleNextPeriod: () => navigatePeriod(1),
    canGoNext,
  };
};
