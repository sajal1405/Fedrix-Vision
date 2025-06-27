import React, { useContext } from "react";
import { UserProfileContext } from "../context/UserProfileContext";
import { AuthContext } from "../context/AuthContext";
import { SidebarContext } from "../context/SidebarContext";
import { motion } from "framer-motion";
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
  const { profile } = useContext(UserProfileContext);
  const { user } = useContext(AuthContext);
  const { isOpen } = useContext(SidebarContext);

  const firstName = profile?.name?.split(" ")[0] || "User";

  return (
    <div className="dashboard-wrapper">
      <div className={`dashboard-main ${isOpen ? 'ml-[220px]' : 'ml-0'}`}>
        <div className="dashboard-content space-y-10">
          <motion.div
            className="text-white text-2xl font-semibold tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            👋 Welcome back, <span className="text-gray-300">{firstName}</span>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Projects"
              value="12"
              description="Active"
              icon={CheckSquareIcon}
            />
            <StatCard
              title="Clients"
              value="8"
              description="Engaged"
              icon={UsersIcon}
            />
            <StatCard
              title="Revenue"
              value="$24k"
              description="This Month"
              icon={DollarSignIcon}
            />
            <StatCard
              title="Rating"
              value="4.9"
              description="Average"
              icon={StarIcon}
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

        <footer className="text-center mt-10 text-white/30 text-sm">
          ⓒ {new Date().getFullYear()} Fedrix MediaLab. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
