import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  events: [],
  featuredEvents: [],
  currentEvent: null,
  attendees: [],
  myOrganized: [],
  myRsvps: [],
  pagination: {
    page: 0,
    size: 9,
    totalElements: 0,
    totalPages: 0,
  },
  filters: {
    search: '',
    category: '',
    onlineOnly: null,
    upcomingOnly: true,
    page: 0,
    size: 9,
  },
  isLoading: false,
  isSubmitting: false,
  error: null,
};

// ==================== BROWSE ====================
export const fetchEvents = createAsyncThunk(
  'event/fetchEvents',
  async (filters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.page !== undefined) params.append('page', filters.page);
      if (filters.size) params.append('size', filters.size);
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.onlineOnly !== null && filters.onlineOnly !== undefined && filters.onlineOnly !== '') {
        params.append('onlineOnly', filters.onlineOnly);
      }
      if (filters.upcomingOnly !== undefined) params.append('upcomingOnly', filters.upcomingOnly);

      const response = await api.get(`/events?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch events');
    }
  }
);

export const fetchFeaturedEvents = createAsyncThunk(
  'event/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/events/featured');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured');
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'event/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch event');
    }
  }
);

// ==================== CREATE / UPDATE / DELETE ====================
export const createEvent = createAsyncThunk(
  'event/create',
  async (eventData, { rejectWithValue }) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create event');
    }
  }
);

export const updateEvent = createAsyncThunk(
  'event/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/events/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update event');
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'event/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/events/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete event');
    }
  }
);

// ==================== RSVP ====================
export const rsvpEvent = createAsyncThunk(
  'event/rsvp',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/events/${eventId}/rsvp`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to RSVP');
    }
  }
);

export const cancelRsvp = createAsyncThunk(
  'event/cancelRsvp',
  async (eventId, { rejectWithValue }) => {
    try {
      await api.delete(`/events/${eventId}/rsvp`);
      return eventId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel RSVP');
    }
  }
);

export const fetchAttendees = createAsyncThunk(
  'event/fetchAttendees',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/events/${eventId}/attendees`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendees');
    }
  }
);

// ==================== MY EVENTS ====================
export const fetchMyOrganized = createAsyncThunk(
  'event/myOrganized',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/events/my-organized');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch');
    }
  }
);

export const fetchMyRsvps = createAsyncThunk(
  'event/myRsvps',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/events/my-rsvps');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch');
    }
  }
);

// ==================== CHECK-IN ====================
export const markAttended = createAsyncThunk(
  'event/markAttended',
  async ({ eventId, userId }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/events/${eventId}/check-in/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to check in');
    }
  }
);

// ==================== SLICE ====================
const eventSlice = createSlice({
  name: 'event',
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
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
      state.attendees = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.content;
        state.pagination = {
          page: action.payload.page,
          size: action.payload.size,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Featured
      .addCase(fetchFeaturedEvents.fulfilled, (state, action) => {
        state.featuredEvents = action.payload;
      })

      // Single event
      .addCase(fetchEventById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createEvent.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(createEvent.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.currentEvent = action.payload;
      })

      // Delete
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.events = state.events.filter((e) => e.id !== action.payload);
        state.myOrganized = state.myOrganized.filter((e) => e.id !== action.payload);
      })

      // RSVP
      .addCase(rsvpEvent.fulfilled, (state) => {
        if (state.currentEvent) {
          state.currentEvent.userRegistered = true;
          state.currentEvent.userStatus = 'REGISTERED';
          state.currentEvent.registeredCount += 1;
        }
      })
      .addCase(cancelRsvp.fulfilled, (state) => {
        if (state.currentEvent) {
          state.currentEvent.userRegistered = false;
          state.currentEvent.userStatus = 'CANCELLED';
          state.currentEvent.registeredCount -= 1;
        }
      })

      // Attendees
      .addCase(fetchAttendees.fulfilled, (state, action) => {
        state.attendees = action.payload;
      })

      // My events
      .addCase(fetchMyOrganized.fulfilled, (state, action) => {
        state.myOrganized = action.payload;
      })
      .addCase(fetchMyRsvps.fulfilled, (state, action) => {
        state.myRsvps = action.payload;
      })

      // Check-in
      .addCase(markAttended.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.attendees.findIndex((a) => a.id === updated.id);
        if (idx !== -1) state.attendees[idx] = updated;
      });
  },
});

export const { updateFilters, resetFilters, clearError, clearCurrentEvent } = eventSlice.actions;
export default eventSlice.reducer;