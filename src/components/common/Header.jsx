import React, { useContext } from "react";
import { motion } from "framer-motion";
import { HiMenuAlt3 } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { UserProfileContext } from "../../context/UserProfileContext";
import { SidebarContext } from "../../context/SidebarContext";
import UserMenu from "./UserMenu.jsx";
import HologramTitle from "./HologramTitle.jsx";

const Header = () => {
  const { profile } = useContext(UserProfileContext);
  const location = useLocation();

  const { toggleSidebar } = useContext(SidebarContext);
  const tier = profile?.role || "guest";

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/dashboard/kanban": "Kanban Board",
    "/dashboard/calendar": "Calendar",
    "/dashboard/blog": "Blog",
    "/dashboard/agent": "AI Agent",
    "/dashboard/reminders": "Reminders",
    "/dashboard/clients": "Brands",
    "/dashboard/users": "Users",
    "/dashboard/profile": "Profile",
    "/dashboard/settings": "Settings",
  };
  const title = pageTitles[location.pathname] || "Fedrix Vision";

  return (
    <motion.header
      className="w-full flex items-center justify-between px-8 py-4 border-b border-white/10 backdrop-blur-xl bg-white/5 z-20"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="text-white focus:outline-none">
          <HiMenuAlt3 className="text-2xl" />
        </button>
        <HologramTitle title={title} />
      </div>

      <div className="flex items-center gap-4">
        {/* Tier badge */}
        <div className="text-white/80 text-xs bg-gray-700/10 px-3 py-1 rounded-full border border-gray-700 uppercase tracking-wide">
          {tier}
        </div>
        <UserMenu />
      </div>
    </motion.header>
  );
};

export default Header;
