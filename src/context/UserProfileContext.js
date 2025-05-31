// src/context/UserProfileContext.js

import React, { createContext, useEffect, useState } from "react";

export const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem("fedrix_profile");
    return stored ? JSON.parse(stored) : null;
  });

  const saveProfile = (data) => {
    localStorage.setItem("fedrix_profile", JSON.stringify(data));
    setProfile(data);
  };

  const logoutProfile = () => {
    localStorage.removeItem("fedrix_profile");
    setProfile(null);
  };

  return (
    <UserProfileContext.Provider value={{ profile, saveProfile, logoutProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};
