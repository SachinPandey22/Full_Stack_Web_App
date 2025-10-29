import { apiClient } from './api';

/**
 * Meal Logging API Service
 * All functions for interacting with the meal logging backend
 */

// ============= MEALS =============

/**
 * Get all meals for the authenticated user
 * @param {string} date - Optional date filter (YYYY-MM-DD)
 */
export const getMeals = async (date = null) => {
  try {
    const params = date ? { date } : {};
    const response = await apiClient.get('/api/meals/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching meals:', error);
    throw error;
  }
};

/**
 * Get meals for a specific date
 */
export const getMealsByDate = async (date) => {
  try {
    const response = await apiClient.get('/api/meals/', {
      params: { date }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching meals by date:', error);
    throw error;
  }
};

/**
 * Get day summary with totals and targets
 */
export const getDaySummary = async (date) => {
  try {
    const response = await apiClient.get('/api/meals/day_summary/', {
      params: { date }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching day summary:', error);
    throw error;
  }
};

/**
 * Create a new meal
 */
export const createMeal = async (mealData) => {
  try {
    const response = await apiClient.post('/api/meals/', mealData);
    return response.data;
  } catch (error) {
    console.error('Error creating meal:', error);
    throw error;
  }
};

/**
 * Update an existing meal
 */
export const updateMeal = async (mealId, mealData) => {
  try {
    const response = await apiClient.put(`/api/meals/${mealId}/`, mealData);
    return response.data;
  } catch (error) {
    console.error('Error updating meal:', error);
    throw error;
  }
};

/**
 * Delete a meal
 */
export const deleteMeal = async (mealId) => {
  try {
    await apiClient.delete(`/api/meals/${mealId}/`);
  } catch (error) {
    console.error('Error deleting meal:', error);
    throw error;
  }
};

// ============= MEAL TARGETS (GOALS) =============

/**
 * Get user's meal targets (daily goals)
 */
export const getMealTargets = async () => {
  try {
    const response = await apiClient.get('/api/meal-targets/my_targets/');
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      // User hasn't set targets yet
      return null;
    }
    console.error('Error fetching meal targets:', error);
    throw error;
  }
};

/**
 * Create or update meal targets
 */
export const saveMealTargets = async (targets) => {
  try {
    const response = await apiClient.post('/api/meal-targets/', targets);
    return response.data;
  } catch (error) {
    console.error('Error saving meal targets:', error);
    throw error;
  }
};

// ============= WATER INTAKE =============

/**
 * Get water intake for a specific date
 */
export const getWaterIntake = async (date) => {
  try {
    const response = await apiClient.get('/api/water-intake/', {
      params: { date }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching water intake:', error);
    throw error;
  }
};

/**
 * Update water intake for a date
 */
export const updateWaterIntake = async (date, glasses) => {
  try {
    const response = await apiClient.post('/api/water-intake/update/', {
      date,
      glasses
    });
    return response.data;
  } catch (error) {
    console.error('Error updating water intake:', error);
    throw error;
  }
};

/**
 * Get water intake for a date range
 */
export const getWaterIntakeRange = async (startDate, endDate) => {
  try {
    const response = await apiClient.get('/api/water-intake/range/', {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching water intake range:', error);
    throw error;
  }
};

/**
 * Delete water intake for a specific date
 */
export const deleteWaterIntake = async (date) => {
  try {
    await apiClient.delete('/api/water-intake/delete/', {
      params: { date }
    });
  } catch (error) {
    console.error('Error deleting water intake:', error);
    throw error;
  }
};