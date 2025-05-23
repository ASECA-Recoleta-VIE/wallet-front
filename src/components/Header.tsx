import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, onLogout }) => {
  return (
    <header className="bg-white shadow-md py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">
          <Link to="/">WalletApp</Link>
        </div>
        <nav className="space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/wallet" className="text-gray-700 hover:text-blue-500">My Wallet</Link>
              <Link to="/transactions" className="text-gray-700 hover:text-blue-500">Transactions</Link>
              <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-500">Login</Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-500">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
