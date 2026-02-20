import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '../../config/api';

const FALLBACK_BEST_SELLER_IDS = new Set([3, 1, 11, 6, 5, 10, 21, 23, 19, 7, 2, 12]);
const FALLBACK_SALE_DISCOUNT_BY_ID = {
  2: 15,
  4: 20,
  7: 25,
  8: 10,
  12: 18,
  14: 12,
  16: 14,
  20: 22,
  22: 16,
  15: 12,
  18: 10
};
const FALLBACK_SALE_IDS = new Set(Object.keys(FALLBACK_SALE_DISCOUNT_BY_ID).map(Number));
const FALLBACK_NEW_ARRIVALS_IDS = new Set([24, 23, 22, 21, 20, 19, 18, 17, 12, 11, 10, 9]);

const EXTRA_PRODUCTS = [
  {
    id: 25,
    title: '4K Action Camera',
    description: 'Rugged compact action camera with 4K capture, image stabilization, and waterproof housing.',
    price: 219.0,
    category: 'Electronics',
    rating: 4.4,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80'
  },
  {
    id: 26,
    title: 'Oversized Graphic Tee',
    description: 'Relaxed-fit cotton tee with premium print and soft-touch finish for everyday wear.',
    price: 36.0,
    category: 'Clothing',
    rating: 4.3,
    stock: 48,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'
  },
  {
    id: 27,
    title: 'MagSafe Phone Stand',
    description: 'Foldable aluminum stand with magnetic alignment for hands-free viewing and charging support.',
    price: 31.99,
    category: 'Accessories',
    rating: 4.6,
    stock: 52,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'
  },
  {
    id: 28,
    title: 'Wireless Charging Pad Duo',
    description: 'Fast dual charging pad for phone and earbuds with smart temperature protection.',
    price: 69.99,
    category: 'Electronics',
    rating: 4.5,
    stock: 27,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80'
  },
  {
    id: 29,
    title: 'Everyday Chino Pants',
    description: 'Slim-tapered chinos with stretch comfort and wrinkle-resistant fabric.',
    price: 64.5,
    category: 'Clothing',
    rating: 4.4,
    stock: 34,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80'
  },
  {
    id: 30,
    title: 'Compact Travel Umbrella',
    description: 'Windproof lightweight umbrella with quick-dry canopy and one-touch open/close.',
    price: 24.99,
    category: 'Accessories',
    rating: 4.2,
    stock: 66,
    image: 'https://images.unsplash.com/photo-1534278931827-8a259344abe7?w=800&q=80'
  },
  {
    id: 31,
    title: 'Mechanical Pencil Set',
    description: 'Precision drafting pencil kit with metal body and extra lead refills.',
    price: 18.99,
    category: 'Accessories',
    rating: 4.7,
    stock: 58,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80'
  },
  {
    id: 32,
    title: 'Smart Fitness Band',
    description: 'Lightweight fitness tracker with sleep monitoring, heart rate, and 10-day battery life.',
    price: 79.99,
    category: 'Electronics',
    rating: 4.3,
    stock: 29,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&q=80'
  }
];

const mergeWithExtraProducts = (products = []) => {
  const productMap = new Map(products.map((product) => [product.id, product]));
  EXTRA_PRODUCTS.forEach((product) => {
    if (!productMap.has(product.id)) {
      productMap.set(product.id, product);
    }
  });
  return Array.from(productMap.values());
};

const normalizeProducts = (products = []) =>
  mergeWithExtraProducts(products).map((product) => {
    const existingCollections = Array.isArray(product.collections) ? [...product.collections] : [];
    const collections = new Set(existingCollections);

    if (FALLBACK_SALE_IDS.has(product.id)) collections.add('on-sale');
    if (FALLBACK_BEST_SELLER_IDS.has(product.id)) collections.add('best-sellers');
    if (FALLBACK_NEW_ARRIVALS_IDS.has(product.id)) collections.add('new-arrivals');

    const fallbackDiscount = FALLBACK_SALE_DISCOUNT_BY_ID[product.id] || 0;
    const discountPercent = Number(product.discountPercent || fallbackDiscount || 0);
    const originalPrice = product.originalPrice || (
      discountPercent > 0 ? Number((product.price / (1 - discountPercent / 100)).toFixed(2)) : null
    );

    return {
      ...product,
      collections: [...collections],
      discountPercent,
      originalPrice,
      isBestSeller: product.isBestSeller ?? FALLBACK_BEST_SELLER_IDS.has(product.id),
    };
  });

export const fetchProducts = createAsyncThunk('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
      return rejectWithValue(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return rejectWithValue(error.message || 'Failed to fetch products');
  }
}, {
  condition: (_, { getState }) => {
    const { products } = getState();
    if (products.status === 'loading' || products.status === 'succeeded') {
      return false;
    }
  },
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = normalizeProducts(action.payload);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectAllProducts = (state) => state.products.items;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;

export const selectProductById = (state, productId) =>
  state.products.items.find((product) => product.id === productId);

export default productsSlice.reducer;
