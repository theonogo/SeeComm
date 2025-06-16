import { createContext, useContext, useEffect, useState} from 'react';
import type { ReactNode } from 'react';
import { authService } from './AuthService';

interface AuthData {
  is_authenticated: boolean;
  id: string,
  username: string,
  email: string
}

interface AuthContextType {
  user: AuthData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: {children: ReactNode}) {
  const [user, setUser] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  async function checkAuthStatus() {
    setIsLoading(true);
    try {
      const authData = await authService.checkAuth();
      if (authData.is_authenticated) {
        setUser(authData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function logout() {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}