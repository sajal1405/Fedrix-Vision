import React, { useState, useMemo } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import KanbanBoard from "./components/kanban/KanbanBoard.jsx";
import Calendar from "./components/calendar/Calendar.jsx";
import BlogManagement from "./pages/BlogManagement.jsx";
import AgentAIDashboard from "./components/ai/AgentDashboard.jsx";
import UserManagement from "./components/admin/UserManagement.jsx";
import ClientsPage from "./pages/ClientsPage.jsx";
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
import Reminders from "./pages/Reminders.jsx";
import { NotificationsProvider } from "./context/NotificationsContext";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import SocialCalendar from "./pages/SocialCalendar.jsx";
import ApiKeysPage from "./pages/ApiKeysPage.jsx";
import ToolsPage from "./pages/ToolsPage.jsx";
import AppSettings from "./pages/AppSettings.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";

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
            element: <LoginPage />,
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
              <ProtectedRoute requiredRole="admin">
                <DashboardLayout>
                  <AgentAIDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard/reminders',
            element: (
              <ProtectedRoute>
                <DashboardLayout>
                  <Reminders />
                </DashboardLayout>
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard/clients',
            element: (
              <ProtectedRoute requiredRole="admin">
                <DashboardLayout>
                  <ClientsPage />
                </DashboardLayout>
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard/users',
            element: (
              <ProtectedRoute requiredRole="super_admin">
                <DashboardLayout>
                  <UserManagement />
                </DashboardLayout>
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard/analytics',
            element: (
              <ProtectedRoute requiredRole="admin">
                <DashboardLayout>
                  <AnalyticsPage />
                </DashboardLayout>
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard/social-calendar',
            element: (
              <ProtectedRoute>
                <DashboardLayout>
                  <SocialCalendar />
                </DashboardLayout>
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard/api-keys',
            element: (
              <ProtectedRoute requiredRole="admin">
                <DashboardLayout>
                  <ApiKeysPage />
                </DashboardLayout>
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard/tools',
            element: (
              <ProtectedRoute>
                <DashboardLayout>
                  <ToolsPage />
                </DashboardLayout>
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard/app-settings',
            element: (
              <ProtectedRoute requiredRole="super_admin">
                <DashboardLayout>
                  <AppSettings />
                </DashboardLayout>
              </ProtectedRoute>
            ),
          },
          {
            path: '/unauthorized',
            element: <Unauthorized />,
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
        <NotificationsProvider>
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
        </NotificationsProvider>
      </UserProfileProvider>
    </AuthProvider>
  );
};

export default App;
