import { render, screen } from '@testing-library/react';
import ClientsPage from '../ClientsPage.jsx';
import { UserProfileContext } from '../../context/UserProfileContext';

jest.mock('../../supabaseClient', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
      eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      insert: jest.fn().mockResolvedValue({ error: null }),
      delete: jest.fn(() => ({ eq: jest.fn().mockResolvedValue({ error: null }) })),
    })),
  },
}));

const renderWithProfile = (ui, profile) =>
  render(
    <UserProfileContext.Provider value={{ profile }}>
      {ui}
    </UserProfileContext.Provider>
  );

describe('ClientsPage', () => {
  test('shows manage button for admins', async () => {
    renderWithProfile(<ClientsPage />, { role: 'admin' });
    expect(await screen.findByText(/Clients/)).toBeInTheDocument();
    expect(screen.getByText(/Add Brand/)).toBeInTheDocument();
  });
});
