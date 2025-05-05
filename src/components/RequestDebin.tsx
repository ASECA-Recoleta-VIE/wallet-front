import React, { useState } from 'react';
import TransactionService from '../services/TransactionService';

interface RequestDebinProps {
  walletId: string;
  onTransactionComplete: () => void;
}

const RequestDebin: React.FC<RequestDebinProps> = ({ walletId, onTransactionComplete }) => {
  const [amount, setAmount] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankRoutingNumber, setBankRoutingNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount) {
      setError('Amount is required');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!bankAccountNumber || !bankRoutingNumber) {
      setError('All bank details are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const transaction = await TransactionService.requestDebin(
        walletId,
        amountNum,
        {
          accountNumber: bankAccountNumber,
          routingNumber: bankRoutingNumber
        }
      );

      if (transaction) {
        setSuccess(true);
        setRequestId(transaction.id);
        onTransactionComplete();
      } else {
        setError('Failed to submit DEBIN request. Please try again.');
      }
    } catch (err) {
      setError('Transaction failed. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {success ? (
        <div className="bg-green-50 border border-green-400 rounded p-4 text-center">
          <h3 className="text-green-800 font-semibold text-lg mb-2">DEBIN request submitted successfully!</h3>
          <p className="mb-2">Your request ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{requestId}</span></p>
          <p className="text-gray-700 mb-4">Funds will be added to your wallet once the request is processed.</p>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => setSuccess(false)}
          >
            Make another request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Request DEBIN Transfer</h2>
          <p className="text-gray-600 mb-4 text-sm">
            A DEBIN (Direct Debit Initiation) allows you to request funds from your bank account directly.
          </p>

          {error && <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              step="0.01"
              min="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="bankAccountNumber" className="block text-gray-700 mb-2">Account Number</label>
            <input
              type="text"
              id="bankAccountNumber"
              value={bankAccountNumber}
              onChange={(e) => setBankAccountNumber(e.target.value)}
              placeholder="Bank account number"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="bankRoutingNumber" className="block text-gray-700 mb-2">Routing Number</label>
            <input
              type="text"
              id="bankRoutingNumber"
              value={bankRoutingNumber}
              onChange={(e) => setBankRoutingNumber(e.target.value)}
              placeholder="Bank routing number"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Processing...' : 'Submit DEBIN Request'}
          </button>
        </form>
      )}
    </div>
  );
};

export default RequestDebin;
