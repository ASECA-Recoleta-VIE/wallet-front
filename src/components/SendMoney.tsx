import { useState } from 'react';
import TransactionService from '../services/TransactionService';

interface SendMoneyProps {
  walletId: string;
  onTransactionComplete: () => void;
}

const SendMoney: React.FC<SendMoneyProps> = ({ walletId, onTransactionComplete }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipient || !amount) {
      setError('Recipient and amount are required');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const transaction = await TransactionService.createP2PTransfer(
        walletId,
        recipient,
        amountNum,
        description
      );

      if (!transaction) {
        setError('Transaction failed. Please check the recipient details and your balance.');
      } else {
        setSuccess(true);
        setRecipient('');
        setAmount('');
        setDescription('');
        onTransactionComplete();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="send-money">
      <h2>Send Money</h2>

      {success && (
        <div className="success-message">
          Money sent successfully!
          <button onClick={() => setSuccess(false)}>Send Another</button>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Recipient Email or ID</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Email or User ID"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              min="0.01"
              step="0.01"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              disabled={loading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Send Money'}
          </button>
        </form>
      )}
    </div>
  );
};

export default SendMoney;
