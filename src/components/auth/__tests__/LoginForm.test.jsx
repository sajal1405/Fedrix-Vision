jest.mock('../../../supabaseClient', () => ({
  supabase: { auth: { signInWithPassword: jest.fn() } },
}));

import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../LoginForm';
import { AuthContext } from '../../../context/AuthContext';
import { UserProfileContext } from '../../../context/UserProfileContext';
import { MemoryRouter } from 'react-router-dom';
import { supabase } from '../../../supabaseClient';

function renderWithProviders(ui) {
  return render(
    <AuthContext.Provider value={{ login: jest.fn() }}>
      <UserProfileContext.Provider value={{ saveProfile: jest.fn() }}>
        <MemoryRouter>{ui}</MemoryRouter>
      </UserProfileContext.Provider>
    </AuthContext.Provider>,
  );
}

describe('LoginForm', () => {
  test('renders inputs and updates values', () => {
    renderWithProviders(<LoginForm />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passInput = screen.getByPlaceholderText(/enter password/i);
    const sliderText = screen.getByText(/slide to login/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    expect(emailInput).toBeInTheDocument();
    expect(passInput).toBeInTheDocument();
    expect(sliderText).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passInput, { target: { value: 'secret' } });

    expect(emailInput.value).toBe('user@example.com');
    expect(passInput.value).toBe('secret');
  });

  test('submits form when login button clicked', () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: {} },
      error: null,
    });

    renderWithProviders(<LoginForm />);

    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText(/enter password/i), {
      target: { value: 'secret' },
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'secret',
    });
  });
});
