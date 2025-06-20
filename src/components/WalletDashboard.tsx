import React, { useState, useEffect } from 'react';
import WalletService from '../services/WalletService';
import { HistoryResponse, WalletResponse } from '../models/types';
import TransactionHistory from './TransactionHistory';
import AddFunds from './AddFunds';
import RequestDebin from './RequestDebin';
import TransferFunds from './TransferFunds';

const WalletDashboard: React.FC = () => {
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [transactions, setTransactions] = useState<HistoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [walletData, historyData] = await Promise.all([
        WalletService.getWallet(),
        WalletService.getHistory()
      ]);
      setWallet(walletData);
      setTransactions(historyData);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
      setWallet(null);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTransactionComplete = () => {
    fetchData();
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8 text-lg">Loading wallet data...</div>;
  }

  if (!wallet) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">Wallet not found</div>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">My Wallet</h1>
        <div className="mt-2">
          <span className="text-gray-600">Balance:</span>
          <h2 className="text-3xl font-bold text-green-600">
            ${typeof wallet.balance === 'number' ? wallet.balance.toFixed(2) : '0.00'}
          </h2>
        </div>
      </div>

      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveTab('overview')}
          data-testid="overview-title"
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'addFunds' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveTab('addFunds')}
        >
          Withdraw Funds
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'transfer' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveTab('transfer')}
        >
          Transfer
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'requestDebin' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
          onClick={() => setActiveTab('requestDebin')}
           data-testid="request-debin-title"
        >
          Request DEBIN
        </button>
      </div>

      <div className="mt-4">
        {activeTab === 'overview' && (
          <div>
            <TransactionHistory transactions={transactions} />
          </div>
        )}

        {activeTab === 'addFunds' && (
          <div>
            <AddFunds
              onTransactionComplete={handleTransactionComplete}
            />
          </div>
        )}

        {activeTab === 'transfer' && (
          <div>
            <TransferFunds
              onTransactionComplete={handleTransactionComplete}
            />
          </div>
        )}

        {activeTab === 'requestDebin' && (
          <div>
            <RequestDebin
              walletId=""
              onTransactionComplete={handleTransactionComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletDashboard;
