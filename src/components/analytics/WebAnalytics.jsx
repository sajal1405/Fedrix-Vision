// src/components/analytics/WebAnalytics.jsx
import React from 'react';
import { FaGlobe } from 'react-icons/fa';

const WebAnalytics = () => (
  <div className="bg-dark-gray/70 rounded-xl p-6 border border-mid-gray shadow">
    <div className="flex items-center gap-2 mb-3 text-teal-300">
      <FaGlobe /> <span className="font-bold">Web Analytics</span>
    </div>
    <ul className="text-white/80">
      <li>
        Visitors (last 7 days): <b>1,234</b>
      </li>
      <li>
        Bounce Rate: <b>44%</b>
      </li>
      <li>
        Avg. Session: <b>5m 42s</b>
      </li>
    </ul>
  </div>
);

export default WebAnalytics;
