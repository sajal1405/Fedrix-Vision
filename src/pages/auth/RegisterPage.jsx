// src/pages/Register.jsx
import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Register = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setMessageType('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match!');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      // eslint-disable-next-line no-unused-vars
      const { user, session } = await register(email, password); // Mark session as unused

      console.log('Supabase registration successful:', user);
      setMessage(
        'Registration successful! Please check your email to confirm your account, then you will be redirected.',
      );
      setMessageType('success');
    } catch (error) {
      console.error('Registration Error:', error.message);
      setMessage(
        error.message ||
          'An error occurred during registration. Please try again.',
      );
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center p-4 bg-black-ops text-off-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="glass-effect p-8 rounded-xl shadow-lg max-w-md w-full border border-mid-gray"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-off-white">
          Register for Fedrix Vision
        </h2>

        {message && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-3 mb-4 rounded-md text-sm ${
              messageType === 'success'
                ? 'bg-green-700/30 text-green-300 border border-green-500'
                : 'bg-red-700/30 text-red-300 border border-red-500'
            }`}
          >
            {message}
          </motion.div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-light-gray text-sm font-bold mb-2"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-light-gray text-sm font-bold mb-2"
            >
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="email-input pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-mid-gray hover:text-off-white transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirmPassword"
              className="block text-light-gray text-sm font-bold mb-2"
            >
              Confirm Password:
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className="email-input pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-mid-gray hover:text-off-white transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="btn-action w-full flex items-center justify-center gap-2"
            disabled={loading || !email || !password || !confirmPassword}
          >
            {loading ? <FaSpinner className="animate-spin" /> : 'Register'}
          </button>
        </form>
        <p className="text-center text-sm text-mid-gray mt-6">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-light-gray hover:text-off-white transition-colors duration-200 font-semibold"
          >
            Login here
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Register;
