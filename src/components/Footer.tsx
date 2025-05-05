import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">© {new Date().getFullYear()} WalletApp. All rights reserved.</p>
        <p className="text-xs text-gray-400 mt-1">A secure digital wallet solution</p>
      </div>
    </footer>
  );
};

export default Footer;
