// src/components/common/NotificationsDropdown.jsx
import React from 'react';
import { FaBell, FaCheckDouble, FaTrash } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import { useNotifications } from '../../context/NotificationsContext';

const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loading,
  } = useNotifications();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on click outside
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (event) => {
      if (
        !event.target.closest('.notifications-dropdown-root') &&
        !event.target.closest('.notifications-bell-btn')
      ) {
        setIsOpen(false);
      }
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [isOpen]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="relative p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200 notifications-bell-btn"
        aria-label="Notifications"
      >
        <FaBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-3 w-80 bg-dark-gray rounded-xl shadow-2xl py-2 z-50 border border-mid-gray notifications-dropdown-root"
          >
            <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
              <h4 className="text-lg font-semibold text-white">
                Notifications
              </h4>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-teal-400 text-sm hover:text-teal-300 transition-colors duration-200 flex items-center"
                >
                  <FaCheckDouble className="mr-1 text-xs" /> Mark All Read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-white/60">Loading...</div>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className={`flex items-start p-3 border-b border-white/5 last:border-b-0
                      ${
                        notification.read
                          ? 'text-white/60 bg-dark-gray/20'
                          : 'text-white bg-dark-gray/40 hover:bg-dark-gray/50'
                      }
                      transition-all duration-200 cursor-pointer`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex-shrink-0 mr-3 text-xl">🔔</div>
                    <div className="flex-grow">
                      <p
                        className={`text-sm leading-tight ${
                          notification.read ? 'font-normal' : 'font-medium'
                        }`}
                      >
                        {notification.message}
                      </p>
                      <span className="text-xs text-white/50">
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="ml-2 text-white/30 hover:text-red-400 p-1 rounded-full transition-colors duration-200"
                      aria-label="Delete notification"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <p className="text-white/60 text-center py-4 text-sm">
                  No new notifications.
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsDropdown;
