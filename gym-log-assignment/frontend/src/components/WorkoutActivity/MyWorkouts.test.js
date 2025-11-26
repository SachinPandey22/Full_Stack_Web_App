import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Mock axios
jest.mock('axios');

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock AuthContext
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    getAccessToken: jest.fn(() => 'fake-token'),
    user: { username: 'testuser' }
  })
}));

// Import component AFTER mocks
import MyWorkouts from './MyWorkouts';

describe('MyWorkouts Component', () => {
  it('renders component without crashing', () => {
    render(
      <BrowserRouter>
        <MyWorkouts />
      </BrowserRouter>
    );
    expect(true).toBe(true);
  });

  it('displays My Workouts heading', () => {
    render(
      <BrowserRouter>
        <MyWorkouts />
      </BrowserRouter>
    );
    expect(screen.getByRole('heading', { name: /my workouts/i })).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(
      <BrowserRouter>
        <MyWorkouts />
      </BrowserRouter>
    );
    expect(screen.getByText(/back to library/i)).toBeInTheDocument();
  });
});
