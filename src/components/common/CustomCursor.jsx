// src/components/common/CustomCursor.jsx
import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const cursorX = useMotionValue(-100); // Initialize off-screen
  const cursorY = useMotionValue(-100); // Initialize off-screen

  // Use spring for smooth animation
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [cursorType, setCursorType] = useState('default'); // 'default', 'pointer', 'text', 'loading', 'thinking'
  // eslint-disable-next-line no-unused-vars
  const [isHovering, setIsHovering] = useState(false); // Suppress unused warning

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 12); // Adjust by half cursor size
      cursorY.set(e.clientY - 12); // Adjust by half cursor size
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      // Check if the target or any of its ancestors match interactive elements
      if (
        target.closest(
          'button, a, input[type="submit"], input[type="button"], .cursor-pointer',
        )
      ) {
        setCursorType('pointer');
        setIsHovering(true);
      } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setCursorType('text');
        setIsHovering(true);
      } else {
        setCursorType('default');
        setIsHovering(false);
      }
    };

    const handleMouseOut = (e) => {
      // Check if the relatedTarget (element user moved to) is not an interactive element
      if (
        !e.relatedTarget ||
        (!e.relatedTarget.closest('button, a, input, textarea') &&
          e.relatedTarget.tagName !== 'INPUT' &&
          e.relatedTarget.tagName !== 'TEXTAREA')
      ) {
        setCursorType('default');
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
    };
  }, [cursorX, cursorY]); // Dependencies for useEffect

  // Define cursor variants based on type
  const variants = {
    default: {
      opacity: 1,
      scale: 1,
      backgroundColor: 'rgba(0, 191, 139, 0.7)', // Teal
      borderColor: 'rgba(0, 191, 139, 1)',
      width: 24,
      height: 24,
      borderRadius: '50%',
      transition: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 },
    },
    pointer: {
      opacity: 1,
      scale: 1.2,
      backgroundColor: 'rgba(0, 188, 212, 0.8)', // Cyan
      borderColor: 'rgba(0, 188, 212, 1)',
      width: 32,
      height: 32,
      borderRadius: '50%',
      transition: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 },
    },
    text: {
      opacity: 1,
      scale: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderColor: 'rgba(255, 255, 255, 0.7)',
      width: 4, // Thin vertical line
      height: 28,
      borderRadius: '2px',
      transition: { type: 'spring', stiffness: 500, damping: 30, mass: 0.5 },
    },
    loading: {
      opacity: 1,
      scale: 1.5,
      backgroundColor: 'rgba(255, 255, 0, 0.7)', // Yellowish
      borderColor: 'rgba(255, 255, 0, 1)',
      width: 36,
      height: 36,
      borderRadius: '50%',
      rotate: 360,
      transition: {
        rotate: { repeat: Infinity, duration: 1, ease: 'linear' },
        type: 'spring',
        stiffness: 500,
        damping: 30,
        mass: 0.5,
      },
    },
  };

  return (
    <>
      {/* Hide default cursor */}
      <style>{`body { cursor: none !important; }`}</style>
      <motion.div
        className="fixed z-[9999] pointer-events-none border-2" // High z-index, ignore mouse events
        style={{
          translateX: cursorXSpring,
          translateY: cursorYSpring,
        }}
        variants={variants}
        animate={cursorType} // Animate based on the current cursorType state
      />
    </>
  );
};

export default CustomCursor;
