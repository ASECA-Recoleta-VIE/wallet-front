import React, { useState } from 'react';
import { HistoryResponse } from '../models/types';
import { showSuccessToast } from '../utils/toast';

interface TransactionHistoryProps {
  transactions: HistoryResponse[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [selected, setSelected] = useState<HistoryResponse | null>(null);
  const [filterType, setFilterType] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filtered, setFiltered] = useState<HistoryResponse[]>(transactions);

  React.useEffect(() => {
    let filteredTxs = [...transactions];
    if (filterType) {
      filteredTxs = filteredTxs.filter(tx => tx.type.toLowerCase().includes(filterType.toLowerCase()));
    }
    if (filterDateFrom) {
      filteredTxs = filteredTxs.filter(tx => new Date(tx.timestamp) >= new Date(filterDateFrom));
    }
    if (filterDateTo) {
      filteredTxs = filteredTxs.filter(tx => new Date(tx.timestamp) <= new Date(filterDateTo));
    }
    setFiltered(filteredTxs);
  }, [transactions, filterType, filterDateFrom, filterDateTo]);

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExport = () => {
    // Exportar como CSV simple
    const header = 'Date,Type,Amount,Description\n';
    const rows = filtered.map(tx =>
      `${formatDate(tx.timestamp)},${tx.type},${tx.amount},"${tx.description || ''}"`
    ).join('\n');
    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
    // Toast de éxito
    showSuccessToast('Transactions exported successfully!');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white" data-testid="transactions-table">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Date</th>
                <th className="py-2 px-4 text-left">Type</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr
                  key={index}
                  className="border-t cursor-pointer hover:bg-gray-100"
                  data-testid="transaction-row"
                  onClick={() => setSelected(transaction)}
                >
                  <td className="py-2 px-4">{formatDate(transaction.timestamp)}</td>
                  <td className="py-2 px-4" data-testid="transaction-type">{transaction.type}</td>
                  <td className={`py-2 px-4 ${transaction.type === 'TRANSFER_OUT' ? 'text-red-600' : 'text-green-600'}`}>
                    {transaction.type === 'TRANSFER_OUT' ?
                      <>-${transaction.amount.toFixed(2)}</> :
                      <>+${transaction.amount.toFixed(2)}</>
                    }
                  </td>
                  <td className="py-2 px-4">{transaction.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de detalles */}
      {selected && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[90vw] relative"
            data-testid="transaction-details-modal"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelected(null)}
              aria-label="Close"
            >
              &times;
            </button>
            <h3 className="text-lg font-semibold mb-4">Transaction Details</h3>
            <div className="mb-2">
              <span className="font-medium">Amount: </span>
              <span data-testid="transaction-amount">
                {selected.type === 'TRANSFER_OUT' ?
                  <>-${selected.amount.toFixed(2)}</> :
                  <>+${selected.amount.toFixed(2)}</>
                }
              </span>
            </div>
            <div className="mb-2">
              <span className="font-medium">Date: </span>
              <span data-testid="transaction-date">{formatDate(selected.timestamp)}</span>
            </div>
            <div className="mb-2">
              <span className="font-medium">Type: </span>
              <span data-testid="transaction-type">{selected.type}</span>
            </div>
            <div className="mb-2">
              <span className="font-medium">Description: </span>
              <span data-testid="transaction-description">{selected.description || '-'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
