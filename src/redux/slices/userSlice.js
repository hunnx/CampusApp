import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId, { rejectWithValue }) => {
    try {
      // API call would go here
      // const response = await api.get(`/users/${userId}`);
      
      // Mock response for demo
      const mockProfile = {
        id: userId,
        name: 'John Doe',
        email: 'john@campus.edu',
        phone: '+1234567890',
        role: 'student',
        avatar: 'https://via.placeholder.com/100x100/FF6B35/FFFFFF?text=JD',
        address: 'Hostel A, Room 101',
        createdAt: new Date().toISOString(),
      };
      
      return mockProfile;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      // API call would go here
      // const response = await api.put('/users/profile', profileData);
      
      // Mock response for demo
      const updatedProfile = {
        ...profileData,
        updatedAt: new Date().toISOString(),
      };
      
      return updatedProfile;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateProfileLocal: (state, action) => {
      state.profile = { ...state.profile, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, updateProfileLocal } = userSlice.actions;
export default userSlice.reducer;
