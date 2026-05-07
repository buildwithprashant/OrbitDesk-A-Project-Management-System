import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FullPageLoader from '../components/ui/FullPageLoader';

export default function ProtectedRoute() {
  const { user, booting } = useAuth();

  if (booting) return <FullPageLoader />;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
