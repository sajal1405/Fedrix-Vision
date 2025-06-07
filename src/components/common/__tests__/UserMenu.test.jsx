import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import UserMenu from '../UserMenu';
import { UserProfileContext } from '../../../context/UserProfileContext';

const renderWithProfile = (ui, profile = { name: 'Test User' }) => {
  return render(
    <UserProfileContext.Provider value={{ profile }}>
      <MemoryRouter>{ui}</MemoryRouter>
    </UserProfileContext.Provider>
  );
};

describe('UserMenu', () => {
  test('toggles menu visibility', () => {
    renderWithProfile(<UserMenu />);
    const toggle = screen.getByTestId('menu-toggle');
    expect(screen.queryByTestId('menu-list')).toBeNull();

    fireEvent.click(toggle);
    expect(screen.getByTestId('menu-list')).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(screen.queryByTestId('menu-list')).toBeNull();
  });

  test('shows profile link when open', () => {
    renderWithProfile(<UserMenu />);
    fireEvent.click(screen.getByTestId('menu-toggle'));
    expect(screen.getByTestId('profile-link')).toBeInTheDocument();
  });
});
