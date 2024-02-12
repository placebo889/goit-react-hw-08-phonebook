import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Report } from 'notiflix';

const BASE_URL = 'https://connections-api.herokuapp.com';



const saveAuthStateToStorage = (state) => {
  localStorage.setItem('authState', JSON.stringify(state));
};

export const loadStateFromStorage = () => {
  const storedState = localStorage.getItem('authState');
  if (storedState) {
    const authState = JSON.parse(storedState);
    return { auth: authState }; 
  }
  return null;
};





export const registerUser = createAsyncThunk('auth/registerUser', async ({ name, email, password }) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/signup`, {
      name,
      email,
      password,
    });

    return response.data; 
  } catch (error) {
   
    
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 400) {
        if (error.response.data) {
          throw new Error('Email is already in use. Please use a different email.');
        } else {
        
          throw new Error('Unexpected error during registration.');
        }
      } else {
    
        throw error.response.data; 
      }
    } else {
      
      throw error;
    }
  }
});








export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }) => {
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, { email, password });
    return response.data.token;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
      Report.failure('Login Error', 'Invalid email or password. Please try again.');
    }
    throw error.response.data;
  }
});



export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;

    if (!token) {
      throw new Error('No authentication token available');
    }

    await axios.post(`${BASE_URL}/users/logout`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    localStorage.removeItem('authState');

  } catch (error) {
    if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
      return rejectWithValue({ logoutOn401: true });
    } else {
      throw error;
    }
  }
});
export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;

    if (!token) {
      throw new Error('No authentication token available');
    }

    const response = await axios.get(`${BASE_URL}/users/current`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data);
  }
});


const authSlice = createSlice({
  name: 'auth',
  initialState: loadStateFromStorage() || {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null,
    success: null,
  },  
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.success = 'Registration successful!';
        saveAuthStateToStorage(state);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload.message || 'Registration failed. Please try again.';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload;
        saveAuthStateToStorage(state);
      })
      .addCase(loginUser.rejected, (state, action) => {
        if (action.payload && action.payload.status === 400) {
          Report.failure('Login Error', 'Invalid email or password. Please try again.');
        }
        throw action.payload;
      })
      
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.loading = false;
        localStorage.removeItem('authState');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;

        if (action.payload && action.payload.logoutOn401) {
          state.isAuthenticated = false;
          state.token = null;
          state.user = null;
          localStorage.removeItem('authState');
        }
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        saveAuthStateToStorage(state);
      });
  },
});

export default authSlice.reducer;





