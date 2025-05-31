// src/components/analytics/WebAnalytics.js

import React from "react";
import { Bar } from "react-chartjs-2";

const WebAnalytics = () => {
  const data = {
    labels: ["Landing", "Blog", "About", "Services", "Contact"],
    datasets: [
      {
        label: "Page Visits",
        data: [920, 650, 480, 760, 300],
        backgroundColor: "#6f0c8a",
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
      <h3 style={{ marginBottom: "1rem" }}>📊 Website Page Visits</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default WebAnalytics;
