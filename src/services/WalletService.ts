import { Wallet } from '../models/types';

class WalletService {
  private static wallets: Wallet[] = [
    {
      id: 'wallet1',
      userId: '1',
      balance: 1000,
    },
    {
      id: 'wallet2',
      userId: '2',
      balance: 500,
    },
  ];

  getWalletByUserId(userId: string): Promise<Wallet | null> {
    return Promise.resolve(
      WalletService.wallets.find(w => w.userId === userId) || null
    );
  }

  getWalletById(walletId: string): Promise<Wallet | null> {
    return Promise.resolve(
      WalletService.wallets.find(w => w.id === walletId) || null
    );
  }

  updateBalance(walletId: string, amount: number): Promise<Wallet | null> {
    const wallet = WalletService.wallets.find(w => w.id === walletId);
    if (!wallet) {
      return Promise.resolve(null);
    }

    wallet.balance += amount;
    return Promise.resolve(wallet);
  }
}

export default new WalletService();
