import React, { useContext } from "react";
import { UserProfileContext } from "../context/UserProfileContext";
import { AuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";
import KanbanBoard from "../components/kanban/KanbanBoard.jsx";
import Calendar from "../components/calendar/Calendar.jsx";
import BlogManager from "../components/blog/BlogManager.jsx";
import modulesData from "../data/roles.json";

const Dashboard = () => {
  const { profile } = useContext(UserProfileContext);
  const { user } = useContext(AuthContext);
  const firstName = profile?.name?.split(" ")[0] || "User";

  const role = user?.role || "guest";
  const allowedModules = modulesData.roles?.[role]?.modules?.map((mod) => mod.id) || [];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-main">
        <div className="dashboard-content space-y-10">

          <motion.div
            data-aos="fade-up"
            className="text-white text-2xl font-semibold tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            👋 Welcome back, <span className="text-fedrix">{firstName}</span>
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
        </div>

        <footer className="text-center mt-10 text-white/30 text-sm">
          ⓒ {new Date().getFullYear()} Fedrix MediaLab. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
