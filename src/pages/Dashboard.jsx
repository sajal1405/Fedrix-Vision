import React from "react";
import {
  StatCard,
  DollarSignIcon,
  UsersIcon,
  CheckSquareIcon,
  StarIcon,
} from "../components/dashboard/StatCard.jsx";
import AIChatWidget from "../components/dashboard/AIChatWidget.jsx";
import RecentActivityFeed from "../components/dashboard/RecentActivityFeed.jsx";
import KanbanWidget from "../components/widgets/KanbanWidget.js";

const Dashboard = () => {

  return (
    <div className="dashboard-content space-y-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Projects"
              value="12"
              description="Active"
              icon={CheckSquareIcon}
              gradient="from-pink-700/60 to-pink-900/60"
            />
            <StatCard
              title="Clients"
              value="8"
              description="Engaged"
              icon={UsersIcon}
              gradient="from-purple-700/60 to-purple-900/60"
            />
            <StatCard
              title="Revenue"
              value="$24k"
              description="This Month"
              icon={DollarSignIcon}
              gradient="from-amber-600/60 to-amber-800/60"
            />
            <StatCard
              title="Rating"
              value="4.9"
              description="Average"
              icon={StarIcon}
              gradient="from-teal-700/60 to-teal-900/60"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <AIChatWidget />
            </div>
            <RecentActivityFeed />
          </div>

      <KanbanWidget />
    </div>
  );
};

export default Dashboard;
