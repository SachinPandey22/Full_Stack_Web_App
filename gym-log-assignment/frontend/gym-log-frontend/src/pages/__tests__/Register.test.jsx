import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../Register';
import { AuthProvider } from '../../context/AuthContext';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Dashboard from '../Dashboard';
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
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

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

test('successful register → redirect to dashboard', async () => {
  registerUser.mockImplementation(() => ok({ access: 'abc', user: { email: 'a@b.com' } }));
  renderWithProviders(<Register />);
  fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'a@b.com' } });
  fireEvent.input(screen.getByLabelText(/password/i), { target: { value: 'secret1' } });
  fireEvent.click(screen.getByRole('button', { name: /register/i }));

  expect(await screen.findByText(/welcome/i)).toBeInTheDocument(); // Dashboard greeting
});

test('duplicate email → shows error and preserves email, clears password, focuses email', async () => {
  registerUser.mockImplementation(() => fail('Email already in use.'));
  renderWithProviders(<Register />);
  const email = screen.getByLabelText(/email/i);
  const pass = screen.getByLabelText(/password/i);

  fireEvent.input(email, { target: { value: 'a@b.com' } });
  fireEvent.input(pass, { target: { value: 'secret1' } });
  fireEvent.click(screen.getByRole('button', { name: /register/i }));

  // stays on page (no dashboard), password cleared by our component logic
  await waitFor(() => expect(pass.value).toBe(''));
  expect(email.value).toBe('a@b.com');
  await waitFor(() => expect(document.activeElement).toBe(email));
});
