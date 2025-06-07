// src/components/analytics/WebAnalytics.js

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { supabase } from "../../supabaseClient";

const WebAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from("page_visits")
        .select("page, visits")
        .order("visits", { ascending: false });
      setRows(data || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const data = {
    labels: rows.map((r) => r.page),
    datasets: [
      {
        label: "Page Visits",
        data: rows.map((r) => r.visits),
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

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (rows.length === 0) {
    return <div>No analytics data available.</div>;
  }

  return (
    <div style={{ background: "#111", padding: "1.5rem", borderRadius: "12px", marginBottom: "2rem" }}>
      <h3 style={{ marginBottom: "1rem" }}>📊 Website Page Visits</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default WebAnalytics;
