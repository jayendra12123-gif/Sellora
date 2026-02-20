import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../config/api';

const getToken = () => localStorage.getItem('authToken');

// Fetch user preferences
export const fetchPreferences = createAsyncThunk(
  'preferences/fetchPreferences',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) {
        return rejectWithValue('Not authenticated');
      }

      const response = await fetch(`${API_URL}/preferences`, {
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

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update user preferences
export const updatePreferences = createAsyncThunk(
  'preferences/updatePreferences',
  async (preferencesData, { rejectWithValue }) => {
    try {
      const token = getToken();
      if (!token) {
        return rejectWithValue('Not authenticated');
      }

      const response = await fetch(`${API_URL}/preferences`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferencesData)
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  emailNotifications: true,
  smsNotifications: false,
  theme: 'light',
  status: 'idle',
  error: null,
  loading: false
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    clearPreferences: (state) => {
      state.emailNotifications = true;
      state.smsNotifications = false;
      state.theme = 'light';
      state.status = 'idle';
      state.error = null;
    },
    clearPreferencesError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch preferences
      .addCase(fetchPreferences.pending, (state) => {
        state.status = 'loading';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.loading = false;
        state.emailNotifications = action.payload.emailNotifications ?? true;
        state.smsNotifications = action.payload.smsNotifications ?? false;
        state.theme = action.payload.theme ?? 'light';
        state.error = null;
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.status = 'failed';
        state.loading = false;
        state.error = action.payload;
      })
      // Update preferences
      .addCase(updatePreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.loading = false;
        state.emailNotifications = action.payload.emailNotifications ?? state.emailNotifications;
        state.smsNotifications = action.payload.smsNotifications ?? state.smsNotifications;
        state.theme = action.payload.theme ?? state.theme;
        state.error = null;
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearPreferences, clearPreferencesError } = preferencesSlice.actions;
export const selectEmailNotifications = (state) => state.preferences.emailNotifications;
export const selectSmsNotifications = (state) => state.preferences.smsNotifications;
export const selectTheme = (state) => state.preferences.theme;
export const selectPreferencesStatus = (state) => state.preferences.status;
export const selectPreferencesError = (state) => state.preferences.error;
export const selectPreferencesLoading = (state) => state.preferences.loading;

export default preferencesSlice.reducer;
