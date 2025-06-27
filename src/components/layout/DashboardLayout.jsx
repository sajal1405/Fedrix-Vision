// src/components/layout/DashboardLayout.jsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { useAuth } from '../../context/AuthContext';
import { useUserProfile } from '../../context/UserProfileContext';
import { useClientContext } from '../../context/ClientContext';

const HEADER_HEIGHT = '5rem'; // Adjust if your header is a different height
const FOOTER_HEIGHT = '3rem'; // Adjust if your footer is a different height

const DashboardLayout = () => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const { userProfile, isLoadingProfile, profileError } = useUserProfile();
  const { selectedClient } = useClientContext();

  // Loading spinner until both contexts are ready
  if (authLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black-ops text-white">
        <div>
          <div className="loader mb-4" />
          <div>Authenticating...</div>
        </div>
      </div>
    );
  }

  // If user not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If userProfile errored
  if (profileError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black-ops text-white">
        <div className="text-red-500">
          {profileError.message ||
            'User profile error. Please contact support.'}
        </div>
      </div>
    );
  }

  // If userProfile is missing after loading, show an error (shouldn't happen)
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black-ops text-white">
        <div>
          <div className="text-red-500">
            User profile not found. Please contact support.
          </div>
        </div>
      </div>
    );
  }

  // Main layout
  return (
    <div className="bg-black-ops min-h-screen flex flex-col">
      <Header />
      <div
        className="flex flex-1 pt-20"
        style={{
          minHeight: `calc(100vh - ${FOOTER_HEIGHT})`,
        }}
      >
        <Sidebar />
        <main
          className="flex-1 overflow-y-auto p-4 md:p-6"
          style={{
            maxHeight: `calc(100vh - ${HEADER_HEIGHT} - ${FOOTER_HEIGHT})`,
            minHeight: '0',
          }}
        >
          <Outlet context={{ client: selectedClient, userProfile }} />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
