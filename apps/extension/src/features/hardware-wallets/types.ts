/**
 * Hardware Wallet Types
 * Ported from xwallet/Rabby with adaptations for WXT/React architecture
 */

export enum HardwareWalletType {
  Ledger = 'ledger',
  Trezor = 'trezor',
  Keystone = 'keystone',
  OneKey = 'onekey',
  Lattice = 'lattice',
  BitBox02 = 'bitbox02',
  ImKey = 'imkey',
}

export enum LedgerHDPathType {
  LedgerLive = 'LedgerLive',
  BIP44 = 'BIP44',
  Legacy = 'Legacy',
}

export interface HDPathInfo {
  label: string
  value: string
  description: string
}

export const LEDGER_HD_PATHS: Record<LedgerHDPathType, HDPathInfo> = {
  [LedgerHDPathType.LedgerLive]: {
    label: 'Ledger Live',
    value: "m/44'/60'/0'/0/0",
    description: 'Default path used by Ledger Live',
  },
  [LedgerHDPathType.BIP44]: {
    label: 'BIP44 Standard',
    value: "m/44'/60'/0'/0",
    description: 'Standard Ethereum path',
  },
  [LedgerHDPathType.Legacy]: {
    label: 'Legacy (MEW)',
    value: "m/44'/60'/0'",
    description: 'Legacy path used by older wallets',
  },
}

export interface HardwareAccount {
  address: string
  index: number
  balance?: string
  path: string
}

export interface HardwareWalletState {
  connected: boolean
  type: HardwareWalletType | null
  accounts: HardwareAccount[]
  selectedAccount: string | null
  error: string | null
  isLoading: boolean
}

export interface SignTransactionRequest {
  to: string
  value: string
  data: string
  gasLimit: string
  gasPrice?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
  nonce: number
  chainId: number
}

export interface SignMessageRequest {
  message: string
  address: string
}

export interface SignTypedDataRequest {
  address: string
  data: string // JSON stringified typed data
  version: 'V3' | 'V4'
}

export interface HardwareWalletBridge {
  connect(): Promise<void>
  disconnect(): Promise<void>
  isConnected(): boolean
  getAccounts(page?: number, perPage?: number): Promise<HardwareAccount[]>
  signTransaction(request: SignTransactionRequest): Promise<string>
  signMessage(request: SignMessageRequest): Promise<string>
  signTypedData(request: SignTypedDataRequest): Promise<string>
}

// Error types
export class HardwareWalletError extends Error {
  constructor(
    message: string,
    public code: string,
    public deviceType?: HardwareWalletType
  ) {
    super(message)
    this.name = 'HardwareWalletError'
  }
}

export const HardwareWalletErrorCodes = {
  NOT_CONNECTED: 'NOT_CONNECTED',
  CONNECTION_FAILED: 'CONNECTION_FAILED',
  USER_REJECTED: 'USER_REJECTED',
  DEVICE_LOCKED: 'DEVICE_LOCKED',
  APP_NOT_OPEN: 'APP_NOT_OPEN',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  TRANSPORT_ERROR: 'TRANSPORT_ERROR',
  INVALID_PATH: 'INVALID_PATH',
} as const
