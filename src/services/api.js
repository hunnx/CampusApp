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

// Store token externally
let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add token if available
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
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
      // Clear token and logout
      authToken = null;
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

export default api;
