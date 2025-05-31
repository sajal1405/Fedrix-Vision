// src/components/common/Header.js

import React, { useContext } from "react";
import { UserProfileContext } from "../../context/UserProfileContext";

const Header = () => {
  const { profile } = useContext(UserProfileContext);

  return (
    <header
      style={{
        padding: "1rem 2rem",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        backgroundColor: "rgba(0,0,0,0.4)",
        position: "sticky",
        top: 0,
        zIndex: 2,
        backdropFilter: "blur(10px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: "600" }}>Fedrix Control Panel</h1>
      {profile && (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img src={profile.avatar} alt="user" style={{ width: "36px", borderRadius: "50%" }} />
          <span style={{ fontSize: "0.9rem", opacity: 0.6 }}>{profile.name}</span>
        </div>
      )}
    </header>
  );
};

export default Header;
