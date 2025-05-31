// src/components/common/Sidebar.js

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { UserProfileContext } from "../../context/UserProfileContext";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const { profile } = useContext(UserProfileContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      style={{
        width: "220px",
        height: "100vh",
        backgroundColor: "#0e0e0e",
        padding: "1rem",
        position: "fixed",
        left: 0,
        top: 0,
        borderRight: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <img src="/fedrix.svg" alt="Fedrix Logo" style={{ width: "120px", marginBottom: "2rem" }} />

      {profile && (
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <img src={profile.avatar} alt="avatar" style={{ width: 50, borderRadius: "50%" }} />
          <div style={{ marginTop: 8, fontSize: "0.9rem" }}>{profile.name}</div>
          <div style={{ fontSize: "0.75rem", opacity: 0.5 }}>{profile.tier}</div>
        </div>
      )}

      <nav>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: "1rem", color: "#fff" }}>📊 Dashboard</li>
          <li style={{ marginBottom: "1rem", color: "#fff" }}>📅 Calendar</li>
          <li style={{ marginBottom: "1rem", color: "#fff" }}>📌 Projects</li>
          <li style={{ marginBottom: "1rem", color: "#fff" }}>📰 Blog</li>
        </ul>
      </nav>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "2rem",
          width: "100%",
          padding: "0.6rem",
          backgroundColor: "#6f0c8a",
          borderRadius: "6px",
          color: "#fff",
        }}
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
