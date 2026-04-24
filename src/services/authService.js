import { API_BASE_URL } from '../constants';

/**
 * Auth service functions.
 * Replace placeholders with real API endpoints as needed.
 */
export const login = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE_URL}/Auth/login`, {
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
    console.log('🚀 Registration API Call - Request Payload:', JSON.stringify(userData, null, 2));

    const res = await fetch(`${API_BASE_URL}/Users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
      },
      body: JSON.stringify(userData),
    });

    console.log('📡 Registration API Response - Status:', res.status);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('❌ Registration Error Response:', err);
      throw new Error(err.error || err.message || 'Registration failed');
    }

    const data = await res.json();
    console.log('✅ Registration Success Response:', data);
    return data;
  } catch (error) {
    console.error('❌ Registration Error:', error.message);
    throw error;
  }
};

export default { login, register };
