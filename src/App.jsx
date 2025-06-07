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
import UserManagement from "./components/admin/UserManagement.jsx";
import ProfileSetup from "./pages/ProfileSetup.jsx";
import { AuthProvider } from "./context/AuthContext";
import { UserProfileProvider } from "./context/UserProfileContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Splash from "./components/common/Splash";
import Sidebar from "./components/common/Sidebar.jsx";
import Header from "./components/common/Header.jsx";
import AnimatedBackground from "./components/common/AnimatedBackground.jsx";

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
            path: '/dashboard',
            element: (
              <ProtectedRoute>
                <>
                  <Sidebar />
                  <div className="flex flex-col flex-1">
                    <Header />
                    <Dashboard />
                  </div>
                </>
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard/kanban',
            element: (
              <ProtectedRoute>
                <>
                  <Sidebar />
                  <div className="flex flex-col flex-1">
                    <Header />
                    <KanbanBoard />
                  </div>
                </>
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard/calendar',
            element: (
              <ProtectedRoute>
                <>
                  <Sidebar />
                  <div className="flex flex-col flex-1">
                    <Header />
                    <Calendar />
                  </div>
                </>
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard/blog',
            element: (
              <ProtectedRoute>
                <>
                  <Sidebar />
                  <div className="flex flex-col flex-1">
                    <Header />
                    <BlogManagement />
                  </div>
                </>
              </ProtectedRoute>
            ),
          },
          {
            path: '/dashboard/users',
            element: (
              <ProtectedRoute requiredRole="superadmin">
                <>
                  <Sidebar />
                  <div className="flex flex-col flex-1">
                    <Header />
                    <UserManagement />
                  </div>
                </>
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
      </UserProfileProvider>
    </AuthProvider>
  );
};

export default App;
