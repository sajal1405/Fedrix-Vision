import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import KanbanBoard from "./components/kanban/KanbanBoard";
import Calendar from "./components/calendar/Calendar";
import BlogManagement from "./pages/BlogManagement";
import ProfileSetup from "./pages/ProfileSetup";
import { AuthProvider } from "./context/AuthContext";
import { UserProfileProvider } from "./context/UserProfileContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Splash from "./components/common/Splash";
import Sidebar from "./components/common/Sidebar";
import Header from "./components/common/Header";
import AnimatedBackground from "./components/common/AnimatedBackground";

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <Router>
      <AuthProvider>
        <UserProfileProvider>
          {showSplash && <Splash onComplete={() => setShowSplash(false)} />}
          <AnimatedBackground />
          {!showSplash && (
            <>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<ProfileSetup />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <>
                        <Sidebar />
                        <div className="flex flex-col flex-1">
                          <Header />
                          <Dashboard />
                        </div>
                      </>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/kanban"
                  element={
                    <ProtectedRoute>
                      <>
                        <Sidebar />
                        <div className="flex flex-col flex-1">
                          <Header />
                          <KanbanBoard />
                        </div>
                      </>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/calendar"
                  element={
                    <ProtectedRoute>
                      <>
                        <Sidebar />
                        <div className="flex flex-col flex-1">
                          <Header />
                          <Calendar />
                        </div>
                      </>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/dashboard/blog"
                  element={
                    <ProtectedRoute>
                      <>
                        <Sidebar />
                        <div className="flex flex-col flex-1">
                          <Header />
                          <BlogManagement />
                        </div>
                      </>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </>
          )}
        </UserProfileProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
