import React, { useContext, useState } from 'react';
import { UserProfileContext } from '../../context/UserProfileContext';

const UserMenu = () => {
  const { profile } = useContext(UserProfileContext);
  const [open, setOpen] = useState(false);

  if (!profile) return null;

  return (
    <div>
      <button onClick={() => setOpen(!open)} data-testid="menu-toggle">
        {profile.name || 'User'}
      </button>
      {open && (
        <ul data-testid="menu-list">
          <li>Profile</li>
          <li>Logout</li>
        </ul>
      )}
    </div>
  );
};

export default UserMenu;
