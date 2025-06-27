// src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../supabaseClient';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUserWithRole = async (user) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (error) {
      console.error('Failed to load user profile', error);
      return user;
    }
    return { ...user, role: data?.role };
  };

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data, error }) => {
      if (!error) {
        const userWithRole = await loadUserWithRole(data?.user);
        setCurrentUser(userWithRole);
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const userWithRole = await loadUserWithRole(session?.user);
      setCurrentUser(userWithRole);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) =>
    supabase.auth.signInWithPassword({ email, password });

  const register = async (email, password) =>
    supabase.auth.signUp({ email, password });

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        user: currentUser, // alias for backwards compatibility
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
