// src/components/common/ConfirmModal.jsx
import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const ConfirmModal = ({
  open,
  onCancel,
  onConfirm,
  title,
  message,
  confirmText,
  danger = false,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-dark-gray border border-mid-gray rounded-lg p-6 max-w-md w-full shadow-2xl"
      >
        <h3
          className={`text-xl font-bold mb-3 ${danger ? 'text-red-400' : 'text-off-white'}`}
        >
          {title}
        </h3>
        <p className="text-light-gray mb-5">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            className="btn-secondary px-4 py-2 rounded font-medium"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`btn-primary px-4 py-2 rounded font-medium ${danger ? 'bg-red-600 hover:bg-red-700' : ''}`}
            onClick={onConfirm}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

ConfirmModal.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmText: PropTypes.string,
  danger: PropTypes.bool,
};

export default ConfirmModal;
