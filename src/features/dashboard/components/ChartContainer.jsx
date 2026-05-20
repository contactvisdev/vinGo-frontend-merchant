import { useEffect } from "react";
import { Chart } from "chart.js";
import { primary, chart as chartColors } from "@/helpers/constants/themeColors";

export default function ChartContainer({ chartData, chartRef, chartInstanceRef, loading }) {
  useEffect(() => {
    if (!chartRef?.current || loading) return;
    
    const ctx = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, `${primary.DEFAULT}1A`);
    gradient.addColorStop(1, `${primary.DEFAULT}00`);

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: "Revenue",
            data: chartData.revenues,
            borderColor: primary.DEFAULT,
            backgroundColor: gradient,
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: primary.DEFAULT,
            pointHoverBorderColor: "#fff",
            pointHoverBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: "index" },
        plugins: {
          legend: { display: true },
          tooltip: {
            backgroundColor: primary.DEFAULT,
            titleColor: "#fff",
            bodyColor: "#fff",
            padding: 8,
            displayColors: false,
            callbacks: {
              title: (context) => context[0].label || "",
              label: (context) => {
                if (context.dataset.label === "Revenue") {
                  return `Revenue: $${context.parsed.y}`;
                }
                return `Orders: ${context.parsed.y}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false, drawBorder: false },
            ticks: { color: chartColors.tick, font: { size: 12 } },
          },
          y: {
            min: 0,
            ticks: {
              color: chartColors.tick,
              font: { size: 12 },
              callback: (value) => `$${value}`,
            },
            grid: { color: chartColors.grid, drawBorder: false },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData, chartInstanceRef, loading]);

  return <canvas ref={chartRef}></canvas>;
}

