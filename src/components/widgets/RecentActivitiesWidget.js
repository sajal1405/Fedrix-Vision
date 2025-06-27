// src/components/widgets/RecentActivitiesWidget.js
import React, { useState, useEffect } from 'react';
import { FaComments, FaBolt } from 'react-icons/fa';

const mockupActivities = [
  {
    id: 1,
    action: 'completed',
    task_title: 'Fix UI bug',
    created_at: '2025-06-26T10:30:00',
    user_name: 'John Doe',
  },
  {
    id: 2,
    action: 'assigned',
    task_title: 'Develop new feature',
    created_at: '2025-06-25T15:45:00',
    user_name: 'Jane Smith',
  },
  {
    id: 3,
    action: 'started',
    task_title: 'Create database schema',
    created_at: '2025-06-24T12:00:00',
    user_name: 'Alex Johnson',
  },
  {
    id: 4,
    action: 'completed',
    task_title: 'Write unit tests',
    created_at: '2025-06-23T17:00:00',
    user_name: 'Sarah Williams',
  },
  {
    id: 5,
    action: 'assigned',
    task_title: 'Review pull request',
    created_at: '2025-06-22T10:00:00',
    user_name: 'Michael Brown',
  },
];

const RecentActivitiesWidget = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mocking loading time before showing data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate loading time
  }, []);

  return (
    <div className="glassy-tile rounded-3xl p-7 shadow-xl border border-purple-200/20 bg-gradient-to-br from-purple-900/60 via-indigo-900/30 to-purple-800/50 backdrop-blur-lg relative overflow-hidden animate-fade-in">
      <div className="flex items-center gap-3 mb-3">
        <FaComments className="text-purple-300 text-2xl animate-glow" />
        <span className="text-lg font-semibold text-purple-100">Recent Activity</span>
      </div>
      <div className="flex flex-col gap-2">
        {loading ? (
          <div className="text-white/40 italic px-3 py-2">Loading...</div>
        ) : mockupActivities.length === 0 ? (
          <div className="text-white/40 italic px-3 py-2">No recent activity.</div>
        ) : (
          mockupActivities.map((a) => (
            <div key={a.id} className="flex items-center gap-3 text-white/80 p-2 rounded-xl hover:bg-white/5 transition group">
              <span className="text-xl">
                <FaBolt className="text-amber-400" />
              </span>
              <span className="flex-1">
                {a.user_name} {a.action} {a.task_title}
              </span>
              <span className="text-xs text-cyan-300 group-hover:text-white/70">
                {new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivitiesWidget;
