// src/components/auth/ProtectedRoute.js

import React from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;

  if (
    requiredRole &&
    currentUser.role !== requiredRole &&
    !(currentUser.role === "super_admin" && requiredRole === "admin")
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
