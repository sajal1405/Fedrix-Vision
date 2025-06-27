// src/components/dashboard/ClientFeedbackWidget.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const ClientFeedbackWidget = ({ className }) => {
  const feedbackItems = [
    {
      id: 1,
      client: 'Innovate Solutions',
      rating: 5,
      comment:
        'Excellent service, very responsive and proactive communication! Highly recommend. The team understood our complex needs perfectly and delivered beyond expectations. A truly great partnership from start to finish.',
      date: '2023-05-10',
    },
    {
      id: 2,
      client: 'Global Dynamics',
      rating: 4,
      comment:
        'Good progress and solid execution on the project. Looking forward to the next phase. There were a few minor hiccups, but they were resolved quickly and professionally. Overall, a positive experience.',
      date: '2023-05-05',
    },
    {
      id: 3,
      client: 'Future Corp',
      rating: 5,
      comment:
        'Exceeded all expectations. The team is truly brilliant and highly professional. Their insights were invaluable, and the final product is exactly what we envisioned, even better!',
      date: '2023-04-28',
    },
    {
      id: 4,
      client: 'Startup X',
      rating: 3,
      comment:
        'There were some delays in delivery, but the final outcome was satisfactory. Communication could have been more frequent, but the technical expertise was evident. Room for improvement in project management.',
      date: '2023-04-20',
    },
    {
      id: 5,
      client: 'Quantum Labs',
      rating: 5,
      comment:
        'Phenomenal results! Their innovative approach made a significant difference. We are incredibly pleased with the impact on our business metrics. They are true pioneers in their field.',
      date: '2023-04-15',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === feedbackItems.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? feedbackItems.length - 1 : prevIndex - 1,
    );
  };

  const currentFeedback = feedbackItems[currentIndex];

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 25 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.8,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 25 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    }),
  };

  return (
    <div
      className={`hologram-tile p-6 flex flex-col justify-between ${className || ''} relative
                    bg-gradient-to-br from-dark-gray/60 to-black-ops/60`}
    >
      <h3 className="text-lg font-semibold text-white/80 mb-4 pb-2 border-b border-purple-600/30 text-center">
        Client Testimonials
      </h3>

      {feedbackItems.length > 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow text-center relative px-8 overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute w-full h-full flex flex-col items-center justify-center p-4"
            >
              <div className="flex justify-center items-center text-yellow-400 text-2xl mb-2">
                {'★'.repeat(currentFeedback.rating)}
                {'☆'.repeat(5 - currentFeedback.rating)}
              </div>
              <p className="text-white/90 text-md italic mb-3 leading-relaxed custom-scrollbar overflow-y-auto max-h-[80px]">
                &quot;{currentFeedback.comment}&quot;
              </p>
              <p className="text-white text-md font-semibold">
                - {currentFeedback.client}
              </p>
              <span className="text-xs text-white/50 mt-1">
                {currentFeedback.date}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <p className="text-white/60 text-sm text-center py-4">
          No testimonials available.
        </p>
      )}

      {feedbackItems.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4 z-20">
          <button
            onClick={goToPrevious}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white/80 hover:text-white transform hover:scale-110"
            aria-label="Previous testimonial"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white/80 hover:text-white transform hover:scale-110"
            aria-label="Next testimonial"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

ClientFeedbackWidget.propTypes = {
  className: PropTypes.string,
};

export default ClientFeedbackWidget;
