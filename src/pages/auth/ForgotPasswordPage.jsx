// src/pages/ForgotPassword.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="glass-effect p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-200">
          Forgot Password
        </h2>
        <p className="mb-4 text-gray-300">
          Enter your email address to receive a password reset link.
        </p>
        <input
          type="email"
          placeholder="Your email"
          className="email-input mb-4"
          required
        />
        <button className="btn-action w-full mb-4">Send Reset Link</button>
        <Link
          to="/login"
          className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
