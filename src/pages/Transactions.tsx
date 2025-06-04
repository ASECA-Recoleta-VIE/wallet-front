import React, { useState, useEffect } from 'react';
import WalletService from '../services/WalletService';
import { HistoryResponse } from '../models/types';
import TransactionHistory from '../components/TransactionHistory';
import TransferFunds from '../components/TransferFunds';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<HistoryResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('history');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const historyData = await WalletService.getHistory();
      setTransactions(historyData);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleTransactionComplete = () => {
    fetchTransactions();
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8 text-lg">Loading transactions...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
          <p className="text-gray-600 mt-2">View your transaction history and make new transfers</p>
        </div>

        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'history' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('history')}
          >
            Transaction History
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'new' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
            onClick={() => setActiveTab('new')}
          >
            New Transaction
          </button>
        </div>

        <div className="mt-4">
          {activeTab === 'history' && (
            <div>
              <TransactionHistory transactions={transactions} />
            </div>
          )}

          {activeTab === 'new' && (
            <div>
              <TransferFunds
                onTransactionComplete={handleTransactionComplete}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions; 