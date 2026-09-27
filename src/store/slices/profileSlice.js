import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  profile: null,
  promotionStatus: null,
  isLoading: false,
  isUpdating: false,
  isRequestingOtp: false,
  isVerifyingOtp: false,
  error: null,
};

// ==================== PROFILE ACTIONS ====================

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

// ==================== PROMOTION ACTIONS ====================

export const fetchPromotionStatus = createAsyncThunk(
  'profile/fetchPromotionStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/promotion/status');
      return response.data; // null if no request
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch status');
    }
  }
);

export const requestPromotionOtp = createAsyncThunk(
  'profile/requestPromotionOtp',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/promotion/request-otp');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyPromotionOtp = createAsyncThunk(
  'profile/verifyPromotionOtp',
  async (otp, { rejectWithValue }) => {
    try {
      const response = await api.post('/promotion/verify-otp', { otp });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to verify OTP');
    }
  }
);

// ==================== SLICE ====================

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

      // Fetch Promotion Status
      .addCase(fetchPromotionStatus.fulfilled, (state, action) => {
        state.promotionStatus = action.payload;
      })

      // Request OTP
      .addCase(requestPromotionOtp.pending, (state) => {
        state.isRequestingOtp = true;
        state.error = null;
      })
      .addCase(requestPromotionOtp.fulfilled, (state) => {
        state.isRequestingOtp = false;
      })
      .addCase(requestPromotionOtp.rejected, (state, action) => {
        state.isRequestingOtp = false;
        state.error = action.payload;
      })

      // Verify OTP
      .addCase(verifyPromotionOtp.pending, (state) => {
        state.isVerifyingOtp = true;
        state.error = null;
      })
      .addCase(verifyPromotionOtp.fulfilled, (state, action) => {
        state.isVerifyingOtp = false;
        state.promotionStatus = action.payload;
      })
      .addCase(verifyPromotionOtp.rejected, (state, action) => {
        state.isVerifyingOtp = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = profileSlice.actions;
export default profileSlice.reducer;