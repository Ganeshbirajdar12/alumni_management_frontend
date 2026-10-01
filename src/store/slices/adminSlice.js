import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  // Pending promotions (existing)
  pendingPromotions: [],
  
  // Admin management (new)
  admins: [],
  auditLogs: [],
  
  // Loading states
  isLoading: false,
  isCreating: false,
  error: null,
};

// ==================== PROMOTIONS ====================

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

// ==================== ADMIN MANAGEMENT ====================

export const fetchAllAdmins = createAsyncThunk(
  'admin/fetchAllAdmins',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/super-admin/admins');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch admins');
    }
  }
);

export const createAdmin = createAsyncThunk(
  'admin/createAdmin',
  async (adminData, { rejectWithValue }) => {
    try {
      const response = await api.post('/super-admin/admins', adminData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create admin');
    }
  }
);

export const deactivateAdmin = createAsyncThunk(
  'admin/deactivateAdmin',
  async (adminId, { rejectWithValue }) => {
    try {
      await api.put(`/super-admin/admins/${adminId}/deactivate`);
      return adminId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to deactivate');
    }
  }
);

export const activateAdmin = createAsyncThunk(
  'admin/activateAdmin',
  async (adminId, { rejectWithValue }) => {
    try {
      await api.put(`/super-admin/admins/${adminId}/activate`);
      return adminId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to activate');
    }
  }
);

export const deleteAdmin = createAsyncThunk(
  'admin/deleteAdmin',
  async (adminId, { rejectWithValue }) => {
    try {
      await api.delete(`/super-admin/admins/${adminId}`);
      return adminId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete');
    }
  }
);

export const resetAdminPassword = createAsyncThunk(
  'admin/resetPassword',
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/super-admin/admins/${adminId}/reset-password`);
      return { adminId, newPassword: response.data.newPassword };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);

// ==================== AUDIT LOGS ====================

export const fetchAuditLogs = createAsyncThunk(
  'admin/fetchAuditLogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/super-admin/audit-logs');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch logs');
    }
  }
);

// ==================== SLICE ====================

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
      // Promotions
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
        state.pendingPromotions = state.pendingPromotions.filter(
          (p) => p.id !== action.payload.id
        );
      })
      .addCase(rejectPromotion.fulfilled, (state, action) => {
        state.pendingPromotions = state.pendingPromotions.filter(
          (p) => p.id !== action.payload.id
        );
      })

      // Admin list
      .addCase(fetchAllAdmins.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllAdmins.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admins = action.payload;
      })
      .addCase(fetchAllAdmins.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create admin
      .addCase(createAdmin.pending, (state) => {
        state.isCreating = true;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.isCreating = false;
        state.admins.push(action.payload);
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload;
      })

      // Deactivate / Activate / Delete
      .addCase(deactivateAdmin.fulfilled, (state, action) => {
        const admin = state.admins.find((a) => a.id === action.payload);
        if (admin) admin.isActive = false;
      })
      .addCase(activateAdmin.fulfilled, (state, action) => {
        const admin = state.admins.find((a) => a.id === action.payload);
        if (admin) admin.isActive = true;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.admins = state.admins.filter((a) => a.id !== action.payload);
      })

      // Audit logs
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.auditLogs = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;