import { Routes, Route, useLocation } from 'react-router-dom';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from './features/products/productsSlice';
import { checkAuth } from './features/auth/authSlice';
import { fetchCart } from './features/cart/cartSlice';
import { fetchOrders } from './features/orders/ordersSlice';
import { fetchAddresses } from './features/addresses/addressesSlice';
import { fetchPreferences } from './features/preferences/preferencesSlice';
import { fetchFavorites } from './features/favorites/favoritesSlice';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import SavedAddresses from './pages/SavedAddresses';
import ChangePassword from './pages/ChangePassword';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import TermsConditions from './pages/TermsConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Favorites from './pages/Favorites';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated, authCheckComplete } = useSelector(state => state.auth);

  // Check if current route is login or signup - hide navbar on these pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/forgot-password';

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(checkAuth());
  }, [dispatch]);

  // Fetch user-specific data when authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchOrders());
      dispatch(fetchAddresses());
      dispatch(fetchPreferences());
      dispatch(fetchFavorites());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-[#1a1a1a]">
      <ScrollToTop />
      {!isAuthPage && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
<Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
          <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/saved-addresses" element={<ProtectedRoute><SavedAddresses /></ProtectedRoute>} />
          <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/terms-and-conditions" element={<TermsConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
