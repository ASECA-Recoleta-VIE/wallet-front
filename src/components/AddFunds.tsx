import React, { useState } from 'react';
import WalletService from '../services/WalletService';
import { showErrorToast, showSuccessToast } from '../utils/toast';
import FormInput from './FormInput';

interface AddFundsProps {
  onTransactionComplete: () => void;
}

const AddFunds: React.FC<AddFundsProps> = ({ onTransactionComplete }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [amountError, setAmountError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const validate = () => {
    let valid = true;
    if (!amount) {
      setAmountError('Amount is required');
      valid = false;
    } else if (isNaN(Number(amount)) || Number(amount) < 0.01) {
      setAmountError('Amount must be at least 0.01');
      valid = false;
    } else {
      setAmountError('');
    }

    if (!description) {
      setDescriptionError('Description is required');
      valid = false;
    } else {
      setDescriptionError('');
    }
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    if (!validate()) {
      return;
    }
    setLoading(true);
    try {
      await WalletService.deposit({
        amount: parseFloat(amount),
        description
      });
      showSuccessToast('Funds added successfully!');
      setAmount('');
      setDescription('');
      setShowErrors(false);
        onTransactionComplete();
    } catch (err) {
      showErrorToast('Transaction failed. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Add Funds to Your Wallet</h2>

        <FormInput
          id="amount"
          label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              step="0.01"
              required
          showError={showErrors}
          error={amountError}
          data-testid="addfunds-amount"
            />

        <FormInput
          id="description"
          label="Description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              required
          showError={showErrors}
          error={descriptionError}
          data-testid="addfunds-description"
            />

          <button
            type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            data-testid="addfunds-submit"
          >
            {loading ? 'Processing...' : 'Add Funds'}
          </button>
        </form>
    </div>
  );
};

export default AddFunds;
