import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DailyOverview from '../DailyOverview';
import { fetchMealSummary, fetchWaterIntake } from '../../../services/MealLogging';
import { getNutritionTargets, getUserWorkouts } from '../../../services/api';

jest.mock('../../../services/MealLogging', () => ({
  fetchMealSummary: jest.fn(),
  fetchWaterIntake: jest.fn(),
}));

jest.mock('../../../services/api', () => ({
  getNutritionTargets: jest.fn(),
  getUserWorkouts: jest.fn(),
}));

describe('DailyOverview data rendering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetchMealSummary.mockResolvedValue({
      totals: { calories: 1500, protein: 120, carbs: 180, fats: 50 },
      remaining: { calories: 500 },
      targets: { calories: 2000, protein: 150 },
    });
    fetchWaterIntake.mockResolvedValue({
      glasses: 4,
      glass_size: 400,
      total_ml: 1600,
    });
    getNutritionTargets.mockResolvedValue({
      macros: { protein_g: 150 },
      target_calories: 2000,
    });
    getUserWorkouts.mockResolvedValue([]);
  });

  it('renders calories and protein from fetched summary', async () => {
    render(<DailyOverview />);

    expect(await screen.findByText(/1500 kcal/i)).toBeInTheDocument();
    expect(screen.getByText(/120 g/i)).toBeInTheDocument();
  });
});
