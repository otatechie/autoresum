import { useAuth } from '../hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

export function RequireAuth({ children }) {
  const { isAuthenticated, isInitialized } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    // Optionally show a loading spinner
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login, preserving the current location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
} 