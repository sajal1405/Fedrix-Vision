// src/components/analytics/CampaignAnalytics.js

import React from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const CampaignAnalytics = () => {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Campaign ROI",
        data: [4200, 6500, 5800, 7100, 8900, 7600],
        borderColor: "#6f0c8a",
        backgroundColor: "rgba(111, 12, 138, 0.1)",
        tension: 0.3,
        pointRadius: 4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      x: {
        ticks: { color: "#fff" },
        grid: { display: false },
      },
    },
    plugins: {
      legend: { labels: { color: "#fff" } },
    },
  };

  return (
    <div style={{ background: "#111", padding: "1.5rem", borderRadius: "12px", marginBottom: "2rem" }}>
      <h3 style={{ marginBottom: "1rem" }}>📈 Campaign ROI (Monthly)</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default CampaignAnalytics;
