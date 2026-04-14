import { API_BASE_URL } from '../constants';

/**
 * Auth service functions.
 * Replace placeholders with real API endpoints as needed.
 */
export const login = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Login failed');
    }

    return res.json();
  } catch (error) {
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Registration failed');
    }

    return res.json();
  } catch (error) {
    throw error;
  }
};

export default { login, register };
