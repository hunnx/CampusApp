import axios from 'axios';
import { API_BASE_URL } from '../constants';
import mockApi from './mockApi';

// DEVELOPMENT: set to true to route requests to the in-project mockApi
const USE_MOCK_API = false;
console.log('[API] USE_MOCK_API:', USE_MOCK_API);

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('[API] Axios instance created with baseURL:', API_BASE_URL);

// Store token externally
let authToken = null;

export const setAuthToken = (token) => {
  authToken = token;
  console.log('[API] Auth token set:', token ? 'Token present' : 'No token');
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('[API Request Interceptor] Called for:', config.url);
    config.headers = config.headers || {};
    if (!config.headers.Accept) {
      config.headers.Accept = 'application/json, text/plain, */*';
    }
    if (!config.headers['Content-Type'] && config.method !== 'get') {
      config.headers['Content-Type'] = 'application/json';
    }

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
      fullURL: config.baseURL + config.url,
    });

    return config;
  },
  (error) => {
    console.error('[API Request Interceptor Error]', error);
    return Promise.reject(error);
  }
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
    console.log('[API Response] Raw response:', response);
    console.log('[API Response] Response data:', response.data);
    // Backend wraps responses in ApiResponse<T> with { Data, Error, Status }
    // Unwrap the data if it's in the backend format
    if (response.data && typeof response.data === 'object') {
      if ('Data' in response.data || 'data' in response.data) {
        // Backend ApiResponse format
        const data = response.data.Data || response.data.data;
        console.log('[API Response] Unwrapped data:', data);
        if (response.data.Status === false || response.data.status === false) {
          // Error response from backend
          const error = response.data.Error || response.data.error || 'API error';
          return Promise.reject(new Error(error));
        }
        return data;
      }
    }
    console.log('[API Response] Returning response.data:', response.data);
    return response.data || response;
  },
  (error) => {
    console.error('[API Error]', error);
    console.error('[API Error] Response:', error.response);
    console.error('[API Error] Response data:', error.response?.data);
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
