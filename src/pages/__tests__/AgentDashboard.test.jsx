import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AgentDashboard from '../AgentDashboard.jsx';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { AuthContext } from '../../context/AuthContext';
import { UserProfileContext } from '../../context/UserProfileContext';
import { SidebarContext } from '../../context/SidebarContext';
import { AgentAIProvider } from '../../context/AgentAIContext';

const profile = { name: 'Agent Smith' };

function renderWithRole(role) {
  return render(
    <AuthContext.Provider value={{ user: { role } }}>
      <UserProfileContext.Provider value={{ profile }}>
        <SidebarContext.Provider value={{ isOpen: true }}>
          <AgentAIProvider generated="Generated content" >
            <MemoryRouter initialEntries={["/dashboard/agent"]}>
              <Routes>
                <Route
                  path="/dashboard/agent"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AgentDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<div>fallback</div>} />
              </Routes>
            </MemoryRouter>
          </AgentAIProvider>
        </SidebarContext.Provider>
      </UserProfileContext.Provider>
    </AuthContext.Provider>
  );
}

describe('AgentDashboard route', () => {
  test('loads when user has access and shows generated content', () => {
    renderWithRole('admin');
    expect(screen.getByText('Agent Dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('generated-content')).toHaveTextContent('Generated content');
  });
});
