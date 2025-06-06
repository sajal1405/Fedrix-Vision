import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const Splash = ({ onComplete }) => {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDone(true);
      onComplete();
    }, 2200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="text-white text-3xl font-bold tracking-widest"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 1 }}
      >
        Fedrix Vision
      </motion.div>
      <div className="mt-6 w-32 h-1 rounded-full bg-fedrix animate-pulse" />
    </motion.div>
  );
};

Splash.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

export default Splash;
