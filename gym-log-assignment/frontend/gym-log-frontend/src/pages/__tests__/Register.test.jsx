import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../Register';
import { AuthProvider } from '../../context/AuthContext';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Profile from '../Profile';
import { registerUser } from '../../services/api';
import { ok, fail } from '../../test-utils/mockApi';

jest.mock('../../services/api', () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
  refreshAccess: jest.fn(),
  apiClient: { interceptors: { request: { use: jest.fn() } } },
}));

function renderWithProviders(ui, { route = '/register' } = {}) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/register" element={ui} />
          <Route path="/profile" element={<div>Profile Page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

describe('Register Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders fields with labels (accessibility)', () => {
    renderWithProviders(<Register />);
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('client validation: shows errors for invalid inputs and focuses first invalid', async () => {
    renderWithProviders(<Register />);
    fireEvent.click(screen.getByRole('button', { name: /register/i }));
    
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
    
    // first invalid field receives focus
    await waitFor(() => {
      expect(document.activeElement.getAttribute('type')).toBe('email');
    });
  });

  test('password validation: requires at least 6 characters', async () => {
    renderWithProviders(<Register />);
    
    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.input(screen.getByLabelText(/password/i), { target: { value: '12345' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
  });

  test('successful register → redirect to profile', async () => {
    registerUser.mockImplementation(() => ok({ access: 'abc', user: { email: 'a@b.com' } }));
    renderWithProviders(<Register />);
    
    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.input(screen.getByLabelText(/password/i), { target: { value: 'secret1' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Should see profile page content
    expect(await screen.findByText(/profile page/i)).toBeInTheDocument();
  });

  test('successful register shows success toast', async () => {
    registerUser.mockImplementation(() => ok({ access: 'abc', user: { email: 'a@b.com' } }));
    renderWithProviders(<Register />);
    
    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.input(screen.getByLabelText(/password/i), { target: { value: 'secret1' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/account created/i)).toBeInTheDocument();
  });

  test('duplicate email → shows error and preserves email, clears password, focuses email', async () => {
    registerUser.mockImplementation(() => fail('Email already in use.'));
    renderWithProviders(<Register />);
    
    const email = screen.getByLabelText(/email/i);
    const pass = screen.getByLabelText(/password/i);

    fireEvent.input(email, { target: { value: 'a@b.com' } });
    fireEvent.input(pass, { target: { value: 'secret1' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // stays on page, password cleared by component logic
    await waitFor(() => expect(pass.value).toBe(''));
    expect(email.value).toBe('a@b.com');
    await waitFor(() => expect(document.activeElement).toBe(email));
  });

  test('duplicate email shows error toast', async () => {
    registerUser.mockImplementation(() => fail('Email already in use.'));
    renderWithProviders(<Register />);
    
    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.input(screen.getByLabelText(/password/i), { target: { value: 'secret1' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/email already in use/i)).toBeInTheDocument();
  });

  test('shows loading state while submitting', async () => {
    registerUser.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve(ok({ access: 'abc', user: { email: 'a@b.com' } })), 100)
      )
    );
    
    renderWithProviders(<Register />);
    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.input(screen.getByLabelText(/password/i), { target: { value: 'secret1' } });
    
    const button = screen.getByRole('button', { name: /register/i });
    fireEvent.click(button);

    // Button should be disabled while loading
    expect(button).toBeDisabled();
    
    await waitFor(() => expect(button).not.toBeDisabled());
  });

  test('handles network error gracefully', async () => {
    registerUser.mockImplementation(() => Promise.reject(new Error('Network error')));
    renderWithProviders(<Register />);
    
    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
    fireEvent.input(screen.getByLabelText(/password/i), { target: { value: 'secret1' } });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Should show generic error message
    expect(await screen.findByText(/registration failed/i)).toBeInTheDocument();
  });
});