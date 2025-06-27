// src/context/UserProfileContext.js

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
import PropTypes from "prop-types";
import { supabase } from "../supabaseClient";

export const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem("fedrix_profile");
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(!profile);
  const [profileError, setProfileError] = useState(null);

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
      setIsLoadingProfile(true);
      setProfileError(null);
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) {
          setProfile(null);
          return;
        }
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (error) throw error;
        if (data) {
          localStorage.setItem("fedrix_profile", JSON.stringify(data));
          setProfile(data);
        } else {
          setProfile(null);
        }
      } catch (err) {
        setProfileError(err);
        setProfile(null);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    if (!profile) load();
  }, [profile]); // run once on mount

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        userProfile: profile,
        saveProfile,
        logoutProfile,
        isLoadingProfile,
        profileError,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

UserProfileProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUserProfile = () => {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be used within a UserProfileProvider');
  return ctx;
};

// Legacy name used in a few components
export const useProfile = useUserProfile;
