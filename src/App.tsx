import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';

// Components
import Login from './components/Login';
import Register from './components/Register';
import WalletDashboard from './components/WalletDashboard';
import Header from './components/Header';
import Footer from './components/Footer';

// Services
import AuthService from './services/AuthService';
import WalletService from './services/WalletService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check auth status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          setIsAuthenticated(true);
          setUserId(currentUser.id);

          // Get user's wallet
          const wallet = await WalletService.getWalletByUserId(currentUser.id);
          if (wallet) {
            setWalletId(wallet.id);
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await AuthService.login(email, password);
      if (user) {
        setIsAuthenticated(true);
        setUserId(user.id);

        const wallet = await WalletService.getWalletByUserId(user.id);
        if (wallet) {
          setWalletId(wallet.id);
        }
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
    return false;
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
    setUserId(null);
    setWalletId(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl font-semibold">Loading...</div>;
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />

        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/wallet" replace />} />
            <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/wallet" replace />} />
            <Route path="/wallet" element={isAuthenticated && walletId ? <WalletDashboard walletId={walletId} /> : <Navigate to="/login" replace />} />
            <Route path="/" element={<Navigate to={isAuthenticated ? "/wallet" : "/login"} replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
