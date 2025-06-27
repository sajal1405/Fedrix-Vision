// src/components/dashboard/StatCard.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

// Icons using inline SVG for better control and performance
const DollarSignIcon = (props) => (
  <svg
    {...props}
    className={`w-6 h-6 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V9m0 3v2m0 3V16m-4 0h8a2 2 0 002-2V6a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2z"
    ></path>
  </svg>
);

const UsersIcon = (props) => (
  <svg
    {...props}
    className={`w-6 h-6 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M17 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M12 12a4 4 0 100-8 4 4 0 000 8z"
    ></path>
  </svg>
);

const CheckSquareIcon = (props) => (
  <svg
    {...props}
    className={`w-6 h-6 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

const StarIcon = (props) => (
  <svg
    {...props}
    className={`w-6 h-6 ${props.className || ''}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.923 8.5c-.783-.57-.381-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"
    ></path>
  </svg>
);

const StatCard = ({ title, value, description, icon: Icon, className }) => {
  return (
    <motion.div
      className={`hologram-tile py-4 px-5 flex flex-col justify-between items-start rounded-xl shadow-lg border border-mid-gray
                  transition-all duration-300 ease-in-out hover:shadow-2xl hover:border-teal-500
                  bg-gradient-to-br from-dark-gray/60 to-black-ops/60 group ${className}`}
      whileHover={{ y: -3, scale: 1.01 }} // Subtle lift and scale on hover
    >
      <div className="flex items-center justify-between w-full mb-1">
        <h3 className="text-xs sm:text-sm font-semibold text-white/70 uppercase tracking-wide">
          {title}
        </h3>
        {Icon && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-shrink-0"
          >
            <Icon className="text-teal-400 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        )}
      </div>
      <p className="text-2xl sm:text-3xl font-extrabold text-white mb-1">
        {value}
      </p>
      <p className="text-[10px] sm:text-xs text-light-gray leading-tight">
        {description}
      </p>
    </motion.div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  className: PropTypes.string,
};

export { StatCard, DollarSignIcon, UsersIcon, CheckSquareIcon, StarIcon };
