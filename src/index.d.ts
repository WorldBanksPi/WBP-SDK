export type WbpEnvironment = 'sandbox' | 'production';

export interface WbpSdkConfig {
  apiKey: string;
  environment?: WbpEnvironment;
  baseUrl?: string;
  timeout?: number;
}

export interface WbpBalanceResponse {
  success: boolean;
  asset: string;
  balance: string;
  network: string;
}

export interface WbpBalancesResponse {
  success: boolean;
  address: string;
  exists: boolean;
  balances: {
    pi: string;
    wbp: string;
  };
  network: string;
}

export interface WbpSendTransactionParams {
  recipient?: string;
  recipientPublicKey?: string;
  amount: string | number;
}

export interface WbpSendTransactionResponse {
  success: boolean;
  message: string;
  hash: string;
  network: string;
}

export interface WbpPaymentRecord {
  paymentId: string;
  status: 'created' | 'authorized' | 'submitted' | 'completed' | 'cancelled' | 'expired';
  network: string;
  senderAddress: string;
  recipientAddress: string;
  assetType: 'pi' | 'wbp';
  amount: string;
  txHash: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface WbpPaymentVerificationResponse {
  success: boolean;
  payment: WbpPaymentRecord;
}

export declare const ENVIRONMENTS: {
  sandbox: string;
  production: string;
};

export declare class WbpSdk {
  apiKey: string;
  environment: WbpEnvironment;
  isSandbox: boolean;
  baseUrl: string;

  constructor(config: WbpSdkConfig);

  wallets: {
    getBalance(piAddress: string): Promise<WbpBalanceResponse>;
    getBalances(piAddress: string): Promise<WbpBalancesResponse>;
  };

  transactions: {
    send(params: WbpSendTransactionParams): Promise<WbpSendTransactionResponse>;
  };

  payments: {
    get(paymentId: string): Promise<WbpPaymentVerificationResponse>;
  };
}
