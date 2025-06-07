import React, { useContext } from "react";
import { motion } from "framer-motion";
import { UserProfileContext } from "../../context/UserProfileContext";
import UserMenu from "./UserMenu.jsx";

const Header = () => {
  const { profile } = useContext(UserProfileContext);
  const tier = profile?.tier || "guest";
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
          {tier}
        </div>
        <UserMenu />
      </div>
    </motion.header>
  );
};

export default Header;
