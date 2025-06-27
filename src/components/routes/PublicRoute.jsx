// src/components/routes/PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useUserProfile } from '../../context/UserProfileContext';
import RouteLoader from './RouteLoader';

const PublicRoute = ({ children }) => {
  const { currentUser, isLoading } = useAuth();
  const { isLoadingProfile } = useUserProfile();

  if (isLoading || isLoadingProfile) return <RouteLoader />;
  // If logged in, redirect to dashboard
  if (currentUser) return <Navigate to="/dashboard" replace />;
  return children;
};

export default PublicRoute;
