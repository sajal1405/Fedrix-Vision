// src/components/analytics/CampaignAnalytics.jsx
import React from 'react';
import { FaBullhorn } from 'react-icons/fa';

const CampaignAnalytics = () => (
  <div className="bg-dark-gray/70 rounded-xl p-6 border border-mid-gray shadow">
    <div className="flex items-center gap-2 mb-3 text-teal-300">
      <FaBullhorn /> <span className="font-bold">Campaign Analytics</span>
    </div>
    {/* Demo data; replace with backend data as needed */}
    <ul className="text-white/80">
      <li>
        Total Campaigns: <b>12</b>
      </li>
      <li>
        Active: <b>4</b>
      </li>
      <li>
        Paused: <b>3</b>
      </li>
      <li>
        Conversion Rate: <b>23%</b>
      </li>
    </ul>
  </div>
);

export default CampaignAnalytics;
