// src/store/slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  profile: null,
  isLoading: false,
  isUpdating: false,
  error: null,
};

export const fetchProfile = createAsyncThunk(
  'profile/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/profile/me');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/update',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/profile/me', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const updateProfilePicture = createAsyncThunk(
  'profile/updatePicture',
  async (profilePicture, { rejectWithValue }) => {
    try {
      const response = await api.put('/profile/picture', { profilePicture });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update picture');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload;
      })
      // Update Profile Picture
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export const { clearError } = profileSlice.actions;
export default profileSlice.reducer;