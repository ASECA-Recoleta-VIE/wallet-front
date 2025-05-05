import React from 'react';
import { Transaction, TransactionType, TransactionStatus } from '../models/types';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  // Helper function to format date
  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to get transaction type display text
  const getTransactionTypeText = (type: TransactionType): string => {
    switch (type) {
      case TransactionType.P2P_TRANSFER: return 'Transfer';
      case TransactionType.CREDIT_CARD_DEPOSIT: return 'Credit Card Deposit';
      case TransactionType.BANK_DEPOSIT: return 'Bank Deposit';
      case TransactionType.DEBIN_REQUEST: return 'DEBIN Request';
      default: return 'Unknown';
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id} className="border-t">
                  <td className="py-2 px-4">{formatDate(transaction.timestamp)}</td>
                  <td className="py-2 px-4">{getTransactionTypeText(transaction.type)}</td>
                  <td className={`py-2 px-4 ${transaction.recipientWalletId ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.recipientWalletId ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${transaction.status === TransactionStatus.COMPLETED
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === TransactionStatus.PENDING
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">{transaction.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
