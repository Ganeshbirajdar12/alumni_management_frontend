import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  pendingPromotions: [],
  isLoading: false,
  error: null,
};

export const fetchPendingPromotions = createAsyncThunk(
  'admin/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/promotions/pending');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch');
    }
  }
);

export const approvePromotion = createAsyncThunk(
  'admin/approve',
  async ({ id, remarks }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/promotions/${id}/approve`, { remarks });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve');
    }
  }
);

export const rejectPromotion = createAsyncThunk(
  'admin/reject',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/admin/promotions/${id}/reject`, { reason });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingPromotions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPendingPromotions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingPromotions = action.payload;
      })
      .addCase(fetchPendingPromotions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(approvePromotion.fulfilled, (state, action) => {
        // Remove from pending list
        state.pendingPromotions = state.pendingPromotions.filter(
          (p) => p.id !== action.payload.id
        );
      })
      .addCase(rejectPromotion.fulfilled, (state, action) => {
        state.pendingPromotions = state.pendingPromotions.filter(
          (p) => p.id !== action.payload.id
        );
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;