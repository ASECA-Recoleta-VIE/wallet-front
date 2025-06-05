import { WalletResponse, TransferRequest, TransferResponse, HistoryResponse, EmailTransactionRequest } from '../models/types';
import axios from '../interceptors/axios';

const API_URL = import.meta.env.VITE_API_URL;

class WalletService {
  async getWallet(): Promise<WalletResponse> {
    try {
      const response = await axios.get(`${API_URL}/wallet`);
      return response.data as WalletResponse;
    } catch (error: any) {
      console.error('Failed to get wallet:', error);
      throw new Error(error.response?.data || 'Failed to get wallet');
    }
  }

  async deposit(request: EmailTransactionRequest): Promise<WalletResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/deposit`,
        request
      );
      return response.data as WalletResponse;
    } catch (error: any) {
      console.error('Deposit failed:', error);
      throw new Error(error.response?.data || 'Deposit failed');
    }
  }

  async withdraw(request: EmailTransactionRequest): Promise<WalletResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/withdraw`,
        request
      );
      return response.data as WalletResponse;
    } catch (error: any) {
      console.error('Withdrawal failed:', error);
      throw new Error(error.response?.data || 'Withdrawal failed');
    }
  }

  async transfer(request: TransferRequest): Promise<TransferResponse> {
    try {
      const response = await axios.post(
        `${API_URL}/transfer`,
        request
      );
      return response.data as TransferResponse;
    } catch (error: any) {
      console.error('Transfer failed:', error);
      throw new Error(error.response?.data || 'Transfer failed');
    }
  }

  async getHistory(): Promise<HistoryResponse[]> {
    try {
      const response = await axios.get(`${API_URL}/history`);
      return response.data as HistoryResponse[];
    } catch (error: any) {
      console.error('Failed to get history:', error);
      throw new Error(error.response?.data || 'Failed to get history');
    }
  }

  async getWalletByUserId(userId: string): Promise<WalletResponse | null> {
    try {
      const response = await axios.get(`${API_URL}/wallet/user/${userId}`);
      return response.data as WalletResponse;
    } catch (error: any) {
      console.error('Failed to get wallet by user ID:', error);
      return null;
    }
  }

  async getWalletById(walletId: string): Promise<WalletResponse | null> {
    try {
      const response = await axios.get(`${API_URL}/wallet/${walletId}`);
      return response.data as WalletResponse;
    } catch (error: any) {
      console.error('Failed to get wallet by ID:', error);
      return null;
    }
  }

  async updateBalance(walletId: string, amount: number): Promise<WalletResponse> {
    try {
      const response = await axios.put(`${API_URL}/wallet/${walletId}/balance`, { amount });
      return response.data as WalletResponse;
    } catch (error: any) {
      console.error('Failed to update wallet balance:', error);
      throw new Error(error.response?.data || 'Failed to update wallet balance');
    }
  }
}

export default new WalletService();
