import { useLuxContext } from '@l.x/lx/src/contexts/LuxContext'
import type { AccountsStore } from '@l.x/lx/src/features/accounts/store/types/AccountsState'
import { createUseActiveAccount } from '@l.x/lx/src/features/accounts/store/utils/accounts'
import { createUseActiveAddress, createUseActiveAddresses } from '@l.x/lx/src/features/accounts/store/utils/addresses'
import {
  createUseActiveConnector,
  createUseConnectionStatus,
} from '@l.x/lx/src/features/accounts/store/utils/connection'
import { createUseAccountsStore } from '@l.x/lx/src/features/accounts/store/utils/createUseAccountsStore'
import { createUseActiveWallet, createUseWalletWithId } from '@l.x/lx/src/features/accounts/store/utils/wallets'

/** Gets AccountsStoreContext for the current app, passed by the app to this package via `LuxProvider`. */
function useCurrentAppAccountStoreContext(): AccountsStore {
  const useAccountsStoreContextHook = useLuxContext().useAccountsStoreContextHook
  return useAccountsStoreContextHook()
}

export const useAccountsStore = createUseAccountsStore(useCurrentAppAccountStoreContext)

export const useActiveAddress = createUseActiveAddress(useCurrentAppAccountStoreContext)

export const useActiveAddresses = createUseActiveAddresses(useCurrentAppAccountStoreContext)

export const useActiveAccount = createUseActiveAccount(useCurrentAppAccountStoreContext)

export const useActiveConnector = createUseActiveConnector(useCurrentAppAccountStoreContext)

export const useActiveWallet = createUseActiveWallet(useCurrentAppAccountStoreContext)

export const useConnectionStatus = createUseConnectionStatus(useCurrentAppAccountStoreContext)

export const useWalletWithId = createUseWalletWithId(useCurrentAppAccountStoreContext)
