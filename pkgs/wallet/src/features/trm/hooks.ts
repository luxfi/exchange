import { AccountType } from 'lx/src/features/accounts/types'
import { IsBlockedResult, useIsBlocked } from 'lx/src/features/trm/hooks'
import { useActiveAccount } from '@luxfi/wallet/src/features/wallet/hooks'

/** Returns TRM status for the active account. */
export function useIsBlockedActiveAddress(): IsBlockedResult {
  const account = useActiveAccount()
  return useIsBlocked(account?.address, account?.type === AccountType.Readonly)
}
