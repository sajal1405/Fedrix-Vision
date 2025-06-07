import React, { useContext, useState } from 'react';

import { useNavigate, Navigate } from 'react-router-dom';

import { UserProfileContext } from '../../context/UserProfileContext';
import { AuthContext } from '../../context/AuthContext';

const UserMenu = () => {
  const { profile, logoutProfile } = useContext(UserProfileContext);
  const { logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    logoutProfile();
    navigate('/login');
  };

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
          <li>
            <button
              data-testid="profile-link"
              onClick={() => {
                setOpen(false);
                navigate('/dashboard/profile');
              }}
            >
              Profile
            </button>
          </li>
          <li>
            <button data-testid="logout-button" onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default UserMenu;
