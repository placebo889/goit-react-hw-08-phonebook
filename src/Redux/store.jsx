import { configureStore } from '@reduxjs/toolkit';
import contactsReducer from './contactSlice';
import authReducer, { loadStateFromStorage } from './authSlice';

const preloadedState = loadStateFromStorage() || {
  contacts: {
    contacts: [],
    filter: '',
    isLoading: false,
    isAdding: false,
    isDeleting: false,
    error: null,
  },
  auth: {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
  },
};

const store = configureStore({
  reducer: {
    contacts: contactsReducer,
    auth: authReducer,
  },
  preloadedState,
});

export default store;

