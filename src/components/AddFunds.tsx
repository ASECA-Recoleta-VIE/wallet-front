import { useState } from 'react';
import WalletService from '../services/WalletService';

interface AddFundsProps {
  onTransactionComplete: () => void;
}

const AddFunds: React.FC<AddFundsProps> = ({ onTransactionComplete }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

    if (!description) {
      setError('Description is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await WalletService.deposit({
        amount: amountNum,
        description
      });

      setSuccess(true);
      setTimeout(() => {
        onTransactionComplete();
      }, 1500);
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
        <div className="bg-green-50 border border-green-400 rounded p-4 text-center" data-testid="addfunds-success">
          <h3 className="text-green-800 font-semibold text-lg mb-2">Funds added successfully!</h3>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={() => setSuccess(false)}
          >
            Add more funds
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Add Funds to Your Wallet</h2>

          {error && <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700 mb-2">Amount</label>
            <input
              type="number"
              id="amount"
              data-testid="addfunds-amount"
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
              data-testid="addfunds-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            data-testid="addfunds-submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Processing...' : 'Add Funds'}
          </button>
        </form>
      )}
    </div>
  );
};

export default AddFunds;
