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
              gradient="from-fuchsia-600/60 to-pink-800/60"
            />
            <StatCard
              title="Clients"
              value="8"
              description="Engaged"
              icon={UsersIcon}
              gradient="from-violet-600/60 to-indigo-800/60"
            />
            <StatCard
              title="Revenue"
              value="$24k"
              description="This Month"
              icon={DollarSignIcon}
              gradient="from-emerald-600/60 to-teal-800/60"
            />
            <StatCard
              title="Rating"
              value="4.9"
              description="Average"
              icon={StarIcon}
              gradient="from-orange-600/60 to-amber-800/60"
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
