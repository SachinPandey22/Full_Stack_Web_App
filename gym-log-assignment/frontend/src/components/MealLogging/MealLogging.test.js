// MealLogging.test.js

// Mock axios first
jest.mock('axios');

// Mock the entire service file
jest.mock('../../services/MealLogging', () => ({
  getMealsByDate: jest.fn(),
  createMeal: jest.fn(),
  deleteMeal: jest.fn(),
  getMealTargets: jest.fn(),
  saveMealTargets: jest.fn(),
}));

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MealLogging from './MealLogging';
import * as MealLoggingService from '../../services/MealLogging';

// Mock react-swipeable
jest.mock('react-swipeable', () => ({
  useSwipeable: () => ({})
}));

// Mock date-fns
jest.mock('date-fns', () => ({
  format: jest.fn(() => '2024-01-10'),
  addDays: jest.fn((date, days) => new Date(date.getTime() + days * 86400000)),
  subDays: jest.fn((date, days) => new Date(date.getTime() - days * 86400000)),
}));

// Mock recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div>{children}</div>,
  BarChart: ({ children }) => <div>{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}));

// Mock child components
jest.mock('./DateNavigator', () => () => <div data-testid="date-navigator" />);
jest.mock('./MotivationalQuotes', () => () => <div data-testid="motivational-quotes" />);
jest.mock('./WaterTracker', () => () => <div data-testid="water-tracker" />);

describe('MealLogging Component', () => {
  const mockMealTargets = {
    daily_calories: 2200,
    daily_protein: 165,
    daily_carbs: 220,
    daily_fat: 73
  };

  beforeEach(() => {
    jest.clearAllMocks();
    MealLoggingService.getMealTargets.mockResolvedValue(mockMealTargets);
    MealLoggingService.getMealsByDate.mockResolvedValue([]);
    MealLoggingService.saveMealTargets.mockResolvedValue({ success: true });
  });

  // Test 1: Component renders
  test('renders landing page correctly', () => {
    render(<MealLogging />);
    
    expect(screen.getByText('Meal Tracker')).toBeInTheDocument();
    expect(screen.getByText('Open Meal Tracker')).toBeInTheDocument();
  });

  // Test 2: First time user flow
  test('shows goals modal for new users', async () => {
    MealLoggingService.getMealTargets.mockResolvedValue(null);
    
    render(<MealLogging />);
    
    const openButton = screen.getByText('Open Meal Tracker');
    fireEvent.click(openButton);
    
    await waitFor(() => {
      expect(screen.getByText('Set Your Daily Goals')).toBeInTheDocument();
    });
  });

  // Test 3: Save goals
  test('saves user goals correctly', async () => {
    MealLoggingService.getMealTargets.mockResolvedValue(null);
    
    render(<MealLogging />);
    
    fireEvent.click(screen.getByText('Open Meal Tracker'));
    
    await waitFor(() => {
      expect(screen.getByText('Set Your Daily Goals')).toBeInTheDocument();
    });
    
    // Fill ONLY calories input
    const calorieInput = screen.getByPlaceholderText('e.g. 2200');
    fireEvent.change(calorieInput, { target: { value: '2500' } });
    
    // Click save
    fireEvent.click(screen.getByText('Set Goals & Start Tracking'));
    
    // Check it was called (protein defaults to 165 because input was empty)
    await waitFor(() => {
      expect(MealLoggingService.saveMealTargets).toHaveBeenCalledWith(
        expect.objectContaining({
          daily_calories: 2500
        })
      );
    });
  });

  // Test 4: Load tracker
  test('loads meal tracker successfully', async () => {
    render(<MealLogging />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(MealLoggingService.getMealTargets).toHaveBeenCalled();
    });
    
    // Click to open
    fireEvent.click(screen.getByText('Open Meal Tracker'));
    
    // Just check that tracker loaded
    await waitFor(() => {
      expect(screen.getByText("Today's Progress")).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});