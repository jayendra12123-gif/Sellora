import { Navigate } from 'react-router-dom';
import { getAdminUser } from '../api';

export default function PrivateRoute({ children }) {
  const user = getAdminUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
}
