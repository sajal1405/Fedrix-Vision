import React, { useContext, useEffect, useState, forwardRef } from "react";
import { motion } from "framer-motion";
import { HiChevronDown } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { UserProfileContext } from "../../context/UserProfileContext";
import UserProfileDropdown from "./UserProfileDropdown.jsx";
import NotificationsDropdown from "./NotificationsDropdown.jsx";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import HologramTitle from "./HologramTitle.jsx";
import logo from "../../assets/fedrix.svg";

const Header = forwardRef((props, ref) => {
  const { profile, logoutProfile } = useContext(UserProfileContext);
  const location = useLocation();

  const { logout } = useAuth();
  const navigate = useNavigate();
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

  const [dateTime, setDateTime] = useState(new Date());
  const [openProfile, setOpenProfile] = useState(false);

  const handleSignOut = () => {
    logout();
    logoutProfile();
    navigate('/login');
  };


  useEffect(() => {
    const t = setInterval(() => setDateTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.header
      ref={ref}
      className="fixed top-0 left-0 right-0 w-full flex items-center justify-between px-8 py-4 border-b border-white/10 backdrop-blur-xl bg-white/5 z-40"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center gap-4">
        <img src={logo} alt="Fedrix" className="h-8 w-8" />
        <span className="font-semibold">
          <span className="text-transparent bg-gradient-to-r from-cyan-300 to-teal-400 bg-clip-text">Vision</span>{' '}
          <span className="text-white">Suite</span>
        </span>
        <HologramTitle title={title} />
      </div>

      <div className="flex items-center gap-4 relative">
        <span className="text-xs text-white/80 font-mono">
          {dateTime.toLocaleString()}
        </span>
        <NotificationsDropdown />

        <div className="text-white/80 text-xs bg-gray-700/10 px-3 py-1 rounded-full border border-gray-700 uppercase tracking-wide">
          {tier}
        </div>
        <div className="relative">
          <button
            onClick={() => setOpenProfile((o) => !o)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <img
              src={profile?.avatar || 'https://placehold.co/40/00bf8b/FFFFFF?text=AV'}
              alt="avatar"
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="whitespace-nowrap">{profile?.full_name || profile?.name || profile?.email}</span>
            <HiChevronDown className="text-white" />
          </button>
          {openProfile && (
            <UserProfileDropdown
              signOut={handleSignOut}
              onClose={() => setOpenProfile(false)}
            />
          )}
        </div>
      </div>
    </motion.header>
  );
});

export default Header;
