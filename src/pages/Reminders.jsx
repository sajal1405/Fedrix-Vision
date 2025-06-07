import React from 'react';
import ReminderList from '../components/reminders/ReminderList.jsx';

const Reminders = () => (
  <div className="p-6">
    <h2 className="text-white text-2xl font-bold mb-4">🔔 Reminders</h2>
    <ReminderList />
  </div>
);

export default Reminders;
