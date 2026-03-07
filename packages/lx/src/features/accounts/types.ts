export enum AccountType {
  SignerMnemonic = 'signerMnemonic', // Key lives in native keystore
  SignerMPC = 'signerMPC', // Key shares distributed via MPC (non-custodial)
  Readonly = 'readonly', // Accounts without keys (e.g. so user can track balances)
}

export interface SignerMnemonicAccountMeta {
  type: AccountType.SignerMnemonic
  address: Address
}

export interface SignerMPCAccountMeta {
  type: AccountType.SignerMPC
  address: Address
  walletId?: string // MPC wallet ID for signing
}

export interface ReadOnlyAccountMeta {
  type: AccountType.Readonly
  address: Address
}

export type AccountMeta = SignerMnemonicAccountMeta | SignerMPCAccountMeta | ReadOnlyAccountMeta

export type DisplayName = {
  name: string
  type: DisplayNameType
}

export enum DisplayNameType {
  Address = 0,
  ENS = 1,
  Local = 2, // Mob/ext-only: represents locally-saved wallet labels & mid-onboarding pending names
  Unitag = 3,
}
