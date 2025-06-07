// src/components/dashboard/AdminDashboard.js

import React, { useContext } from "react";
import Sidebar from "../common/Sidebar.jsx";
import Header from "../common/Header.jsx";
import { SidebarContext } from "../../context/SidebarContext";

import KanbanBoard from "../kanban/KanbanBoard.jsx";
import Calendar from "../calendar/Calendar.jsx";
import SocialMediaCalendar from "../calendar/SocialMediaCalendar";
import PerformanceCharts from "../analytics/PerformanceCharts";
import BlogManager from "../blog/BlogManager.jsx";

const AdminDashboard = () => {
  const { isOpen } = useContext(SidebarContext);
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className={`dashboard-main ${isOpen ? 'ml-[220px]' : 'ml-0'}`}>
        <Header />
        <section className="dashboard-content fade-in">
          <h2>Welcome, Admin</h2>
          <p>You have full access to all modules.</p>
        </section>

        <section className="dashboard-content fade-in">
          <h2>🗂 Taskboard</h2>
          <KanbanBoard />
        </section>

        <section className="dashboard-content fade-in">
          <h2>📅 Calendar</h2>
          <Calendar />
          <SocialMediaCalendar />
        </section>

        <section className="dashboard-content fade-in">
          <h2>📊 Analytics Overview</h2>
          <PerformanceCharts />
        </section>

        <section className="dashboard-content fade-in">
          <h2>📝 Blog Management</h2>
          <BlogManager />
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
