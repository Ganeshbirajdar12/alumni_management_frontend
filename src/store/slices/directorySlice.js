import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  alumni: [],
  featuredAlumni: [],
  filterOptions: {},
  currentAlumni: null,
  pagination: {
    page: 0,
    size: 9,
    totalElements: 0,
    totalPages: 0,
  },
  filters: {
    searchTerm: '',
    department: '',
    graduationYear: '',
    company: '',
    industry: '',
    location: '',
    degree: '',
    sortBy: 'firstName',
    sortDirection: 'asc',
    page: 0,
    size: 9,
  },
  isLoading: false,
  error: null,
};

export const searchAlumni = createAsyncThunk(
  'directory/search',
  async (filters, { rejectWithValue }) => {
    try {
      const response = await api.post('/directory/search', filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

export const fetchFeaturedAlumni = createAsyncThunk(
  'directory/featured',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/directory/featured');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured');
    }
  }
);

export const fetchFilterOptions = createAsyncThunk(
  'directory/filters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/directory/filters');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch filters');
    }
  }
);

export const fetchAlumniById = createAsyncThunk(
  'directory/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/directory/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch alumni');
    }
  }
);

const directorySlice = createSlice({
  name: 'directory',
  initialState,
  reducers: {
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentAlumni: (state) => {
      state.currentAlumni = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchAlumni.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchAlumni.fulfilled, (state, action) => {
        state.isLoading = false;
        state.alumni = action.payload.content;
        state.pagination = {
          page: action.payload.page,
          size: action.payload.size,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(searchAlumni.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeaturedAlumni.fulfilled, (state, action) => {
        state.featuredAlumni = action.payload;
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        state.filterOptions = action.payload;
      })
      .addCase(fetchAlumniById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAlumniById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAlumni = action.payload;
      })
      .addCase(fetchAlumniById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { updateFilters, resetFilters, clearError, clearCurrentAlumni } =
  directorySlice.actions;
export default directorySlice.reducer;