// src/components/dashboard/NotificationsWidget.jsx
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationsWidget = ({ className }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: 'New project "Alpha" started by John Doe.',
      time: '2 mins ago',
      type: 'project',
    },
    {
      id: 2,
      message: 'Your profile was updated by admin.',
      time: '1 hour ago',
      type: 'info',
    },
    {
      id: 3,
      message: 'Upcoming task deadline: "Review Q3 Report".',
      time: '3 hours ago',
      type: 'alert',
    },
    {
      id: 4,
      message: 'Client "Global Corp" approved proposal.',
      time: 'Yesterday',
      type: 'success',
    },
    {
      id: 5,
      message: 'System update scheduled for 2 AM.',
      time: 'Yesterday',
      type: 'info',
    },
    {
      id: 6,
      message: 'New message from Jane Smith regarding Project Beta.',
      time: '2 days ago',
      type: 'message',
    },
    {
      id: 7,
      message: 'Your monthly report is ready.',
      time: '3 days ago',
      type: 'report',
    },
    {
      id: 8,
      message: 'Security alert: unusual login attempt detected.',
      time: '4 days ago',
      type: 'warning',
    },
    {
      id: 9,
      message: 'Marketing campaign "Summer Sale" launched.',
      time: '1 week ago',
      type: 'marketing',
    },
    {
      id: 10,
      message: 'Client meeting scheduled for Friday.',
      time: '1 week ago',
      type: 'meeting',
    },
    {
      id: 11,
      message: 'Server maintenance completed successfully.',
      time: 'Just now',
      type: 'info',
    },
    {
      id: 12,
      message: 'New feature "Dark Mode" released.',
      time: '5 mins ago',
      type: 'project',
    },
    {
      id: 13,
      message: 'Payment for Invoice #1024 received.',
      time: '10 mins ago',
      type: 'success',
    },
    {
      id: 14,
      message: 'Database backup completed.',
      time: '20 mins ago',
      type: 'info',
    },
    {
      id: 15,
      message: 'User password reset requested.',
      time: '30 mins ago',
      type: 'warning',
    },
  ]);

  const notificationsContainerRef = useRef(null);

  useEffect(() => {
    const element = notificationsContainerRef.current;
    if (element) {
      const isScrolledToBottom =
        element.scrollHeight - element.clientHeight <= element.scrollTop + 50;
      if (isScrolledToBottom) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }, [notifications]);

  const handleClearNotification = (idToClear) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notif) => notif.id !== idToClear),
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'project':
        return <span className="text-teal-400">🚀</span>;
      case 'info':
        return <span className="text-blue-400">💡</span>;
      case 'alert':
        return <span className="text-yellow-400">⏰</span>;
      case 'success':
        return <span className="text-green-400">✅</span>;
      case 'message':
        return <span className="text-purple-400">💬</span>;
      case 'report':
        return <span className="text-indigo-400">📊</span>;
      case 'warning':
        return <span className="text-red-400">🚨</span>;
      case 'marketing':
        return <span className="text-pink-400">📢</span>;
      case 'meeting':
        return <span className="text-orange-400">🗓️</span>;
      default:
        return <span className="text-gray-400">🔔</span>;
    }
  };

  return (
    <div
      className={`hologram-tile p-6 flex flex-col ${className || ''}
                    bg-gradient-to-br from-dark-gray/60 to-black-ops/60`}
    >
      <h3 className="text-lg font-semibold text-white/80 mb-4 pb-2 border-b border-teal-600/30 flex items-center justify-between">
        Notifications
        <span className="text-xs font-normal text-teal-400 bg-teal-900/30 px-2 py-1 rounded-full border border-teal-700/50">
          {notifications.length} New
        </span>
      </h3>
      <div
        ref={notificationsContainerRef}
        className="flex-grow overflow-y-auto custom-scrollbar pr-2"
      >
        {notifications.length > 0 ? (
          <motion.ul layout className="grid grid-cols-1 gap-4">
            <AnimatePresence initial={false}>
              {notifications.map((notification) => (
                <motion.li
                  key={notification.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className="bg-dark-gray/30 rounded-lg p-4 flex items-start relative
                             group cursor-pointer border border-transparent hover:border-teal-500/60
                             transition-all duration-300 ease-in-out hover:shadow-xl hover:bg-mid-gray/40
                             backdrop-blur-sm"
                  onClick={() =>
                    console.log('Notification clicked:', notification.id)
                  }
                >
                  <div className="flex-shrink-0 mr-3 text-2xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-grow">
                    <p className="text-white/90 text-sm leading-snug pr-6">
                      {notification.message}
                    </p>
                    <span className="text-xs text-white/50 mt-1 block">
                      {notification.time}
                    </span>
                  </div>
                  <button
                    className="absolute top-2 right-2 text-white/40 hover:text-red-400
                               transition-all duration-200 p-1 rounded-full bg-white/5 group-hover:bg-red-900/40
                               opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100
                               hover:shadow-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearNotification(notification.id);
                    }}
                    aria-label="Clear notification"
                    title="Clear notification"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      ></path>
                    </svg>
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <motion.p
            key="no-notifications"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-white/60 text-sm text-center py-4"
          >
            No new notifications. You&apos;re all caught up!
          </motion.p>
        )}
      </div>
    </div>
  );
};

NotificationsWidget.propTypes = {
  className: PropTypes.string,
};

export default NotificationsWidget;
