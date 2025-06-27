// src/pages/ComingSoon.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaHourglassHalf, FaCodeBranch } from 'react-icons/fa';

const ComingSoon = ({ pageName = 'This Page' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen-content bg-dark-gray/60 rounded-xl p-8 text-center shadow-lg border border-mid-gray"
    >
      <FaHourglassHalf className="text-teal-400 text-6xl mb-4" />
      <h2 className="text-3xl font-bold text-white mb-2">{pageName}</h2>
      <p className="text-light-gray text-lg mb-6">
        This page is currently under construction.
      </p>
      <div className="flex items-center text-white/70">
        <FaCodeBranch className="mr-2" />
        <p className="text-md">Check back soon for exciting updates!</p>
      </div>
    </motion.div>
  );
};

ComingSoon.propTypes = {
  pageName: PropTypes.string,
};

export default ComingSoon;
