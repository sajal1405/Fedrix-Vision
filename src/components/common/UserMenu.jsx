import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfileContext } from '../../context/UserProfileContext';

const UserMenu = () => {
  const { profile } = useContext(UserProfileContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  if (!profile) return null;

  return (
    <div>
      <button onClick={() => setOpen(!open)} data-testid="menu-toggle">
        {profile.name || 'User'}
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
          <li>Logout</li>
        </ul>
      )}
    </div>
  );
};

export default UserMenu;
