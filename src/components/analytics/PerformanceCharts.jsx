// src/components/analytics/PerformanceCharts.jsx
import React from 'react';
import { FaChartLine } from 'react-icons/fa';

const PerformanceCharts = () => (
  <div className="bg-dark-gray/70 rounded-xl p-6 border border-mid-gray shadow">
    <div className="flex items-center gap-2 mb-3 text-teal-300">
      <FaChartLine /> <span className="font-bold">Performance Charts</span>
    </div>
    <div className="text-white/70">
      <p>
        Daily Active Users: <b>321</b>
      </p>
      <p>
        Conversion Rate: <b>23%</b>
      </p>
      {/* Add chart.js or Recharts component here */}
      <div className="mt-4 h-24 bg-mid-gray rounded"></div>
    </div>
  </div>
);

export default PerformanceCharts;
