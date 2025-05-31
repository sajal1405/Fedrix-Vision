// src/pages/ProfileSetup.js

import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { AuthContext } from "../context/AuthContext";
import { UserProfileContext } from "../context/UserProfileContext";

const ProfileSetup = () => {
  const { user } = useContext(AuthContext);
  const { saveProfile } = useContext(UserProfileContext);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const seed = encodeURIComponent(user.id || "default-seed");
      setAvatar(`https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${seed}`);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      data: { user: supaUser },
    } = await supabase.auth.getUser();

    if (!supaUser) return;

    const profileData = {
      id: supaUser.id,
      email: supaUser.email,
      name,
      company,
      avatar,
      tier: supaUser.email.includes("admin") ? "admin" : "client",
    };

    await supabase.from("profiles").upsert(profileData);
    saveProfile(profileData);
    navigate("/dashboard");
  };

  return (
    <div className="login-container fade-in" style={{ textAlign: "center" }}>
      <h2>👤 Complete Your Profile</h2>
      <img src={avatar} alt="avatar" className="avatar-img" />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="email-input"
        />
        <input
          type="text"
          placeholder="Company / Brand"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="email-input"
        />
        <button type="submit" className="btn-primary" style={{ marginTop: "1rem" }}>
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileSetup;
