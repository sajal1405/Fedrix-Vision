import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { UserProfileContext } from "../../context/UserProfileContext";
import { supabase } from "../../supabaseClient";

const UserMenu = () => {
  const { logout } = useContext(AuthContext);
  const { profile, logoutProfile } = useContext(UserProfileContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!profile) return null;

  const firstName = profile.name?.split(" ")[0] || "User";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    logoutProfile();
    navigate("/login");
  };

  const handleSettings = () => {
    navigate("/dashboard/settings");
    setOpen(false);
  };

  return (
    <div className="relative text-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 focus:outline-none"
      >
        <img
          src={profile.avatar}
          alt="avatar"
          className="w-9 h-9 rounded-full border-2 border-fedrix shadow-md object-cover"
        />
        <span className="text-white/80 hidden sm:block">Hi, {firstName}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute right-0 mt-2 w-40 bg-black border border-white/20 rounded-md shadow-xl z-50"
          >
            <button
              onClick={handleSettings}
              className="block w-full text-left px-4 py-2 hover:bg-white/10 text-white/80"
            >
              Profile Settings
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-white/10 text-white/80 border-t border-white/20"
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
