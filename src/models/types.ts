export interface User {
  id: string;
  email: string;
  name: string;
  walletId: string;
}

export interface WalletResponse {
  id: string;
  name: string;
  balance: number;
  currency: string;
}

export interface TransferRequest {
  toEmail: string;
  amount: number;
  description: string;
}

export interface TransferResponse {
  fromWallet: WalletResponse;
  toWallet: WalletResponse;
  amount: number;
  description: string;
  timestamp: string;
}

export interface HistoryResponse {
  type: string;
  amount: number;
  description: string;
  timestamp: string;
  status: string;
}

export interface EmailTransactionRequest {
  amount: number;
  description: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
}

export enum TransactionType {
  P2P_TRANSFER = 'P2P_TRANSFER',
  CREDIT_CARD_DEPOSIT = 'CREDIT_CARD_DEPOSIT',
  BANK_DEPOSIT = 'BANK_DEPOSIT',
  DEBIN_REQUEST = 'DEBIN_REQUEST'
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  timestamp: Date;
  senderWalletId?: string;
  recipientWalletId?: string;
  recipientIdentifier?: string;
  description?: string;
}

export interface AddFundsProps {
  walletId: string;
  onTransactionComplete: () => void;
}
