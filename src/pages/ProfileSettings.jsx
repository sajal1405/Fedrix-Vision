import React from "react";
import { motion } from "framer-motion";

const ProfileSettings = () => (
  <motion.div
    className="p-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <h2 className="text-white text-2xl font-bold mb-4">Profile Settings</h2>
    <p className="text-white/70">Coming soon...</p>
  </motion.div>
);

export default ProfileSettings;
