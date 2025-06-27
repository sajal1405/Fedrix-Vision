// src/components/dashboard/RecentActivityFeed.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

// Icons for different activity types (using inline SVGs for better control and consistency)
const UserIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    ></path>
  </svg>
);
const BriefcaseIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 13.255A23.55 23.55 0 0112 15c-1.876 0-3.702-.178-5.5-.445M19 19v-2a2 2 0 00-2-2H7a2 2 0 00-2 2v2m3-8a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0zM9.5 20h5a2 2 0 002-2v-4a2 2 0 00-2-2h-5a2 2 0 00-2 2v4a2 2 0 002 2z"
    ></path>
  </svg>
);
const MessageSquareIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    ></path>
  </svg>
);
const CheckCircleIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);
const UploadCloudIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    ></path>
  </svg>
);
const BugIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);
const CalendarIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    ></path>
  </svg>
);
const FolderIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    ></path>
  </svg>
);
const PlusSquareIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12h6m-3-3v6m-9 1l4 4 4-4m-4 4V7"
    ></path>
  </svg>
);
const ContactIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 14v3m4-3v3m4-3v3M3 21h18M5 10h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v2a2 2 0 002 2zm4-1v-1a1 1 0 00-1-1H7a1 1 0 00-1 1v1h4zm8 0v-1a1 1 0 00-1-1h-2a1 1 0 00-1 1v1h4z"
    ></path>
  </svg>
);

const RecentActivityFeed = ({ className }) => {
  const activities = [
    {
      id: 1,
      user: 'Jane Doe',
      action: 'completed task "Design UI"',
      type: 'task',
      time: '5 mins ago',
    },
    {
      id: 2,
      user: 'John Smith',
      action: 'uploaded new brief for "Project X"',
      type: 'upload',
      time: '30 mins ago',
    },
    {
      id: 3,
      user: 'Alice Brown',
      action: 'commented on "Marketing Strategy"',
      type: 'comment',
      time: '1 hour ago',
    },
    {
      id: 4,
      user: 'Bob Johnson',
      action: 'updated client status for "Acme Inc."',
      type: 'client',
      time: '2 hours ago',
    },
    {
      id: 5,
      user: 'Jane Doe',
      action: 'reviewed "Product Launch Plan"',
      type: 'review',
      time: 'Yesterday',
    },
    {
      id: 6,
      user: 'John Smith',
      action: 'submitted bug report #1234',
      type: 'bug',
      time: 'Yesterday',
    },
    {
      id: 7,
      user: 'Alice Brown',
      action: 'attended team meeting',
      type: 'meeting',
      time: '2 days ago',
    },
    {
      id: 8,
      user: 'Bob Johnson',
      action: 'archived old client files',
      type: 'archive',
      time: '3 days ago',
    },
    {
      id: 9,
      user: 'Jane Doe',
      action: 'created new project "Harmony"',
      type: 'project',
      time: '4 days ago',
    },
    {
      id: 10,
      user: 'John Smith',
      action: 'updated contact details for "Innovate LLC"',
      type: 'contact',
      time: '1 week ago',
    },
    {
      id: 11,
      user: 'Michael Green',
      action: 'signed off on "Website Redesign"',
      type: 'success',
      time: '1 week ago',
    },
    {
      id: 12,
      user: 'Sarah Lee',
      action: 'requested new feature for "App V2"',
      type: 'comment',
      time: '1 week ago',
    },
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'task':
        return <CheckCircleIcon className="w-5 h-5 text-teal-400" />;
      case 'upload':
        return <UploadCloudIcon className="w-5 h-5 text-cyan-400" />;
      case 'comment':
        return <MessageSquareIcon className="w-5 h-5 text-blue-400" />;
      case 'client':
        return <BriefcaseIcon className="w-5 h-5 text-purple-400" />;
      case 'review':
        return <UserIcon className="w-5 h-5 text-yellow-400" />;
      case 'bug':
        return <BugIcon className="w-5 h-5 text-red-400" />;
      case 'meeting':
        return <CalendarIcon className="w-5 h-5 text-green-400" />;
      case 'archive':
        return <FolderIcon className="w-5 h-5 text-gray-400" />;
      case 'project':
        return <PlusSquareIcon className="w-5 h-5 text-pink-400" />;
      case 'contact':
        return <ContactIcon className="w-5 h-5 text-orange-400" />;
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      default:
        return <UserIcon className="w-5 h-5 text-white/50" />;
    }
  };

  return (
    <div
      className={`glassy-tile p-6 flex flex-col ${className || ''}
                    bg-gradient-to-br from-teal-900/60 via-indigo-900/30 to-teal-800/50`}
    >
      <h3 className="text-lg font-semibold text-white/80 mb-4 pb-2 border-b border-blue-600/30">
        Recent Activity
      </h3>
      <div className="flex-grow overflow-y-auto custom-scrollbar pr-2">
        {activities.length > 0 ? (
          <ul className="space-y-4">
            {activities.map((activity) => (
              <motion.li
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex items-start bg-dark-gray/20 rounded-lg p-3
                           transition-all duration-300 hover:bg-dark-gray/40 hover:scale-[1.01]
                           border border-transparent hover:border-blue-500/50 backdrop-blur-sm"
              >
                <div className="mr-3 flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-white/90 text-sm leading-snug">
                    <span className="font-medium text-teal-300">
                      {activity.user}
                    </span>{' '}
                    {activity.action}
                  </p>
                  <span className="text-xs text-white/50 mt-1 block">
                    {activity.time}
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
        ) : (
          <p className="text-white/60 text-sm text-center py-4">
            No recent activity.
          </p>
        )}
      </div>
    </div>
  );
};

RecentActivityFeed.propTypes = {
  className: PropTypes.string,
};

export default RecentActivityFeed;
