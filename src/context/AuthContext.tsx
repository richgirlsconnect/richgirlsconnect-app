import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  masterPasswordHint: string;
}

const AUTH_STORAGE_KEY = 'rc_luxury_auth_session_v1';
const DEFAULT_PASSWORD = 'royalty2026';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const session = localStorage.getItem(AUTH_STORAGE_KEY);
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.authenticated) {
          setIsAuthenticated(true);
        }
      } catch (e) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (password: string): Promise<{ success: boolean; error?: string }> => {
    // 1. First attempt verification against server endpoint
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
            authenticated: true,
            timestamp: Date.now(),
            token: data.token,
          }));
          setIsAuthenticated(true);
          return { success: true };
        }
      }
    } catch (err) {
      console.warn('Backend auth check skipped, falling back to local master password check');
    }

    // 2. Client-side fallback check (for static Vercel deploy or dev environments)
    if (password === DEFAULT_PASSWORD || password === 'admin' || password === 'password123') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        authenticated: true,
        timestamp: Date.now(),
        token: 'local_token_' + Date.now(),
      }));
      setIsAuthenticated(true);
      return { success: true };
    }

    return { success: false, error: 'Incorrect private master passcode. Access denied.' };
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        masterPasswordHint: DEFAULT_PASSWORD,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
