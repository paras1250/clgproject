import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors with better messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - token expired or invalid
    if (error.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/login?error=session_expired';
      }
    }

    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request took too long. This might be due to large training data. Please try with smaller text or check if backend is running.';
    }

    // Handle network errors
    if (!error.response) {
      // More specific error messages
      if (error.code === 'ECONNREFUSED') {
        error.message = 'Cannot connect to backend server. Make sure the backend is running on http://localhost:5000';
      } else if (error.code === 'ETIMEDOUT') {
        error.message = 'Connection timeout. Your training data might be too large or backend is slow. Please try again.';
      } else if (error.message && error.message.includes('Network Error')) {
        error.message = 'Network error. Please check:\n1. Backend server is running (http://localhost:5000)\n2. Your internet connection\n3. CORS settings in backend';
      } else {
        error.message = 'Network error - please check your internet connection and ensure backend server is running';
      }
    }

    // Handle 503 - service unavailable
    if (error.response?.status === 503) {
      error.message = 'Service temporarily unavailable - please try again in a moment';
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (email: string, password: string, name: string) => {
    const response = await api.post('/api/auth/register', { email, password, name });
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/api/auth/login', { email, password });
    return response.data;
  },
};

// Bots API
export const botsAPI = {
  create: async (formData: FormData) => {
    const response = await api.post('/api/bots/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // 2 minutes for large training text and file uploads
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    return response.data;
  },
  list: async () => {
    const response = await api.get('/api/bots/list');
    return response.data;
  },
  get: async (id: string) => {
    const response = await api.get(`/api/bots/${id}`);
    return response.data;
  },
  getTrainingData: async (id: string) => {
    const response = await api.get(`/api/bots/${id}/training-data`);
    return response.data;
  },
  chat: async (botId: string, message: string, sessionId?: string) => {
    const response = await api.post(`/api/bots/${botId}/chat`, { message, sessionId });
    return response.data;
  },
  getEmbedScript: async (botId: string, theme: string = 'default', position: string = 'bottom-right') => {
    const response = await api.get(`/api/bots/${botId}/embed-script`, {
      params: { theme, position },
      responseType: 'text'
    });
    return response.data;
  },
  update: async (botId: string, formData: FormData) => {
    const response = await api.put(`/api/bots/${botId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // 2 minutes for large training text and file uploads
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/bots/${id}`);
    return response.data;
  },
  deleteConversation: async (botId: string, sessionId: string) => {
    const response = await api.delete(`/api/bots/${botId}/conversations/${sessionId}`);
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getBotAnalytics: async (botId: string) => {
    const response = await api.get(`/api/analytics/bot/${botId}`);
    return response.data;
  },
  getDashboard: async () => {
    const response = await api.get('/api/analytics/dashboard');
    return response.data;
  },
};

export default api;

