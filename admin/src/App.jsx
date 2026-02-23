import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { adminLogout, getAdminUser, refreshAdminUser } from './api';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import AdminCollections from './pages/AdminCollections';
import AdminContent from './pages/AdminContent';
import Login from './pages/Login';
import Loader from './components/Loader';

export default function App() {
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminAuthToken');
    if (!token) {
      setChecked(true);
      return;
    }

    refreshAdminUser()
      .catch(() => {
        adminLogout();
      })
      .finally(() => setChecked(true));
  }, []);

  if (!checked) {
    return (
      <div className="app-loading">
        <Loader />
      </div>
    );
  }

  const user = getAdminUser();

  const handleLogout = () => {
    adminLogout();
    navigate('/login', { replace: true });
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AdminLayout onLogout={handleLogout} user={user} />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="collections" element={<AdminCollections />} />
        <Route path="content" element={<AdminContent />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  );
}
