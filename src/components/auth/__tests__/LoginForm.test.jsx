jest.mock('../../../supabaseClient', () => ({ supabase: { auth: { signInWithPassword: jest.fn() } } }));

import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from '../LoginForm';
import { AuthContext } from '../../../context/AuthContext';
import { MemoryRouter } from 'react-router-dom';

function renderWithProviders(ui) {
  return render(
    <AuthContext.Provider value={{ login: jest.fn() }}>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );
}

describe('LoginForm', () => {
  test('renders inputs and updates values', () => {
    renderWithProviders(<LoginForm />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passInput = screen.getByPlaceholderText(/enter password/i);
    const sliderText = screen.getByText(/slide to login/i);

    expect(emailInput).toBeInTheDocument();
    expect(passInput).toBeInTheDocument();
    expect(sliderText).toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
    fireEvent.change(passInput, { target: { value: 'secret' } });

    expect(emailInput.value).toBe('user@example.com');
    expect(passInput.value).toBe('secret');
  });
});
