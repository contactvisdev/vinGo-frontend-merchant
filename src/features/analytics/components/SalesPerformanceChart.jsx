import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { primary, neutral, chart as chartColors } from "@/helpers/constants/themeColors";

Chart.register(...registerables);

export default function SalesPerformanceChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Revenue",
            data: data.revenue,
            borderColor: primary.DEFAULT,
            backgroundColor: `${primary.DEFAULT}1A`,
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            yAxisID: "y",
          },
          {
            label: "Orders",
            data: data.orders,
            borderColor: neutral[800],
            backgroundColor: `${neutral[800]}1A`,
            borderWidth: 2,
            tension: 0.4,
            fill: false,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 15,
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: 12,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: chartColors.tick,
            },
          },
          y: {
            type: "linear",
            display: true,
            position: "left",
            beginAtZero: true,
            ticks: {
              color: chartColors.tick,
              callback: function (value) {
                return "$" + value.toLocaleString();
              },
            },
            grid: {
              color: chartColors.grid,
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            beginAtZero: true,
            ticks: {
              color: chartColors.tick,
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Sales Performance
      </h3>
      <div style={{ height: "300px" }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

