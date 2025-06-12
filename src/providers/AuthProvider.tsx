import React, { createContext, useEffect, useState, useMemo } from 'react';
import AuthService from '../services/AuthService';
import WalletService from '../services/WalletService';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const defaultContext: AuthContextType = {
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  loading: true,
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const success = await AuthService.login(email, password);
      setIsAuthenticated(success);
      return success;
    } catch (err) {
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to fetch wallet data - if successful, user is authenticated
        await WalletService.getWallet();
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to check authentication status:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const contextValue = useMemo(() => ({
    isAuthenticated,
    login,
    logout,
    loading,
  }), [isAuthenticated, login, logout, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
