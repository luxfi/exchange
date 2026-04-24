import { useQuery } from '@tanstack/react-query'
import { CONNECTION_PROVIDER_IDS } from '@l.x/lx/src/constants/web3'
import { getPrivyEnums, isSessionAuthenticatedForAction } from '@l.x/lx/src/features/passkey/embeddedWallet'
import { PasskeyAuthStatus } from '@l.x/lx/src/features/transactions/components/TransactionModal/TransactionModalContext'
import { ReactQueryCacheKey } from '@l.x/utils/src/reactQuery/cache'
export function useGetPasskeyAuthStatus(connectionType: string | undefined): PasskeyAuthStatus {
  const isSignedInWithPasskey = connectionType === CONNECTION_PROVIDER_IDS.EMBEDDED_WALLET_CONNECTOR_ID

  const { data: isSessionAuthenticated = false } = useQuery({
    queryKey: [ReactQueryCacheKey.PasskeyAuthStatus, isSignedInWithPasskey],
    queryFn: async () => {
      const { Action } = await getPrivyEnums()
      return isSessionAuthenticatedForAction(Action.SIGN_TRANSACTION)
    },
    enabled: isSignedInWithPasskey,
    gcTime: 0,
    staleTime: 0,
  })

  return {
    isSignedInWithPasskey,
    isSessionAuthenticated,
    needsPasskeySignin: isSignedInWithPasskey && !isSessionAuthenticated,
  }
}
