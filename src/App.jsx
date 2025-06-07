import React, { useState, useMemo } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard.jsx";
import KanbanBoard from "./components/kanban/KanbanBoard.jsx";
import Calendar from "./components/calendar/Calendar.jsx";
import BlogManagement from "./pages/BlogManagement.jsx";
import AgentDashboard from "./pages/AgentDashboard.jsx";
import UserManagement from "./components/admin/UserManagement.jsx";
import ProfileSetup from "./pages/ProfileSetup.jsx";
import Profile from "./pages/Profile.jsx";
import ProfileSettings from "./pages/ProfileSettings.jsx";
import { AuthProvider } from "./context/AuthContext";
import { UserProfileProvider } from "./context/UserProfileContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Splash from "./components/common/Splash";
import { SidebarProvider } from "./context/SidebarContext";
import DashboardLayout from "./components/common/DashboardLayout.jsx";
import AnimatedBackground from "./components/common/AnimatedBackground.jsx";
import { AgentAIProvider } from "./context/AgentAIContext";
import AgentDashboard from "./components/ai/AgentDashboard.jsx";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  const router = useMemo(
    () =>
      createBrowserRouter(
        [
          {
            path: '/',
            element: <Navigate to="/login" replace />,
          },
          {
            path: '/login',
            element: <Login />,
          },
          {
            path: '/profile',
            element: <ProfileSetup />,
          },
          {
            path: '/dashboard/profile',
            element: (
              <ProtectedRoute>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard/settings',
            element: (
              <ProtectedRoute>
                <DashboardLayout>
                  <ProfileSettings />
                </DashboardLayout>
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard',
            element: (
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard/kanban',
            element: (
              <ProtectedRoute>
                <DashboardLayout>
                  <KanbanBoard />
                </DashboardLayout>
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard/calendar',
            element: (
              <ProtectedRoute>
                <DashboardLayout>
                  <Calendar />
                </DashboardLayout>
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard/blog',
            element: (
              <ProtectedRoute>
                <DashboardLayout>
                  <BlogManagement />
                </DashboardLayout>
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard/agent',
            element: (

              <ProtectedRoute requiredRole="agent">

                <DashboardLayout>
                  <AgentDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard/users',
            element: (
              <ProtectedRoute requiredRole="superadmin">
                <DashboardLayout>
                  <UserManagement />
                </DashboardLayout>
              </ProtectedRoute>
            ),
          },
        ],
        {
          future: {
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          },
        }
      ),
    []
  );

  return (
    <AuthProvider>
      <UserProfileProvider>
        <AgentAIProvider>
          <SidebarProvider>
            {showSplash && <Splash onComplete={() => setShowSplash(false)} />}
            <AnimatedBackground />
            {!showSplash && (
              <RouterProvider
                router={router}
                future={{
                  v7_startTransition: true,
                  v7_relativeSplatPath: true,
                }}
              />
            )}
          </SidebarProvider>
        </AgentAIProvider>
      </UserProfileProvider>
    </AuthProvider>
  );
};

export default App;
