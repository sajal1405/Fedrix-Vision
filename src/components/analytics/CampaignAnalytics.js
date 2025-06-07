// src/components/analytics/CampaignAnalytics.js

import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";
import { supabase } from "../../supabaseClient";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const CampaignAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("campaign_roi")
        .select("month, roi")
        .order("month", { ascending: true });
      setRows(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const data = {
    labels: rows.map((r) => r.month),
    datasets: [
      {
        label: "Campaign ROI",
        data: rows.map((r) => r.roi),
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

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (rows.length === 0) {
    return <div>No analytics data available.</div>;
  }

  return (
    <div style={{ background: "#111", padding: "1.5rem", borderRadius: "12px", marginBottom: "2rem" }}>
      <h3 style={{ marginBottom: "1rem" }}>📈 Campaign ROI (Monthly)</h3>
      <Line data={data} options={options} />
    </div>
  );
};

export default CampaignAnalytics;
