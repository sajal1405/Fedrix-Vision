// src/pages/ResetPassword.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ResetPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="glass-effect p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-200">
          Reset Password
        </h2>
        <p className="mb-4 text-gray-300">Enter your new password.</p>
        <input
          type="password"
          placeholder="New Password"
          className="email-input mb-4"
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          className="email-input mb-4"
          required
        />
        <button className="btn-action w-full mb-4">Reset Password</button>
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

export default ResetPassword;
