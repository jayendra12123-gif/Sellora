import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';
import authReducer from '../features/auth/authSlice';
import ordersReducer from '../features/orders/ordersSlice';
import addressesReducer from '../features/addresses/addressesSlice';
import preferencesReducer from '../features/preferences/preferencesSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';

// Load persisted state from localStorage (auth only, cart is fetched from server)
const loadPersistedState = () => {
  try {
    const stored = localStorage.getItem('reduxState');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading persisted state:', error);
  }
  return null;
};

const persistedState = loadPersistedState();

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
    orders: ordersReducer,
    addresses: addressesReducer,
    preferences: preferencesReducer,
    favorites: favoritesReducer,
  },
  preloadedState: {
    products: { items: [], status: 'idle', error: null },
    cart: { items: [], totalPrice: 0, status: 'idle', error: null },
    auth: { user: null, isAuthenticated: false, isLoading: false, error: null },
    orders: { items: [], status: 'idle', error: null, currentOrder: null, isLoading: false },
    addresses: { items: [], status: 'idle', error: null, loading: false },
    preferences: { emailNotifications: true, smsNotifications: false, theme: 'light', status: 'idle', error: null, loading: false },
    favorites: { ids: [], status: 'idle', error: null, loading: false },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(),
});
