import React, { useState } from 'react';
import WalletService from '../services/WalletService';
import { showErrorToast, showSuccessToast } from '../utils/toast';
import FormInput from './FormInput';

interface TransferFundsProps {
  onTransactionComplete: () => void;
}

const TransferFunds: React.FC<TransferFundsProps> = ({ onTransactionComplete }) => {
  const [toEmail, setToEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const validateForm = () => {
    if (!toEmail) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(toEmail)) return false;
    const num = Number(amount);
    if (!amount || isNaN(num) || num < 0.01) return false;
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await WalletService.transfer({
        toEmail,
        amount: parseFloat(amount),
        description
      });

      showSuccessToast('Transfer successful!');
      setToEmail('');
      setAmount('');
      setDescription('');
      onTransactionComplete();
    } catch (err: any) {
      showErrorToast(err.message || 'Transfer failed. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Transfer Funds</h2>

        <FormInput
          id="toEmail"
          label="Recipient Email"
          type="email"
          value={toEmail}
          onChange={(e) => setToEmail(e.target.value)}
          placeholder="Enter recipient's email"
          required
          showError={showErrors}
          data-testid="transfer-to-email"
          onValidationChange={(isValid) => setIsFormValid(isValid)}
        />

        <FormInput
          id="amount"
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          step="0.01"
          min="0.01"
          required
          showError={showErrors}
          data-testid="transfer-amount"
          onValidationChange={(isValid) => setIsFormValid(isValid)}
        />

        <FormInput
          id="description"
          label="Description (optional)"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          data-testid="transfer-description"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          data-testid="transfer-submit"
        >
          {loading ? 'Processing...' : 'Transfer Funds'}
        </button>
      </form>
    </div>
  );
};

export default TransferFunds; 