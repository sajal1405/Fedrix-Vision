// src/components/ollama/ModelStatusIndicator.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const ModelStatusIndicator = ({ model }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'booting':
        return 'bg-yellow-500';
      case 'inactive':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'booting':
        return 'Booting';
      case 'inactive':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  return (
    <motion.div
      className="flex items-center space-x-2 p-2 rounded-full border border-mid-gray bg-dark-gray/50"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`w-3 h-3 rounded-full ${getStatusColor(model.status)} shadow-lg`}
      >
        {/* Pulsing animation for booting */}
        {model.status === 'booting' && (
          <motion.div
            className="w-full h-full rounded-full bg-yellow-500"
            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
      </div>
      <span className="text-sm font-medium text-white whitespace-nowrap">
        {model.name}:{' '}
        <span
          className={`font-bold ${model.status === 'active' ? 'text-green-300' : model.status === 'booting' ? 'text-yellow-300' : 'text-red-300'}`}
        >
          {getStatusText(model.status)}
        </span>
      </span>
    </motion.div>
  );
};

ModelStatusIndicator.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['booting', 'active', 'inactive']).isRequired,
  }).isRequired,
};

export default ModelStatusIndicator;
