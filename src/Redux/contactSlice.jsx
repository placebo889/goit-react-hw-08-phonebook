import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Report } from 'notiflix';

const BASE_URL = 'https://connections-api.herokuapp.com';

export const fetchContacts = createAsyncThunk('contacts/fetchAll', async (_, { getState }) => {
  const token = getState().auth.token;

  try {
    const response = await axios.get(`${BASE_URL}/contacts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authState'); 
    }

    throw error;
  }
});


export const addContact = createAsyncThunk('contacts/addContact', async (contact, { getState }) => {
  const token = getState().auth.token;

  try {
    const response = await axios.post(`${BASE_URL}/contacts`, contact, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
});


export const deleteContact = createAsyncThunk('contacts/deleteContact', async (id, { getState }) => {
  const token = getState().auth.token;

  try {
    await axios.delete(`${BASE_URL}/contacts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return id;
  } catch (error) {
    throw error;
  }
});

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    contacts: [],
    filter: '',
    isLoading: false,
    isAdding: false,
    isDeleting: false,
    error: null,
  },
  reducers: {
    updateFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
        if (action.payload && action.payload.logoutOn401) {
          state.isAuthenticated = false;
          state.token = null;
          state.user = null;
          localStorage.removeItem('authState');
        }
        Report.failure('Error', 'Update the page');
      })
      .addCase(addContact.pending, (state) => {
        state.isAdding = true;
        state.error = null;
      })
      .addCase(addContact.fulfilled, (state, action) => {
        state.isAdding = false;
        state.contacts = [...state.contacts, action.payload];
      })
      
      .addCase(addContact.rejected, (state, action) => {
        state.isAdding = false;
        state.error = action.error.message;
      })
      .addCase(deleteContact.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.contacts = state.contacts.filter((contact) => contact.id !== action.payload);
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.error.message;
      });
  },
});

export const { updateFilter } = contactsSlice.actions;
export default contactsSlice.reducer;
