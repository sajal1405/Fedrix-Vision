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
              gradient="from-fuchsia-500/40 to-pink-700/40"
            />
            <StatCard
              title="Clients"
              value="8"
              description="Engaged"
              icon={UsersIcon}
              gradient="from-violet-500/40 to-indigo-700/40"
            />
            <StatCard
              title="Revenue"
              value="$24k"
              description="This Month"
              icon={DollarSignIcon}
              gradient="from-emerald-500/40 to-teal-700/40"
            />
            <StatCard
              title="Rating"
              value="4.9"
              description="Average"
              icon={StarIcon}
              gradient="from-orange-500/40 to-amber-700/40"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
            <div className="lg:col-span-2">
              <AIChatWidget className="h-full" />
            </div>
            <RecentActivityFeed className="h-full" />
          </div>

      <KanbanWidget />
    </div>
  );
};

export default Dashboard;
