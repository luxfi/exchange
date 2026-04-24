import { AccountType } from '@l.x/lx/src/features/accounts/types'
import { Platform } from '@l.x/lx/src/features/platforms/types/Platform'
import { WalletMeta } from '@l.x/lx/src/features/wallet/types/WalletMeta'
import { HexString } from '@l.x/utils/src/addresses/hex'

export type BaseAccountDetails<TPlatform extends Platform, TAddressType extends string = string> = {
  platform: TPlatform
  accountType: AccountType
  address: TAddressType
  walletMeta: WalletMeta
  // displayName: string
}

export type EVMAccountDetails = BaseAccountDetails<Platform.EVM, HexString>
export type SVMAccountDetails = BaseAccountDetails<Platform.SVM, string>

type PlatformAccountDetails = EVMAccountDetails | SVMAccountDetails
export type SignerMnemonicAccountDetails = PlatformAccountDetails & { accountType: AccountType.SignerMnemonic }
type ReadOnlyAccountDetails = PlatformAccountDetails & { accountType: AccountType.Readonly }

export type AccountDetails = SignerMnemonicAccountDetails | ReadOnlyAccountDetails

export function isSignerMnemonicAccountDetails(account: AccountDetails): account is SignerMnemonicAccountDetails {
  return account.accountType === AccountType.SignerMnemonic
}
