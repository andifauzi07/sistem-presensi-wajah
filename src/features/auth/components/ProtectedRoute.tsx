import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../hooks/useAuth';

export const ProtectedRoute = () => {
  const { token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
