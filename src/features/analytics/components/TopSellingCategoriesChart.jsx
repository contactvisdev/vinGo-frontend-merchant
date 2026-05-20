import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { chart as chartColors } from "@/helpers/constants/themeColors";

Chart.register(...registerables);

export default function TopSellingCategoriesChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !data) return;

    const ctx = chartRef.current.getContext("2d");

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Units Sold",
            data: data.values,
            backgroundColor: data.colors,
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: 80,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            padding: 12,
            callbacks: {
              label: function (context) {
                return `${context.label}: ${context.parsed.y} units`;
              },
            },
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
            beginAtZero: true,
            ticks: {
              color: chartColors.tick,
            },
            grid: {
              color: chartColors.grid,
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
        Top-Selling Categories
      </h3>
      <div style={{ height: "300px" }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}

