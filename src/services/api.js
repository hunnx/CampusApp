import axios from 'axios';
import { API_BASE_URL } from '../constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add token from Redux store or AsyncStorage
    const token = getState()?.auth?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - token expired or invalid
      // Dispatch logout action or navigate to login
      console.log('Unauthorized access - logging out');
    }
    
    if (error.response?.status === 403) {
      // Forbidden - insufficient permissions
      console.log('Access forbidden');
    }
    
    if (error.response?.status >= 500) {
      // Server error
      console.log('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

// Helper function to get Redux state (you'll need to implement this)
const getState = () => {
  // This would typically come from your Redux store
  // For now, return null as placeholder
  return null;
};

export default api;
