// src/components/routes/RouteLoader.jsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const texts = [
  'Encrypting session...',
  'Applying zero-trust policy...',
  'Validating JWT...',
  'Syncing with Fedrix cloud...',
  'Loading dashboard...',
];

const RouteLoader = () => {
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((i) => (i + 1) % texts.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
        className="h-10 w-10 mb-6 text-teal-400"
        style={{ fontSize: 40 }}
      >
        <svg viewBox="0 0 24 24">
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-70"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4zm2 5.3A8 8 0 014 12H0c0 3 1.1 5.8 3 7.9l3-2.6z"
          />
        </svg>
      </motion.div>
      <motion.div
        key={textIndex}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="text-lg font-mono tracking-wide text-teal-200"
      >
        {texts[textIndex]}
      </motion.div>
    </div>
  );
};

export default RouteLoader;
