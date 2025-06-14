import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; 

export function ProtectedRoute({ children }: {children: ReactElement}) {
  const { user, isLoading } = useAuth();

  if(isLoading) {
    return null;
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
}