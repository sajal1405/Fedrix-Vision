// src/pages/auth/LoginPage.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoginForm from '../../components/auth/LoginForm';
import AnimatedBackground from '../../components/common/AnimatedBackground';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Automatically redirect when logged in
  useEffect(() => {
    if (currentUser) navigate('/dashboard', { replace: true });
  }, [currentUser, navigate]);

  const handleLoginSuccess = () => {
    // The redirect is now handled by the useEffect above!
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full p-4 overflow-hidden">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative z-10 flex items-center justify-center h-full w-full"
      >
        <LoginForm
          onLoginSuccess={handleLoginSuccess}
          onForgotPassword={handleForgotPassword}
          onRegister={handleRegister}
        />
      </motion.div>
    </div>
  );
};

export default LoginPage;
