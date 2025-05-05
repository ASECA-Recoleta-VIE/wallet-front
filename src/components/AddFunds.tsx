import { useState } from 'react';
import TransactionService from '../services/TransactionService';

interface AddFundsProps {
  walletId: string;
  onTransactionComplete: () => void;
}

const AddFunds: React.FC<AddFundsProps> = ({ walletId, onTransactionComplete }) => {
  const [method, setMethod] = useState<'creditCard' | 'bankAccount'>('creditCard');
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankRoutingNumber, setBankRoutingNumber] = useState('');
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

    if (method === 'creditCard' && (!cardNumber || !cardExpiry || !cardCVV)) {
      setError('All card details are required');
      return;
    }

    if (method === 'bankAccount' && (!bankAccountNumber || !bankRoutingNumber)) {
      setError('All bank details are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let transaction;

      if (method === 'creditCard') {
        transaction = await TransactionService.addFundsFromCreditCard(
          walletId,
          amountNum,
          { number: cardNumber, expiry: cardExpiry, cvv: cardCVV }
        );
      } else {
        transaction = await TransactionService.addFundsFromBankAccount(
          walletId,
          amountNum,
          { accountNumber: bankAccountNumber, routingNumber: bankRoutingNumber }
        );
      }

      if (transaction) {
        setSuccess(true);
        onTransactionComplete();
      }
    } catch (err) {
      setError('Transaction failed. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMethod(e.target.value as 'creditCard' | 'bankAccount');
  };

  return (
    <div className="max-w-md mx-auto">
      {success ? (
        <div className="bg-green-50 border border-green-400 rounded p-4 text-center">
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
            <label htmlFor="method" className="block text-gray-700 mb-2">Payment Method</label>
            <select
              id="method"
              value={method}
              onChange={handleMethodChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="creditCard">Credit Card</option>
              <option value="bankAccount">Bank Account</option>
            </select>
          </div>

          {method === 'creditCard' && (
            <>
              <div className="mb-4">
                <label htmlFor="cardNumber" className="block text-gray-700 mb-2">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Card number"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="cardExpiry" className="block text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    id="cardExpiry"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="cardCVV" className="block text-gray-700 mb-2">CVV</label>
                  <input
                    type="text"
                    id="cardCVV"
                    value={cardCVV}
                    onChange={(e) => setCardCVV(e.target.value)}
                    placeholder="CVV"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          {method === 'bankAccount' && (
            <>
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
            </>
          )}

          <button
            type="submit"
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
