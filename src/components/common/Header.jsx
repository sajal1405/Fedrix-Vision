import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { UserProfileContext } from "../../context/UserProfileContext";
import { motion } from "framer-motion";
import { supabase } from "../../supabaseClient";

const Header = () => {
  const { logout } = useContext(AuthContext);
  const { profile, logoutProfile } = useContext(UserProfileContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    logoutProfile();
    navigate("/login");
  };

  return (
    <motion.header
      className="w-full flex items-center justify-between px-8 py-4 border-b border-white/10 backdrop-blur-xl bg-white/5 z-20"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-lg font-bold text-fedrix tracking-wide">
        Fedrix Vision
      </div>

      <div className="flex items-center gap-4">
        {/* Tier badge */}
        <div className="text-white/80 text-xs bg-fedrix/10 px-3 py-1 rounded-full border border-fedrix uppercase tracking-wide">
          {profile?.tier || "client"}
        </div>

        {/* Avatar */}
        {profile?.avatar && (
          <img
            src={profile.avatar}
            alt="avatar"
            className="w-10 h-10 rounded-full border-2 border-fedrix shadow-lg object-cover"
          />
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-white/60 text-xs border border-white/20 px-3 py-1 rounded-md hover:bg-fedrix/10 hover:text-white transition-all"
        >
          Logout
        </button>
      </div>
    </motion.header>
  );
};

export default Header;
