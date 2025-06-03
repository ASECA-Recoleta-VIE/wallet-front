import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';

// Components
import Login from './components/Login';
import Register from './components/Register';
import WalletDashboard from './components/WalletDashboard';
import Header from './components/Header';
import Footer from './components/Footer';

// Context
import { AuthProvider, AuthContext } from './providers/AuthProvider';
import { AuthGuard } from './guards/AuthGuard';
import { UserGuard } from './guards/UserGuard';

const App: React.FC = () => {

  // if (loading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen text-xl font-semibold">
  //       Loading...
  //     </div>
  //   );
  // }

  return (
      <AuthProvider>
          <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Navigate to="/wallet" replace />} />
              <Route element={<UserGuard />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              <Route element={<AuthGuard />}>
                <Route path="/wallet" element={<WalletDashboard />} />
              </Route>
            </Routes>
     </main>
      <Footer />
    </div>
          </Router>

    </AuthProvider>
  );
};


export default App;