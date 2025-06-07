import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Profile from '../Profile';
import { UserProfileContext } from '../../context/UserProfileContext';

const profile = {
  id: '1',
  name: 'Jane Doe',
  email: 'jane@example.com',
  company: 'ACME',
  bio: 'About me',
  experience: '5 years',
  social_links: 'https://example.com',
};

test('renders profile information', () => {
  render(
    <UserProfileContext.Provider value={{ profile }}>
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    </UserProfileContext.Provider>
  );

  expect(screen.getByText('Jane Doe')).toBeInTheDocument();
  expect(screen.getByText('ACME')).toBeInTheDocument();
  expect(screen.getByText('About me')).toBeInTheDocument();
});
