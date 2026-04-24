import axios from 'axios';
import { API_BASE_URL } from '../constants';
import mockApi from './mockApi';

// DEVELOPMENT: set to true to route requests to the in-project mockApi
const USE_MOCK_API = false;

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
    // Don't add auth token for login and register endpoints
    const isAuthEndpoint = config.url?.includes('/Auth/login') ||
                          config.url?.includes('/Users') ||
                          config.url?.includes('/users');

    if (authToken && !isAuthEndpoint) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    // Log request details for debugging
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers,
      isAuthEndpoint,
    });

    return config;
  },
  (error) => Promise.reject(error)
);

// If using mock API, override HTTP methods to return mock responses
if (USE_MOCK_API) {
  api.get = async function (url, config) {
    const res = await mockApi('GET', url, null);
    return res;
  };
  api.post = async function (url, data, config) {
    const res = await mockApi('POST', url, data);
    return res;
  };
  api.put = async function (url, data, config) {
    const res = await mockApi('PUT', url, data);
    return res;
  };
  api.patch = async function (url, data, config) {
    const res = await mockApi('PATCH', url, data);
    return res;
  };
  api.delete = async function (url, config) {
    const res = await mockApi('DELETE', url, null);
    return res;
  };
}

// Response interceptor for error handling (non-mock)
api.interceptors.response.use(
  (response) => {
    // Backend wraps responses in ApiResponse<T> with { Data, Error, Status }
    // Unwrap the data if it's in the backend format
    if (response.data && typeof response.data === 'object') {
      if ('Data' in response.data || 'data' in response.data) {
        // Backend ApiResponse format
        const data = response.data.Data || response.data.data;
        if (response.data.Status === false || response.data.status === false) {
          // Error response from backend
          const error = response.data.Error || response.data.error || 'API error';
          return Promise.reject(new Error(error));
        }
        return data;
      }
    }
    return response.data || response;
  },
  (error) => {
    if (error.response?.status === 401) {
      authToken = null;
      console.log('Unauthorized access - logging out');
    }
    if (error.response?.status === 403) {
      console.log('Access forbidden');
    }
    if (error.response?.status >= 500) {
      console.log('Server error occurred');
    }
    return Promise.reject(error);
  }
);

export default api;
