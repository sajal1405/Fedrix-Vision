// src/components/auth/ProtectedRoute.js

import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useUserProfile } from "../../context/UserProfileContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser } = useAuth();
  const { profile } = useUserProfile();
  if (!currentUser) return <Navigate to="/login" replace />;

  const role = profile?.role || currentUser.role;
  if (
    requiredRole &&
    role !== requiredRole &&
    !(role === "super_admin" && requiredRole === "admin")
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};

export default ProtectedRoute;
