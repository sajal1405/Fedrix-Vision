import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { UserProfileContext } from '../../context/UserProfileContext';
import { AuthContext } from '../../context/AuthContext';
import { SidebarContext } from '../../context/SidebarContext';

const profile = { name: 'John Doe' };

function renderWithRole(role) {
  return render(
    <AuthContext.Provider value={{ user: { role } }}>
      <UserProfileContext.Provider value={{ profile }}>
        <SidebarContext.Provider value={{ isOpen: true }}>
          <MemoryRouter>
            <Dashboard />
          </MemoryRouter>
        </SidebarContext.Provider>
      </UserProfileContext.Provider>
    </AuthContext.Provider>
  );
}

describe('Dashboard module visibility', () => {
  test('superadmin sees all standard modules', () => {
    renderWithRole('superadmin');
    expect(screen.getByText(/Taskboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Calendar/i)).toBeInTheDocument();
    expect(screen.getByText(/Blog Manager/i)).toBeInTheDocument();
    // User Management module not implemented in Dashboard
    expect(screen.queryByText(/User Management/i)).toBeNull();
  });

  test('admin does not see User Management module', () => {
    renderWithRole('admin');
    expect(screen.getByText(/Taskboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Calendar/i)).toBeInTheDocument();
    expect(screen.getByText(/Blog Manager/i)).toBeInTheDocument();
    expect(screen.queryByText(/User Management/i)).toBeNull();
  });

  test('client sees only Taskboard module', () => {
    renderWithRole('client');
    expect(screen.getByText(/Taskboard/i)).toBeInTheDocument();
    expect(screen.queryByText(/Calendar/i)).toBeNull();
    expect(screen.queryByText(/Blog Manager/i)).toBeNull();
    expect(screen.queryByText(/User Management/i)).toBeNull();
  });
});
