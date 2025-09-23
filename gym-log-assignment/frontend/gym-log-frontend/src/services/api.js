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
  const res = await apiClient.post('/api/auth/register/', { email, password });
  return res.data; // e.g. { access: '...', user: { email } }
}
export async function loginUser({ email, password }) {
  const res = await apiClient.post('/api/auth/login/', { email, password });
  return res.data; // e.g. { access: '...', user: { email } }
}
export async function refreshAccess() {
  // optional if you implement httpOnly cookie refresh
  const res = await apiClient.post('/api/auth/refresh/');
  return res.data; // e.g. { access: '...' }
}
