// src/context/UserProfileContext.js

import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { supabase } from "../supabaseClient";

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

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (data) {
        localStorage.setItem("fedrix_profile", JSON.stringify(data));
        setProfile(data);
      }
    };
    if (!profile) load();
  }, [profile]); // run once on mount

  return (
    <UserProfileContext.Provider value={{ profile, saveProfile, logoutProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

UserProfileProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
