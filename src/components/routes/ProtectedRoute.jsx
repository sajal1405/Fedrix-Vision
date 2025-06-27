// src/components/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUserProfile } from '../../context/UserProfileContext';
import RouteLoader from './RouteLoader';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser, isLoading } = useAuth();
  const { userProfile, isLoadingProfile } = useUserProfile();

  // Loader animation while checking session/profile
  if (isLoading || isLoadingProfile) return <RouteLoader />;

  // Not authenticated: redirect to login
  if (!currentUser) return <Navigate to="/login" replace />;

  // Role-based restriction (optional)
  if (requiredRole && userProfile?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
