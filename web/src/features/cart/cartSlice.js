import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../config/api';

// Local storage keys
const CART_STORAGE_KEY = 'sellora_cart';

const getCurrentUserId = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user)?.id : null;
  } catch (error) {
    console.error('Error reading user from localStorage:', error);
    return null;
  }
};

const getStorageKey = () => {
  const userId = getCurrentUserId();
  return userId ? `${CART_STORAGE_KEY}_${userId}` : `${CART_STORAGE_KEY}_guest`;
};

// Get initial cart from local storage
const getInitialCart = () => {
  // Don't load cart on initialization - it will be fetched from server when user logs in
  // This prevents showing another user's cart
  return [];
};

// Save cart to local storage
const saveCartToLocal = (items) => {
  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return rejectWithValue('Not authenticated');

    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data.message || 'Failed to fetch cart');
    }
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
}, {
  condition: (_, { getState }) => {
    const { cart } = getState();
    // Skip if already loading
    if (cart.status === 'loading') {
      return false;
    }
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ product, quantity }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return rejectWithValue('Not authenticated');

    const response = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ productId: product.id, quantity }),
    });
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data.message || 'Failed to add to cart');
    }
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (id, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return rejectWithValue('Not authenticated');

    const response = await fetch(`${API_URL}/cart/${id}`, {
      method: 'DELETE',
      headers: {
        ...getAuthHeader(),
      },
    });
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data.message || 'Failed to remove item');
    }
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateQuantity = createAsyncThunk('cart/updateQuantity', async ({ id, quantity }, { rejectWithValue }) => {
  try {
    if (quantity < 1) return rejectWithValue('Quantity must be at least 1');

    const token = localStorage.getItem('authToken');
    if (!token) return rejectWithValue('Not authenticated');

    const response = await fetch(`${API_URL}/cart/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify({ quantity }),
    });
    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data.message || 'Failed to update quantity');
    }
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getInitialCart(),
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
      saveCartToLocal([]);
    },
    addItemsToCart: (state, action) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }
      saveCartToLocal(state.items);
    },
    removeItemFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCartToLocal(state.items);
    },
    updateItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        if (quantity > 0) {
          item.quantity = quantity;
        } else {
          state.items = state.items.filter(item => item.id !== id);
        }
      }
      saveCartToLocal(state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
        state.error = null;
        saveCartToLocal(state.items);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to fetch cart';
        if (action.payload === 'Not authenticated') {
          state.items = [];
          saveCartToLocal([]);
        }
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
        saveCartToLocal(state.items);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
        saveCartToLocal(state.items);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        if (action.payload) {
            state.items = action.payload;
            saveCartToLocal(state.items);
        }
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalItems = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartTotalPrice = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export const { clearCart, addItemsToCart, removeItemFromCart, updateItemQuantity } = cartSlice.actions;

export default cartSlice.reducer;
