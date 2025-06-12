import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            padding: '16px',
            borderRadius: '8px',
          },
        }}
      />
    </>
  );
};

export default ToastProvider; 