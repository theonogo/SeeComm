import type { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'; 

export function PublicRoute({ children }: {children: ReactElement}) {
  const { user, isLoading } = useAuth();

  if(isLoading) {
    return null;
  }

  if (user) {
    // Redirect to main page if authenticated
    return <Navigate to="/" replace />;
  }

  return children;
}