import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import Login from '../../pages/Login';
import Dashboard from '../../pages/Dashboard';

// Helper component to simulate a logged-in session
function FakeLoginSetter() {
  const { setSession } = useAuth();
  React.useEffect(() => {
    setSession({ access: 'abc', user: { email: 'test@me.com' } });
  }, [setSession]);
  return null;
}

function renderApp(initialRoute = '/dashboard', loggedIn = false) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[initialRoute]}>
        {loggedIn && <FakeLoginSetter />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

test('unauthenticated user is redirected to /login', () => {
  renderApp('/dashboard', /* loggedIn */ false);
  expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
});

test('logout from protected page sends you back to /login', () => {
  renderApp('/dashboard', /* loggedIn */ true);
  // On dashboard, click Logout
  fireEvent.click(screen.getByRole('button', { name: /logout/i }));
  // We used window.location.href in Dashboard, so assert login page appears
  expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
});
