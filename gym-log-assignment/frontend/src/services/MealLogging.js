import { apiClient } from './api';

/**
 * Meal logging API helpers.
 * Each helper returns the raw JSON payload from the Django REST backend.
 */

// ============= MEALS =============

export const fetchMeals = async (date) => {
  const params = date ? { date } : undefined;
  const response = await apiClient.get('/api/meals/', { params });
  return response.data;
};

export const fetchMealSummary = async (date) => {
  const response = await apiClient.get('/api/meals/day_summary/', {
    params: date ? { date } : undefined,
  });
  return response.data;
};

export const fetchWeeklySummary = async (date) => {
  const response = await apiClient.get('/api/meals/weekly/', {
    params: date ? { date } : undefined,
  });
  return response.data;
};

export const createMeal = async (payload) => {
  const response = await apiClient.post('/api/meals/', payload);
  return response.data;
};

export const updateMeal = async (mealId, payload) => {
  const response = await apiClient.put(`/api/meals/${mealId}/`, payload);
  return response.data;
};

export const deleteMeal = async (mealId) => {
  await apiClient.delete(`/api/meals/${mealId}/`);
};

export const searchFoods = async (query) => {
  const response = await apiClient.get('/api/foods/search/', {
    params: { q: query },
  });
  return response.data;
};

// ============= NUTRITION TARGETS =============

export const fetchNutritionTargets = async () => {
  try {
    const response = await apiClient.get('/api/nutrition/targets/');
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const saveNutritionTargets = async ({ calories, protein, carbs, fat }) => {
  const response = await apiClient.post('/api/nutrition/targets/', {
    target_calories: calories,
    protein_g: protein,
    carbs_g: carbs,
    fat_g: fat,
  });
  return response.data;
};

export const fetchNutritionRecommendations = async () => {
  const response = await apiClient.get('/api/nutrition/recommendations/');
  return response.data;
};

// ============= WATER INTAKE =============

export const fetchWaterIntake = async (date) => {
  if (!date) {
    throw new Error('fetchWaterIntake requires a date parameter (YYYY-MM-DD).');
  }
  const response = await apiClient.get('/api/water/', { params: { date } });
  const entry = Array.isArray(response.data) ? response.data[0] : null;
  return entry || null;
};

export const saveWaterIntake = async ({ date, glasses, glassSize }) => {
  const response = await apiClient.post('/api/water/', {
    date,
    glasses,
    glass_size: glassSize,
  });
  return response.data;
};

export const updateWaterIntake = async (id, payload) => {
  const response = await apiClient.patch(`/api/water/${id}/`, payload);
  return response.data;
};

export const deleteWaterIntake = async (id) => {
  await apiClient.delete(`/api/water/${id}/`);
};
