import { createUseActiveAccount } from 'lx/src/features/accounts/store/utils/accounts'
import { createUseActiveAddress, createUseActiveAddresses } from 'lx/src/features/accounts/store/utils/addresses'
import { createUseAccountsStore } from 'lx/src/features/accounts/store/utils/createUseAccountsStore'
import { createUseActiveWallet } from 'lx/src/features/accounts/store/utils/wallets'
import { useAccountsStoreContext } from '@luxfi/wallet/src/features/accounts/store/provider'

export const useAccountsStore = createUseAccountsStore(useAccountsStoreContext)

export const useActiveAddress = createUseActiveAddress(useAccountsStoreContext)

export const useActiveAddresses = createUseActiveAddresses(useAccountsStoreContext)

export const useActiveAccount = createUseActiveAccount(useAccountsStoreContext)

export const useActiveWallet = createUseActiveWallet(useAccountsStoreContext)

// Wallet package currently has no use for connector information / status.
// export const useActiveConnector = createUseActiveConnector(useAccountsStoreContext)
// export const useConnectionStatus = createUseConnectionStatus(useAccountsStoreContext)
