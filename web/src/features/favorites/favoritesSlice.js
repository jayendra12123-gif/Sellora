import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { logout } from '../auth/authSlice';
import { API_URL } from '../../config/api';

const getToken = () => localStorage.getItem('authToken');

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) {
        return rejectWithValue('Not authenticated');
      }

      const response = await fetch(`${API_URL}/favorites`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message);
      }

      return Array.isArray(data) ? data : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'favorites/toggleFavorite',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) {
        return rejectWithValue('Not authenticated');
      }

      const isFavorite = getState().favorites.ids.includes(productId);
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await fetch(`${API_URL}/favorites/${productId}`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        return rejectWithValue(data.message);
      }

      return Array.isArray(data) ? data : [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    ids: [],
    status: 'idle',
    error: null,
    loading: false
  },
  reducers: {
    clearFavorites: (state) => {
      state.ids = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.ids = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(toggleFavorite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        state.loading = false;
        state.ids = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(toggleFavorite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout, (state) => {
        state.ids = [];
        state.status = 'idle';
        state.error = null;
        state.loading = false;
      });
  },
});

export const selectFavoriteIds = (state) => state.favorites.ids;
export const selectFavoritesCount = (state) => state.favorites.ids.length;
export const selectIsFavorite = (state, productId) =>
  state.favorites.ids.includes(productId);

export const { clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
