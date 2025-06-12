import { Transaction, TransactionStatus, TransactionType } from '../models/types';
import AuthService from './AuthService';
import WalletService from './WalletService';
import axios from '../interceptors/axios';

class TransactionService {
  private static transactions: Transaction[] = [];

  async createP2PTransfer(
    senderWalletId: string,
    recipientIdentifier: string,
    amount: number,
    description?: string
  ): Promise<Transaction | null> {
    // Check if recipient exists (by email or ID)
    let recipientUser = await AuthService.getUserByEmail(recipientIdentifier);

    // If not found by email, try by ID
    if (!recipientUser) {
      recipientUser = await AuthService.getUserById(recipientIdentifier);
    }

    if (!recipientUser) {
      return null; // Recipient not found
    }

    // Get recipient wallet
    const recipientWallet = await WalletService.getWalletByUserId(recipientUser.id);
    if (!recipientWallet) {
      return null; // Recipient wallet not found
    }

    // Check if sender has enough balance
    const senderWallet = await WalletService.getWalletById(senderWalletId);
    if (!senderWallet || senderWallet.balance < amount) {
      return null; // Insufficient funds
    }

    // Create transaction
    const transaction: Transaction = {
      id: `tx${TransactionService.transactions.length + 1}`,
      type: TransactionType.P2P_TRANSFER,
      status: TransactionStatus.COMPLETED,
      amount,
      senderWalletId,
      recipientWalletId: recipientWallet.id,
      recipientIdentifier,
      description,
      timestamp: new Date(),
    };

    // Update balances
    await WalletService.updateBalance(senderWalletId, -amount);
    await WalletService.updateBalance(recipientWallet.id, amount);

    // Save transaction
    TransactionService.transactions.push(transaction);

    return transaction;
  }

  async addFundsFromCreditCard(
    walletId: string,
    amount: number,
    cardDetails: { number: string, expiry: string, cvv: string }
  ): Promise<Transaction | null> {
    // Create transaction
    const transaction: Transaction = {
      id: `tx${TransactionService.transactions.length + 1}`,
      type: TransactionType.CREDIT_CARD_DEPOSIT,
      status: TransactionStatus.COMPLETED,
      amount,
      recipientWalletId: walletId,
      description: `Credit card deposit: ${cardDetails.number.slice(-4)}`,
      timestamp: new Date(),
    };

    // Update wallet balance
    await WalletService.updateBalance(walletId, amount);

    // Save transaction
    TransactionService.transactions.push(transaction);

    return transaction;
  }

  async addFundsFromBankAccount(
    walletId: string,
    amount: number,
    bankDetails: { accountNumber: string, routingNumber: string }
  ): Promise<Transaction | null> {
    // Create transaction
    const transaction: Transaction = {
      id: `tx${TransactionService.transactions.length + 1}`,
      type: TransactionType.BANK_DEPOSIT,
      status: TransactionStatus.COMPLETED,
      amount,
      recipientWalletId: walletId,
      description: `Bank deposit: ${bankDetails.accountNumber.slice(-4)}`,
      timestamp: new Date(),
    };

    // Update wallet balance
    await WalletService.updateBalance(walletId, amount);

    // Save transaction
    TransactionService.transactions.push(transaction);

    return transaction;
  }

  async requestDebin(
    amount: number,
    bankDetails: { accountId: string, description: string }
  ): Promise<Transaction | null> {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await axios.post(`${API_URL}/request-funds`, {
        amount,
        accountId: bankDetails.accountId,
        description: bankDetails.description
      });

      // Create transaction based on response
      const transaction: Transaction = {
        id: response.data.id || `tx${TransactionService.transactions.length + 1}`,
        type: TransactionType.DEBIN_REQUEST,
        status: TransactionStatus.COMPLETED,
        amount,
        description: `DEBIN request: ${bankDetails.accountId.slice(-4)}`,
        timestamp: new Date(),
      };

      // Save transaction locally for history
      TransactionService.transactions.push(transaction);

      return transaction;
    } catch (error: any) {
      console.error('DEBIN request failed:', error);
      throw new Error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data ||
        'DEBIN request failed'
      );
    }
  }

  getTransactionsByWalletId(walletId: string): Promise<Transaction[]> {
    return Promise.resolve(
      TransactionService.transactions.filter(
        tx => tx.senderWalletId === walletId || tx.recipientWalletId === walletId
      )
    );
  }
}

export default new TransactionService();
