// src/components/auth/LoginSlider.jsx
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, useAnimation } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

// Use default parameters directly in the function signature for props
const LoginSlider = ({
  onSlideComplete,
  isLoading = false,
  text = 'Slide to Confirm',
}) => {
  const sliderRef = useRef(null);
  const knobRef = useRef(null);
  // eslint-disable-next-line no-unused-vars
  const [isSliding, setIsSliding] = useState(false); // Suppressed as per lint warning
  const [knobX, setKnobX] = useState(0);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [knobWidth, setKnobWidth] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const measureDimensions = () => {
      if (sliderRef.current && knobRef.current) {
        setSliderWidth(sliderRef.current.offsetWidth);
        setKnobWidth(knobRef.current.offsetWidth);
      }
    };

    measureDimensions();

    const currentSliderRef = sliderRef.current;
    const resizeObserver = new ResizeObserver(measureDimensions);

    if (currentSliderRef) {
      resizeObserver.observe(currentSliderRef);
    }

    return () => {
      if (currentSliderRef) {
        resizeObserver.unobserve(currentSliderRef);
      }
    };
  }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  const movableRange = sliderWidth - knobWidth;

  const handleDragStart = () => {
    if (isLoading) return;
    setIsSliding(true);
    setKnobX(0); // Reset position on drag start
  };

  const handleDrag = (event, info) => {
    if (isLoading) return;
    let newX = info.offset.x;
    newX = Math.max(0, Math.min(newX, movableRange)); // Clamp between 0 and movableRange
    setKnobX(newX);
  };

  const handleDragEnd = async () => {
    if (isLoading) return;
    setIsSliding(false);

    if (knobX >= movableRange * 0.95) {
      // Check if slid more than 95%
      await controls.start({
        x: movableRange,
        transition: { type: 'spring', stiffness: 200, damping: 20 },
      });
      onSlideComplete(); // Call success callback
    } else {
      // Snap back to start if not enough slide
      await controls.start({
        x: 0,
        transition: { type: 'spring', stiffness: 200, damping: 20 },
      });
      setKnobX(0); // Reset internal state
    }
  };

  useEffect(() => {
    // Reset knob position if isLoading changes to true (e.g., after login attempt)
    if (isLoading) {
      controls.start({ x: 0 });
      setKnobX(0);
    }
  }, [isLoading, controls]); // Added controls to dependencies for useEffect, though it's typically stable

  return (
    <div
      ref={sliderRef}
      className={`relative w-full h-12 bg-white/10 rounded-full border border-white/10 overflow-hidden select-none
                  ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-grab'}`}
    >
      <motion.div
        ref={knobRef}
        className={`absolute w-12 h-12 top-0 left-0 rounded-full flex items-center justify-center z-30
                    ${isLoading ? 'cursor-not-allowed' : 'cursor-grab'}`}
        style={{
          background: 'radial-gradient(rgb(136, 136, 136), rgb(68, 68, 68))',
          boxShadow: 'rgba(255, 255, 255, 0.1) 0px 0px 10px',
        }}
        drag="x"
        dragConstraints={{ left: 0, right: movableRange }}
        dragElastic={0} // No elastic pull
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={controls}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        data-testid="login-slider-knob"
        tabIndex={isLoading ? -1 : 0} // Make knob focusable unless loading
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={(knobX / movableRange) * 100}
        role="slider"
      >
        <FaArrowRight className="text-white" />
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center text-white/70 font-semibold text-lg pointer-events-none">
        {isLoading ? 'Processing...' : text}
      </div>

      <div
        className="absolute h-full rounded-full bg-teal-600/50 transition-all duration-300 ease-out"
        style={{ width: `${knobX + knobWidth / 2}px` }}
      ></div>
    </div>
  );
};

LoginSlider.propTypes = {
  onSlideComplete: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  text: PropTypes.string,
};

// Removed defaultProps as default parameters are now used in the function signature

export default LoginSlider;
