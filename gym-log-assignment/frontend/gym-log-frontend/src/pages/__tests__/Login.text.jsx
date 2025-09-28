import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../Login';
import Dashboard from '../Dashboard';
import { AuthProvider } from '../../context/AuthContext';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { loginUser } from '../../services/api';
import { ok, fail } from '../../test-utils/mockApi';

jest.mock('../../services/api', () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(),
  refreshAccess: jest.fn(),
  apiClient: { interceptors: { request: { use: jest.fn() } } },
}));

function renderWithProviders(route = '/login') {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

test('renders fields with labels', () => {
  renderWithProviders();
  expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

test('client validation runs', async () => {
  renderWithProviders();
  fireEvent.click(screen.getByRole('button', { name: /log in/i }));
  expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
});

test('successful login → redirect to dashboard', async () => {
  loginUser.mockImplementation(() => ok({ access: 'abc', user: { email: 'x@y.com' } }));
  renderWithProviders();
  fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'x@y.com' } });
  fireEvent.input(screen.getByLabelText(/password/i), { target: { value: 'secret1' } });
  fireEvent.click(screen.getByRole('button', { name: /log in/i }));
  expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
});

test('invalid login → generic error, no redirect, password cleared, focus email', async () => {
  loginUser.mockImplementation(() => fail('Invalid credentials.'));
  renderWithProviders();
  const email = screen.getByLabelText(/email/i);
  const pass = screen.getByLabelText(/password/i);

  fireEvent.input(email, { target: { value: 'bad@creds.com' } });
  fireEvent.input(pass, { target: { value: 'secret1' } });
  fireEvent.click(screen.getByRole('button', { name: /log in/i }));

  await waitFor(() => expect(pass.value).toBe(''));
  await waitFor(() => expect(document.activeElement).toBe(email));
  expect(screen.queryByText(/welcome/i)).not.toBeInTheDocument();
});
