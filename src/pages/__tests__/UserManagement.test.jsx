jest.mock('../../supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
      insert: jest.fn().mockResolvedValue({ error: null }),
      update: jest.fn(() => ({ eq: jest.fn().mockResolvedValue({ error: null }) })),
      eq: jest.fn().mockReturnThis(),
    })),
    auth: {
      signUp: jest.fn().mockResolvedValue({ data: { user: { id: 1, email: 'test@test.com' } }, error: null }),
      admin: { updateUserById: jest.fn().mockResolvedValue({}) },
    },
  },
}));

import { render, screen } from '@testing-library/react';
import UserManagement from '../../components/admin/UserManagement.jsx';
import { UserProfileContext } from '../../context/UserProfileContext';

const renderWithProfile = (ui, profile) => {
  return render(
    <UserProfileContext.Provider value={{ profile }}>
      {ui}
    </UserProfileContext.Provider>
  );
};

describe('UserManagement', () => {
  test('renders management interface', () => {
    renderWithProfile(<UserManagement />, { role: 'super_admin' });
    expect(screen.getByText('User Management')).toBeInTheDocument();
    expect(screen.getByText('Create User')).toBeInTheDocument();
  });
});
