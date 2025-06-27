// src/components/ollama/ChatInput.jsx
import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaChevronDown } from 'react-icons/fa';

const ChatInput = ({
  onSendMessage,
  isLoading,
  ollamaModels,
  activeModelId,
  setActiveModelId,
}) => {
  const [message, setMessage] = useState('');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendClick = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  const toggleModelDropdown = () => {
    setIsModelDropdownOpen((prev) => !prev);
  };

  const selectModel = (modelId) => {
    setActiveModelId(modelId);
    setIsModelDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentModelDisplayName =
    ollamaModels.find((m) => m.id === activeModelId)?.name || 'Select AI';
  const hasActiveModels = ollamaModels.some((m) => m.status === 'active');

  return (
    <div className="relative mt-4 flex items-center bg-dark-gray/50 rounded-lg shadow-xl border border-mid-gray pr-2">
      <div className="relative" ref={dropdownRef}>
        <motion.button
          onClick={toggleModelDropdown}
          className={`flex items-center justify-between px-4 py-3 rounded-l-lg
                      ${hasActiveModels ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-700 cursor-not-allowed'}
                      text-white font-semibold transition-colors duration-200`}
          whileHover={{ scale: hasActiveModels ? 1.02 : 1 }}
          whileTap={{ scale: hasActiveModels ? 0.98 : 1 }}
          disabled={!hasActiveModels || isLoading}
        >
          <span className="truncate max-w-[120px]">
            {currentModelDisplayName}
          </span>
          <FaChevronDown className="ml-2" />
        </motion.button>

        <AnimatePresence>
          {isModelDropdownOpen && hasActiveModels && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-full left-0 mb-2 w-full min-w-[200px] bg-dark-gray border border-mid-gray rounded-lg shadow-lg z-50 overflow-hidden"
            >
              {ollamaModels
                .filter((m) => m.status === 'active')
                .map((model) => (
                  <button
                    key={model.id}
                    onClick={() => selectModel(model.id)}
                    className={`block w-full text-left px-4 py-2 text-white/90 hover:bg-mid-gray transition-colors
                              ${activeModelId === model.id ? 'bg-teal-700/60' : ''}`}
                  >
                    {model.name}
                  </button>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <input
        type="text"
        value={message}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={
          isLoading ? 'Generating response...' : 'Type your message...'
        }
        className="flex-grow py-3 px-4 bg-transparent text-white focus:outline-none placeholder-white/50"
        disabled={isLoading || !activeModelId}
      />

      <motion.button
        onClick={handleSendClick}
        className={`ml-2 p-3 rounded-full ${message.trim() && !isLoading ? 'bg-teal-600 hover:bg-teal-700' : 'bg-gray-700 opacity-50 cursor-not-allowed'}
                    text-white transition-colors duration-200`}
        whileHover={{ scale: message.trim() && !isLoading ? 1.1 : 1 }}
        whileTap={{ scale: message.trim() && !isLoading ? 0.9 : 1 }}
        disabled={!message.trim() || isLoading || !activeModelId}
      >
        <FaPaperPlane className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  ollamaModels: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    }),
  ).isRequired,
  activeModelId: PropTypes.string,
  setActiveModelId: PropTypes.func.isRequired,
};

export default ChatInput;
