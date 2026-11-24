export type WbpEnvironment = 'sandbox' | 'production';
export type WbpAssetType = 'pi' | 'wbp';

export interface WbpSdkConfig {
  apiKey: string;
  environment?: WbpEnvironment;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
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
  idempotencyKey?: string;
}

export interface WbpSendTransactionResponse {
  success: boolean;
  message: string;
  hash: string;
  network: string;
  idempotentReplay?: boolean;
}

export interface WbpCreateCheckoutParams {
  orderId?: string;
  amount: string | number;
  assetType?: WbpAssetType;
  recipientAddress?: string;
  memo?: string;
  returnUrl?: string;
  webhookUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface WbpCheckoutSession {
  checkoutId: string;
  checkoutUrl?: string;
  qrData?: string;
  orderId: string | null;
  status: 'pending' | 'completed' | 'expired';
  assetType: WbpAssetType;
  amount: string;
  recipientAddress: string;
  network: string;
  paymentId?: string | null;
  txHash?: string | null;
  webhookStatus?: string | null;
  createdAt?: string;
  expiresAt: string;
  completedAt?: string | null;
}

export interface WbpCheckoutResponse {
  success: boolean;
  checkout: WbpCheckoutSession;
}

export interface WbpPaymentRecord {
  paymentId: string;
  checkoutId?: string | null;
  status: 'created' | 'authorized' | 'submitted' | 'completed' | 'cancelled' | 'expired';
  network: string;
  senderAddress: string;
  recipientAddress: string;
  assetType: WbpAssetType;
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

export declare function verifyWebhookSignature(
  rawBody: string | Buffer,
  signatureHeader: string,
  webhookSecret: string
): boolean;

export declare class WbpSdk {
  apiKey: string;
  environment: WbpEnvironment;
  isSandbox: boolean;
  maxRetries: number;
  baseUrl: string;

  constructor(config: WbpSdkConfig);

  static verifyWebhookSignature: typeof verifyWebhookSignature;

  wallets: {
    getBalance(piAddress: string): Promise<WbpBalanceResponse>;
    getBalances(piAddress: string): Promise<WbpBalancesResponse>;
  };

  transactions: {
    send(params: WbpSendTransactionParams): Promise<WbpSendTransactionResponse>;
  };

  payments: {
    createCheckout(params: WbpCreateCheckoutParams): Promise<WbpCheckoutResponse>;
    getCheckout(checkoutId: string): Promise<WbpCheckoutResponse>;
    get(paymentId: string): Promise<WbpPaymentVerificationResponse>;
  };
}

export default WbpSdk;
