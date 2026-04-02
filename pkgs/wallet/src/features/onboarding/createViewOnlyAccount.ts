import dayjs from 'dayjs'
import { AccountType } from 'lx/src/features/accounts/types'
import { Platform } from 'lx/src/features/platforms/types/Platform'
import { getValidAddress } from 'lx/src/utils/addresses'
import { ReadOnlyAccount } from '@luxfi/wallet/src/features/wallet/accounts/types'

export const createViewOnlyAccount = (address: string): ReadOnlyAccount => {
  // TODO(WALL-7065): Update to support Solana
  const formattedAddress = getValidAddress({ address, platform: Platform.EVM, withEVMChecksum: true })
  if (!formattedAddress) {
    throw new Error('Cannot import invalid view-only address')
  }

  const account: ReadOnlyAccount = {
    type: AccountType.Readonly,
    address: formattedAddress,
    timeImportedMs: dayjs().valueOf(),
    pushNotificationsEnabled: true,
  }
  return account
}
