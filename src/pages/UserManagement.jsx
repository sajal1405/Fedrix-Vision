import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { UserProfileContext } from '../context/UserProfileContext';

const UserManagement = () => {
  const { profile } = useContext(UserProfileContext);
  const tier = profile?.tier || 'guest';

  if (tier !== 'admin' && tier !== 'superadmin') {
    return (
      <div className="p-6 text-red-400 text-center" data-testid="restricted">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-xl font-semibold"
        >
          🚫 Access Restricted
        </motion.h2>
        <p className="text-white/60 mt-2">You don’t have permission to view this page.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="text-white text-2xl font-bold mb-4" data-testid="title">
        👥 User Management
      </h2>
      <div className="bg-white/5 p-6 border border-white/10 rounded-xl shadow-lg" data-testid="user-list">
        List of users will appear here.
      </div>
    </motion.div>
  );
};

export default UserManagement;
