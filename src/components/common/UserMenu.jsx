import React, { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { UserProfileContext } from '../../context/UserProfileContext';

const UserMenu = () => {
  const { profile } = useContext(UserProfileContext);
  const [open, setOpen] = useState(false);

  if (!profile?.name) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div>
      <button onClick={() => setOpen(!open)} data-testid="menu-toggle">
        {profile.name}
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
