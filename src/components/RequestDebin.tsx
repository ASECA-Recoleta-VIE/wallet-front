import React, { useState } from 'react';
import TransactionService from '../services/TransactionService';

interface RequestDebinProps {
  walletId: string;
  onTransactionComplete: () => void;
}

const RequestDebin: React.FC<RequestDebinProps> = ({ onTransactionComplete }) => {
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
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

    if (!accountNumber) {
      setError('Account number is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const transaction = await TransactionService.requestDebin(
        amountNum,
        {
          accountId: accountNumber,
          description: description
        }
      );

      if (transaction) {
        setLoading(false);
        setProcessing(true);
        setRequestId(transaction.id);

        // Delay showing success message for 2 seconds
        setTimeout(() => {
          setProcessing(false);
          setSuccess(true);
          onTransactionComplete();
        }, 2000);
      } else {
        setError('Failed to submit DEBIN request. Please try again.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Transaction failed. Please try again later.');
      console.error(err);
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
      ) : processing ? (
        <div className="bg-blue-50 border border-blue-400 rounded p-4 text-center">
          <div className="animate-pulse">
            <h3 className="text-blue-800 font-semibold text-lg mb-2">Processing your request...</h3>
            <p className="mb-2">Please wait while we process your DEBIN request.</p>
            <p className="text-gray-700 mb-4">This will only take a moment.</p>
            <div className="flex justify-center">
              <div className="h-10 w-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin my-5"></div>
            </div>
          </div>
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
              data-testid="request-debin-amount"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="accountNumber" className="block text-gray-700 mb-2">Account Number</label>
            <input
              type="text"
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter bank account number"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="request-debin-account-number"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="request-debin-description"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            data-testid="request-debin-submit"
          >
            {loading ? 'Processing...' : 'Submit DEBIN Request'}
          </button>
        </form>
      )}
    </div>
  );
};

export default RequestDebin;
