import { useState } from 'react';
import WalletService from '../services/WalletService';

interface TransferFundsProps {
  onTransactionComplete: () => void;
}

const TransferFunds: React.FC<TransferFundsProps> = ({ onTransactionComplete }) => {
  const [toEmail, setToEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!toEmail) {
      setError('Recipient email is required');
      return;
    }

    if (!amount) {
      setError('Amount is required');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!description) {
      setError('Description is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await WalletService.transfer({
        toEmail,
        amount: amountNum,
        description
      });

      setSuccess(true);
      onTransactionComplete();
    } catch (err: any) {
      setError(err.message || 'Transfer failed. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {success ? (
        <div className="bg-green-50 border border-green-400 rounded p-4 text-center">
          <h3 className="text-green-800 font-semibold text-lg mb-2">Transfer successful!</h3>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => setSuccess(false)}
          >
            Make another transfer
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Transfer Funds</h2>

          {error && <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <div className="mb-4">
            <label htmlFor="toEmail" className="block text-gray-700 mb-2">Recipient Email</label>
            <input
              type="email"
              id="toEmail"
              value={toEmail}
              onChange={(e) => setToEmail(e.target.value)}
              placeholder="Enter recipient's email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

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
            <label htmlFor="description" className="block text-gray-700 mb-2">Description</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Processing...' : 'Transfer Funds'}
          </button>
        </form>
      )}
    </div>
  );
};

export default TransferFunds; 