import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_TEXTS = [
  'Encrypting session...',
  'Verifying identity...',
  'Securing data channel...',
  'Applying zero-trust protocol...',
  'Scanning for threats...',
  'Handshaking...',
  'Finalizing access...',
  'Welcome to Fedrix Vision.',
];

const SecurityLoading = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % LOADING_TEXTS.length);
    }, 1400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        className="mb-6"
      >
        <svg width={56} height={56} viewBox="0 0 56 56">
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="#00BF8B"
            strokeWidth="6"
            fill="none"
            opacity="0.2"
          />
          <motion.circle
            cx="28"
            cy="28"
            r="24"
            stroke="#00BF8B"
            strokeWidth="6"
            fill="none"
            strokeDasharray="140"
            strokeDashoffset="80"
            initial={{ strokeDashoffset: 80 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          />
        </svg>
      </motion.div>
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-lg md:text-xl font-semibold text-teal-300"
        >
          {LOADING_TEXTS[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SecurityLoading;
