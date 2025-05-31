// src/components/analytics/PerformanceCharts.js

import React from "react";
import CampaignAnalytics from "./CampaignAnalytics";
import WebAnalytics from "./WebAnalytics";

const PerformanceCharts = () => {
  return (
    <div style={{ marginTop: "2rem" }}>
      <CampaignAnalytics />
      <WebAnalytics />
    </div>
  );
};

export default PerformanceCharts;
