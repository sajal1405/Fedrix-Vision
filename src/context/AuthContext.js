// src/context/AuthContext.js

import React, { createContext, useState } from "react";
import PropTypes from "prop-types";
import { supabase } from "../supabaseClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("fedrix_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (role, email) => {
    const loggedUser = { role, email, timestamp: new Date().toISOString() };
    localStorage.setItem("fedrix_user", JSON.stringify(loggedUser));
    setUser(loggedUser);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("fedrix_user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
