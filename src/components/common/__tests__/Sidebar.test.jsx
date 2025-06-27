import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../Sidebar.jsx';
import { AuthContext } from '../../../context/AuthContext';
import { UserProfileContext } from '../../../context/UserProfileContext';
import { SidebarContext } from '../../../context/SidebarContext';

function renderSidebar(role = 'admin', isOpen = true, opts = {}) {
  const logout = opts.logout || jest.fn();
  const logoutProfile = opts.logoutProfile || jest.fn();
  render(
    <AuthContext.Provider value={{ user: { role }, logout }}>
      <UserProfileContext.Provider value={{ profile: { role, name: 'Test User' }, logoutProfile }}>
        <SidebarContext.Provider value={{ isOpen }}>
          <MemoryRouter>
            <Sidebar />
          </MemoryRouter>
        </SidebarContext.Provider>
      </UserProfileContext.Provider>
    </AuthContext.Provider>
  );
  return { logout, logoutProfile };
}

test('renders role specific links', () => {
  renderSidebar('client');
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
  expect(screen.getByText('Kanban')).toBeInTheDocument();
  expect(screen.queryByText('Calendar')).toBeNull();
  expect(screen.queryByText('Users')).toBeNull();
});

test('logout calls context handlers', () => {
  const { logout, logoutProfile } = renderSidebar('admin');
  fireEvent.click(screen.getByText('Logout'));
  expect(logout).toHaveBeenCalled();
  expect(logoutProfile).toHaveBeenCalled();
});

test('closed sidebar uses hidden classes', () => {
  renderSidebar('admin', false);
  const aside = screen.getByRole('complementary');
  expect(aside.className).toMatch(/w-0/);
});
