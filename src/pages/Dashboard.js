// src/pages/Dashboard.js

import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import ClientDashboard from "../components/dashboard/ClientDashboard";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;
  if (user.role === "admin") return <AdminDashboard />;
  if (user.role === "client") return <ClientDashboard />;
  return null;
};

export default Dashboard;
