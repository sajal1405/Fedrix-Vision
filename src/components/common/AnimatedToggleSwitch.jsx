// src/components/common/AnimatedToggleSwitch.jsx
// A reusable, animated toggle switch component.

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const AnimatedToggleSwitch = ({ checked, onChange, disabled }) => {
  return (
    <button
      type="button"
      className="toggle-switch-container" // Apply global toggle-switch-container styles
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      data-state={checked ? 'checked' : 'unchecked'}
      tabIndex={disabled ? -1 : 0}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <motion.span
        className="toggle-switch-thumb" // Apply global toggle-switch-thumb styles
        initial={false}
        animate={{ x: checked ? '24px' : '0px' }} // Tailwind's transform: translateX(24px) for w-14/8-14-6 = 8px; width of thumb is 6px, so 14-6=8.
        transition={{ type: 'spring', stiffness: 700, damping: 30 }}
      />
    </button>
  );
};

AnimatedToggleSwitch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default AnimatedToggleSwitch;
