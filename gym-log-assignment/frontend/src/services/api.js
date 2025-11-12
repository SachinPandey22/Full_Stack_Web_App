import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // allows httpOnly refresh cookie flows if you use them
});

// existing test helpers you already had...
export const apiService = {
  testBackendConnection: async () => {
    try {
      const response = await apiClient.get('/');
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      return { success: false, error: error.message, status: error.response?.status };
    }
  },
  testApiEndpoint: async () => {
    try {
      const response = await apiClient.get('/api/hello/');
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      return { success: false, error: error.message, status: error.response?.status };
    }
  },
};

// 🔐 Minimal auth API (adjust URLs to match your DRF when ready)
export async function registerUser({ email, password }) {
  const res = await apiClient.post('/api/register/', { email, password });
  return res.data; // e.g. { access: '...', user: { email } }
}
export async function loginUser({ email, password }) {
  const res = await apiClient.post('/api/login/', { email, password });
  return res.data; // e.g. { access: '...', user: { email } }
}
export async function refreshAccess() {
  // optional if you implement httpOnly cookie refresh
  const res = await apiClient.post('/api/refresh/');
  return res.data; // e.g. { access: '...' }
}
// 📝 Profile API (⬇️ NEWLY ADDED)
export async function getProfile(token) {
  // GET -> fetch the logged-in user's profile from Django
  const res = await apiClient.get('/api/profile/', {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ include JWT access token
    },
  });
  return res.data; // { name, sex, height, weight, goal }
}

export async function updateProfile(values, token) {
  // PUT -> update logged-in user's profile in PostgreSQL
  const res = await apiClient.put('/api/profile/', values, {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ include JWT access token
    },
  });
  return res.data; // returns updated profile object
}

// 🍎 Nutrition API
export async function getNutritionTargets(token) {
  const res = await apiClient.get('/api/nutrition/targets/', {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return res.data; // backend returns bmr, tdee, target_calories, and macros/meta (or flat)
}

// Nutrition snapshots
export async function getNutritionSnapshots(token) {
  const res = await apiClient.get('/api/nutrition/snapshots/', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // [{date,bmr,tdee,target_calories,protein_g,fat_g,carbs_g,meta}, ...]
}

export async function createNutritionSnapshot(token) {
  const res = await apiClient.post('/api/nutrition/snapshots/', null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // the created/updated snapshot for today
}

export async function getUserWorkouts() {
  const res = await apiClient.get('/api/my-workouts/');
  return res.data; // [{id, exercise, added_date, sets, reps, notes}, ...]
}
export const sendChatMessage = async (message, userInfo = {}, token = null) => {
  const config = {};
  if (token) {
    config.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  const res = await apiClient.post(
    "/api/chat_with_ai/",
    { message, user: userInfo },
    config,
  );

  return res.data;
};
// Delete a nutrition snapshot by Iuser
export function deleteAccount(token, confirmText) {
  return apiClient.post(
    '/api/delete-account/',
    { confirm: confirmText },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export function exportUserDataCsv(token, { start, end, tz = 'America/Chicago' }) {
  return apiClient.get('/api/export/', {
    params: { start, end, tz },
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob', // important so we get file data, not JSON
  });
}
