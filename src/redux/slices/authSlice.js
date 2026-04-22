import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { USER_ROLES } from '../../constants';
import { setAuthToken } from '../../services/api';
import socketService from '../../services/socket';
import api from '../../services/api';
import { transformAuthResponse } from '../../utils/dataTransformers';

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('Attempting login with:', credentials.email);
      const response = await api.post('/auth/login', {
        emailAddress: credentials.email,
        password: credentials.password,
      });
      console.log('Login response:', response);

      // Transform backend response to frontend format
      const transformedUser = transformAuthResponse(response);

      // Set token in API service
      setAuthToken(transformedUser.token);

      // Connect to socket for real-time updates
      socketService.connect(transformedUser.token);

      // Join appropriate room based on user role
      if (transformedUser.role === USER_ROLES.SHOPKEEPER) {
        socketService.joinShopkeeperRoom(transformedUser.id);
      } else if (transformedUser.role === USER_ROLES.DELIVERER) {
        socketService.joinDelivererRoom(transformedUser.id);
      } else if (transformedUser.role === USER_ROLES.STUDENT) {
        socketService.joinStudentRoom(transformedUser.id);
      }

      return transformedUser;
    } catch (error) {
      console.log('Login error details:', error);
      console.log('Error response:', error?.response);
      console.log('Error data:', error?.response?.data);
      const errorMessage = error?.response?.data?.error ||
                          error?.response?.data?.message ||
                          error?.message ||
                          'Login failed. Please check your credentials and try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/users', {
        firstName: userData.name?.split(' ')[0] || '',
        lastName: userData.name?.split(' ').slice(1).join(' ') || '',
        emailAddress: userData.email,
        phoneNumber: userData.phoneNumber || '',
        roleName: userData.role || USER_ROLES.STUDENT,
        password: userData.password,
        isActive: true,
      });

      // Transform backend response to frontend format
      const transformedUser = transformAuthResponse(response);

      return transformedUser;
    } catch (error) {
      const errorMessage = error?.response?.data?.error ||
                          error?.response?.data?.message ||
                          error?.message ||
                          'Registration failed. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear token from API service
      setAuthToken(null);
      // Disconnect socket
      socketService.disconnect();
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
