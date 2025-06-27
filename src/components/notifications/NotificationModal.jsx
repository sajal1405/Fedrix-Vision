import React from 'react';

const NotificationModal = ({ open, notification, onClose }) => {
  if (!open || !notification) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Notification</h2>
        <p>
          <strong>Type:</strong> {notification.type}
        </p>
        <p>
          <strong>Message:</strong> {notification.message}
        </p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default NotificationModal;
