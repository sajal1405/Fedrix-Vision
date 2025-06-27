import React, { useContext, useState } from 'react';

import { useNavigate } from 'react-router-dom';

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


  return (
    <div>
      <button onClick={() => setOpen(!open)} data-testid="menu-toggle">
        {profile.avatar && (
          <img
            src={profile.avatar}
            alt="avatar"
            className="w-6 h-6 rounded-full inline-block mr-2"
            data-testid="avatar-img"
          />
        )}
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
