import { Wallet } from '../models/types';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

class WalletService {

  getWalletByUserId(userId: string): Promise<Wallet[] | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(`${API_URL}/api/wallets/${userId}`, { withCredentials: true });
        resolve(response.data as Wallet[]);
      } catch (error) {
        reject(error);
      }
    });
  }

  getWalletById(walletId: string): Promise<Wallet | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.get(`${API_URL}/api/wallets/${walletId}`, { withCredentials: true });
        resolve(response.data as Wallet);
      } catch (error) {
        reject(error);
      }
    });
  }

  updateBalance(walletId: string, amount: number): Promise<Wallet | null> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.put(`${API_URL}/api/wallets/${walletId}`, { amount }, { withCredentials: true });
        resolve(response.data as Wallet);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new WalletService();
