import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserProfileContext } from "../context/UserProfileContext";
import { AuthContext } from "../context/AuthContext";
import { SidebarContext } from "../context/SidebarContext";
import { motion } from "framer-motion";
import KanbanBoard from "../components/kanban/KanbanBoard.jsx";
import Calendar from "../components/calendar/Calendar.jsx";
import BlogManager from "../components/blog/BlogManager.jsx";
import AgentDashboard from "../components/ai/AgentDashboard.jsx";
import ReminderList from "../components/reminders/ReminderList.jsx";
import modulesData from "../data/roles.json";

const Dashboard = () => {
  const { profile } = useContext(UserProfileContext);
  const { user } = useContext(AuthContext);
  const { isOpen } = useContext(SidebarContext);


  if (!profile?.name) {
    return <Navigate to="/profile" replace />;
  }

  const firstName = profile.name.split(" ")[0];


  const role = user?.role || "guest";
  const allowedModules = modulesData.roles?.[role]?.modules?.map((mod) => mod.id) || [];

  return (
    <div className="dashboard-wrapper">
      <div className={`dashboard-main ${isOpen ? 'ml-[220px]' : 'ml-0'}`}>
        <div className="dashboard-content space-y-10">

          <motion.div
            data-aos="fade-up"
            className="text-white text-2xl font-semibold tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            👋 Welcome back, <span className="text-gray-300">{firstName}</span>
          </motion.div>

          {allowedModules.includes("kanban") && (
            <motion.div
              data-aos="zoom-in"
              className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-white font-bold mb-3">🗂️ Taskboard</h3>
              <KanbanBoard />
            </motion.div>
          )}

          {allowedModules.includes("calendar") && (
            <motion.div
              data-aos="fade-up"
              className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-white font-bold mb-3">📅 Calendar</h3>
              <Calendar />
            </motion.div>
          )}

          {allowedModules.includes("blog") && (
            <motion.div
              data-aos="fade-up"
              className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-white font-bold mb-3">📝 Blog Manager</h3>
              <BlogManager />
            </motion.div>
          )}

          {allowedModules.includes("agent") && (
            <motion.div
              data-aos="fade-up"
              className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-lg"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="text-white font-bold mb-3">🤖 AI Agent</h3>
              <AgentDashboard />
            </motion.div>
          )}

          <motion.div
            data-aos="fade-up"
            className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-lg"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-white font-bold mb-3">🔔 Reminders</h3>
            <ReminderList />
          </motion.div>
        </div>

        <footer className="text-center mt-10 text-white/30 text-sm">
          ⓒ {new Date().getFullYear()} Fedrix MediaLab. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
