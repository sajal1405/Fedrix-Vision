import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserMenu from '../UserMenu';
import { UserProfileContext } from '../../../context/UserProfileContext';
import { AuthContext } from '../../../context/AuthContext';

const renderWithProviders = (
  ui,
  {
    profile = { name: 'Test User', avatar: 'avatar.png' },
    logout = jest.fn(),
    logoutProfile = jest.fn(),
  } = {}
) => {
  return render(
    <AuthContext.Provider value={{ logout }}>
      <UserProfileContext.Provider value={{ profile, logoutProfile }}>
        <MemoryRouter>{ui}</MemoryRouter>
      </UserProfileContext.Provider>
    </AuthContext.Provider>
  );
};

describe('UserMenu', () => {
  test('toggles menu visibility', () => {
    renderWithProviders(<UserMenu />);
    const toggle = screen.getByTestId('menu-toggle');
    expect(screen.queryByTestId('menu-list')).toBeNull();

    fireEvent.click(toggle);
    expect(screen.getByTestId('menu-list')).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(screen.queryByTestId('menu-list')).toBeNull();
  });

  test('shows profile link when open', () => {
    renderWithProviders(<UserMenu />);
    fireEvent.click(screen.getByTestId('menu-toggle'));
    expect(screen.getByTestId('profile-link')).toBeInTheDocument();
  });

  test('renders avatar image when provided', () => {
    renderWithProviders(<UserMenu />);
    const img = screen.getByTestId('avatar-img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'avatar.png');
  });

  test('logout button triggers both context methods', () => {
    const logout = jest.fn();
    const logoutProfile = jest.fn();
    renderWithProviders(<UserMenu />, { logout, logoutProfile });
    fireEvent.click(screen.getByTestId('menu-toggle'));
    fireEvent.click(screen.getByTestId('logout-button'));
    expect(logout).toHaveBeenCalled();
    expect(logoutProfile).toHaveBeenCalled();
  });
});
