import { render, screen } from '@testing-library/react';
import UserManagement from '../UserManagement';
import { UserProfileContext } from '../../context/UserProfileContext';

const renderWithProfile = (ui, profile) => {
  return render(
    <UserProfileContext.Provider value={{ profile }}>
      {ui}
    </UserProfileContext.Provider>
  );
};

describe('UserManagement', () => {
  test('shows restriction for clients', () => {
    renderWithProfile(<UserManagement />, { tier: 'client' });
    expect(screen.getByTestId('restricted')).toBeInTheDocument();
  });

  test('renders user list for admins', () => {
    renderWithProfile(<UserManagement />, { tier: 'admin' });
    expect(screen.getByTestId('title')).toHaveTextContent('User Management');
    expect(screen.getByTestId('user-list')).toBeInTheDocument();
  });
});
