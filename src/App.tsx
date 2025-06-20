import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Components
import Login from './components/Login';
import Register from './components/Register';
import WalletDashboard from './components/WalletDashboard';
import Transactions from './pages/Transactions';
import Header from './components/Header';
import Footer from './components/Footer';
import ToastProvider from './components/ToastProvider';

// Context
import { AuthProvider } from './providers/AuthProvider';
import { AuthGuard } from './guards/AuthGuard';

const App: React.FC = () => {

  return (
    <Router>
      <ToastProvider>
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              <Route element={<AuthGuard />}>
                <Route path="/wallet" element={<WalletDashboard />} />
                <Route path="/transactions" element={<Transactions />} />
              </Route>
              <Route path="/" element={<Navigate to="/wallet" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
