// src/components/common/UserProfileDropdown.jsx
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import {
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaQuestionCircle,
  FaChartLine,
  FaRobot,
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useUserProfile } from '../../context/UserProfileContext';

const UserProfileDropdown = ({ signOut, onClose }) => {
  const dropdownRef = useRef(null);
  const { userProfile, isLoadingProfile, profileError } = useUserProfile();

  // Click-outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Helper for avatar fallback
  const avatar =
    userProfile?.avatar_url ||
    'https://placehold.co/150/00bf8b/FFFFFF?text=AVATAR';
  const displayName = userProfile?.full_name || userProfile?.email || 'User';
  const displayRole = userProfile?.role
    ? userProfile.role.replace('_', ' ').toUpperCase()
    : 'USER';

  if (isLoadingProfile) {
    return (
      <div className="absolute right-0 mt-2 w-64 bg-black/80 backdrop-blur-lg border border-mid-gray rounded-lg shadow-xl p-4 text-sm text-white/90 z-40">
        Loading profile...
      </div>
    );
  }
  if (profileError) {
    return (
      <div className="absolute right-0 mt-2 w-64 bg-black/80 backdrop-blur-lg border border-mid-gray rounded-lg shadow-xl p-4 text-sm text-red-400 z-40">
        Error loading profile.
      </div>
    );
  }

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 mt-2 w-64 bg-black/80 backdrop-blur-lg border border-mid-gray rounded-lg shadow-xl p-4 text-sm text-white/90 z-40"
    >
      <div className="flex items-center border-b border-mid-gray pb-3 mb-3">
        <img
          src={avatar}
          alt="User Avatar"
          className="w-12 h-12 rounded-full object-cover border-2 border-teal-500 mr-3"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/150/00bf8b/FFFFFF?text=AVATAR';
          }}
        />
        <div>
          <p className="font-bold text-white">{displayName}</p>
          <span className="inline-block px-2 py-0.5 rounded bg-gradient-to-r from-cyan-700 to-teal-500 text-xs font-bold text-white shadow uppercase tracking-wide mt-1">
            {displayRole}
          </span>
        </div>
      </div>
      <NavLink
        to="/dashboard/profile"
        className="flex items-center p-2 rounded-md hover:bg-mid-gray transition-colors mb-1 text-white/90"
        onClick={onClose}
      >
        <FaUserCircle className="mr-3" /> My Profile
      </NavLink>
      <NavLink
        to="/dashboard/settings"
        className="flex items-center p-2 rounded-md hover:bg-mid-gray transition-colors mb-1 text-white/90"
        onClick={onClose}
      >
        <FaCog className="mr-3" /> Settings
      </NavLink>
      {(userProfile?.role === 'admin' ||
        userProfile?.role === 'super_admin') && (
        <NavLink
          to="/admin"
          className="flex items-center p-2 rounded-md hover:bg-mid-gray transition-colors mb-1 text-white/90"
          onClick={onClose}
        >
          <FaChartLine className="mr-3" />
          {userProfile.role === 'super_admin' ? 'Super Admin' : 'Admin Panel'}
        </NavLink>
      )}
      <NavLink
        to="/ollama"
        className="flex items-center p-2 rounded-md hover:bg-mid-gray transition-colors mb-1 text-white/90"
        onClick={onClose}
      >
        <FaRobot className="mr-3" /> Agent Chat
      </NavLink>
      <NavLink
        to="/help"
        className="flex items-center p-2 rounded-md hover:bg-mid-gray transition-colors mb-1 text-white/90"
        onClick={onClose}
      >
        <FaQuestionCircle className="mr-3" /> Help & Support
      </NavLink>
      <button
        onClick={() => {
          signOut();
          onClose();
        }}
        className="flex items-center w-full p-2 rounded-md bg-red-600 hover:bg-red-700 text-white mt-3 transition-colors"
      >
        <FaSignOutAlt className="mr-3" /> Sign Out
      </button>
    </motion.div>
  );
};

UserProfileDropdown.propTypes = {
  signOut: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UserProfileDropdown;
