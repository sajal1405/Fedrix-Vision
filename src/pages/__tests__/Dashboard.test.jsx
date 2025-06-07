import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import { UserProfileContext } from '../../context/UserProfileContext';
import { AuthContext } from '../../context/AuthContext';
import { SidebarContext } from '../../context/SidebarContext';

jest.mock('../../components/kanban/KanbanBoard.jsx', () => () => <div data-testid="kanban" />);
jest.mock('../../components/calendar/Calendar.jsx', () => () => <div data-testid="calendar" />);
jest.mock('../../components/blog/BlogManager.jsx', () => () => <div data-testid="blog" />);
jest.mock('../../components/ai/AgentDashboard.jsx', () => () => <div data-testid="agent" />);
jest.mock('../../components/reminders/ReminderList.jsx', () => () => <div data-testid="reminders" />);

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
