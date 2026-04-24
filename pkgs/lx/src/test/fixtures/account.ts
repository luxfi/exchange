import { AccountType } from '@l.x/lx/src/features/accounts/types'
import { Platform } from '@l.x/lx/src/features/platforms/types/Platform'
import { EVMAccountDetails } from '@l.x/lx/src/features/wallet/types/AccountDetails'
import { WalletMeta } from '@l.x/lx/src/features/wallet/types/WalletMeta'
import { HexString } from '@l.x/utils/src/addresses/hex'

export const createMockEVMAccountDetails = (overrides: Partial<EVMAccountDetails> = {}): EVMAccountDetails => {
  return {
    platform: Platform.EVM,
    accountType: AccountType.SignerMnemonic,
    walletMeta: {
      id: '1234567890123456789012345678901234567890',
      name: 'Mock EVM Wallet',
      icon: 'https://mock.com/icon.png',
    },
    address: '0x1234567890123456789012345678901234567890',
    ...overrides,
  }
}
