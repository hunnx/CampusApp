import axios from 'axios';
import { API_BASE_URL } from '../constants';
import mockApi from './mockApi';

// DEVELOPMENT: set to true to route requests to the in-project mockApi
const USE_MOCK_API = true;

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
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
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
  (response) => response.data || response,
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
