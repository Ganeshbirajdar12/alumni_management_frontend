import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import adminReducer from './slices/adminSlice';
import eventReducer from './slices/eventSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    admin: adminReducer,
    event: eventReducer,
  },
});