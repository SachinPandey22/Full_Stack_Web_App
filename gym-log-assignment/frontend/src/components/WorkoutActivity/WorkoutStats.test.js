import React from 'react';
import { render, screen } from '@testing-library/react';

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
import WorkoutStats from './WorkoutStats';

describe('WorkoutStats Component', () => {
  it('renders component without crashing', () => {
    render(<WorkoutStats />);
    expect(true).toBe(true);
  });

  it('renders stats functionality', () => {
    render(<WorkoutStats />);
    // Check if component renders
    const component = screen.getByText(/stats/i);
    expect(component).toBeInTheDocument();
  });
});
