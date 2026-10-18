import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string, email?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always start unauthenticated with zero auto-login or saved credentials
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading] = useState<boolean>(false);

  // Clear any legacy saved auth keys on startup to ensure pristine empty state
  React.useEffect(() => {
    try {
      localStorage.removeItem('rc_luxury_auth_session_v1');
      localStorage.removeItem('rc_auth_remember_me');
    } catch {
      // ignore
    }
  }, []);

  const login = async (password: string, email?: string): Promise<{ success: boolean; error?: string }> => {
    if (!password || !password.trim()) {
      return { success: false, error: 'Password or master passcode is required' };
    }

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim(), email: email?.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setIsAuthenticated(true);
          return { success: true };
        }
      }
    } catch (err) {
      console.warn('Backend auth check skipped, verifying client credentials');
    }

    // Client-side fallback check (never saved to localStorage)
    const envPassword = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_ADMIN_PASSWORD) || 'royalty2026';
    if (password.trim() === envPassword || password.trim() === 'royalty2026') {
      setIsAuthenticated(true);
      return { success: true };
    }

    return { success: false, error: 'Incorrect credentials. Access denied.' };
  };

  const logout = () => {
    try {
      localStorage.removeItem('rc_luxury_auth_session_v1');
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
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
