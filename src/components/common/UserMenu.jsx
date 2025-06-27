import React, { useContext, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { UserProfileContext } from '../../context/UserProfileContext';
import { AuthContext } from '../../context/AuthContext';
import { HiChevronDown } from 'react-icons/hi';

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
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        data-testid="menu-toggle"
        className="flex items-center space-x-2 focus:outline-none"
      >
        {profile.avatar && (
          <img
            src={profile.avatar}
            alt="avatar"
            className="w-6 h-6 rounded-full inline-block"
            data-testid="avatar-img"
          />
        )}
        <span className="whitespace-nowrap">{profile.name}</span>
        <HiChevronDown className="text-white" />
      </button>
      {open && (
        <ul
          data-testid="menu-list"
          className="absolute right-0 mt-2 bg-black/80 backdrop-blur-sm border border-white/10 rounded-md py-2 w-32 text-sm"
        >
          <li>
            <button
              data-testid="profile-link"
              onClick={() => {
                setOpen(false);
                navigate('/dashboard/profile');
              }}
              className="block w-full text-left px-4 py-2 hover:bg-white/10"
            >
              Profile
            </button>
          </li>
          <li>
            <button
              data-testid="logout-button"
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-white/10"
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default UserMenu;
