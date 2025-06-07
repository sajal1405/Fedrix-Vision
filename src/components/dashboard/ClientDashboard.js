// src/components/dashboard/ClientDashboard.js

import React from "react";
import Sidebar from "../common/Sidebar.jsx";
import Header from "../common/Header.jsx";

import KanbanBoard from "../kanban/KanbanBoard.jsx";
import Calendar from "../calendar/Calendar.jsx";
import SocialMediaCalendar from "../calendar/SocialMediaCalendar";
import PerformanceCharts from "../analytics/PerformanceCharts";
import BlogManager from "../blog/BlogManager.jsx";

const ClientDashboard = () => {
  return (
    <div className="dashboard-wrapper">
      <Sidebar />
      <div className="dashboard-main">
        <Header />
        <section className="dashboard-content fade-in">
          <h2>Hello, Client</h2>
          <p>Here&apos;s your personalized dashboard overview.</p>
        </section>

        <section className="dashboard-content fade-in">
          <h2>🗂 My Tasks</h2>
          <KanbanBoard />
        </section>

        <section className="dashboard-content fade-in">
          <h2>📅 My Calendar</h2>
          <Calendar />
          <SocialMediaCalendar />
        </section>

        <section className="dashboard-content fade-in">
          <h2>📊 My Analytics</h2>
          <PerformanceCharts />
        </section>

        <section className="dashboard-content fade-in">
          <h2>📝 My Blog Posts</h2>
          <BlogManager />
        </section>
      </div>
    </div>
  );
};

export default ClientDashboard;
