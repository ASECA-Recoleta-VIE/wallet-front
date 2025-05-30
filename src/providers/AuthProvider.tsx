import React, { createContext, useEffect, useState, useMemo } from 'react';
import AuthService from '../services/AuthService';
import WalletService from '../services/WalletService';
import { User, Wallet } from '../models/types';

interface AuthContextType {
  user: User | null;
  wallet: Wallet | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const STORAGE_KEYS = {
  USER: 'auth_user',
  WALLET: 'auth_wallet',
};

const defaultContext: AuthContextType = {
  user: null,
  wallet: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  loading: true,
};

export const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [wallet, setWallet] = useState<Wallet | null>(() => {
    const storedWallet = localStorage.getItem(STORAGE_KEYS.WALLET);
    return storedWallet ? JSON.parse(storedWallet) : null;
  });
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  const persistUserData = (userData: User | null, walletData: Wallet | null) => {
    if (userData) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    if (walletData) {
      localStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(walletData));
    } else {
      localStorage.removeItem(STORAGE_KEYS.WALLET);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userData = await AuthService.login(email, password);
      if (userData) {
        const walletData = await WalletService.getWalletByUserId(userData.walletId);
        setUser(userData);
        setWallet(walletData);
        persistUserData(userData, walletData);
        return true;
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
    return false;
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    setWallet(null);
    persistUserData(null, null);
  };

  useEffect(() => {
    const init = async () => {
      try {
        // If we have stored data, verify it's still valid
        if (user) {
          const currentUser = await AuthService.getCurrentUser();
          if (!currentUser) {
            // If stored data is invalid, clear it
            setUser(null);
            setWallet(null);
            persistUserData(null, null);
          }
        }
      } catch (err) {
        console.error('Failed to verify user session:', err);
        setUser(null);
        setWallet(null);
        persistUserData(null, null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const contextValue = useMemo(() => ({
    user,
    wallet,
    isAuthenticated,
    login,
    logout,
    loading,
  }), [user, wallet, isAuthenticated, login, logout, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};