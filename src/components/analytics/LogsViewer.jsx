// src/components/analytics/LogsViewer.jsx
import React from 'react';
import { FaListAlt } from 'react-icons/fa';

const LogsViewer = () => (
  <div className="bg-dark-gray/70 rounded-xl p-6 border border-mid-gray shadow">
    <div className="flex items-center gap-2 mb-3 text-teal-300">
      <FaListAlt /> <span className="font-bold">Logs Viewer</span>
    </div>
    <ul className="text-white/80 text-xs max-h-48 overflow-auto">
      <li>[2024-06-25 10:00] User X logged in.</li>
      <li>[2024-06-25 10:05] Agent Y replied to user Z.</li>
      <li>[2024-06-25 10:15] Campaign ABC updated.</li>
      {/* Fetch real logs from Supabase as needed */}
    </ul>
  </div>
);

export default LogsViewer;
