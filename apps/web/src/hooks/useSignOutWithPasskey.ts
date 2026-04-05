import { usePrivy } from '@privy-io/react-auth'
import { CONNECTION_PROVIDER_IDS } from 'uniswap/src/constants/web3'
import { disconnectWallet } from 'uniswap/src/features/passkey/embeddedWallet'
import { Platform } from 'uniswap/src/features/platforms/types/Platform'
import { logger } from 'utilities/src/logger/logger'
import { useActiveWallet } from '~/features/accounts/store/hooks'
import { usePasskeyAuthWithHelpModal } from '~/hooks/usePasskeyAuthWithHelpModal'
import { useEmbeddedWalletState } from '~/state/embeddedWallet/store'

interface SignOutWithPasskeyOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

/**
 * Hook that provides functionality to sign out from an embedded wallet using passkey.
 * Upon successful sign-out:
 * - Disconnects the underlying wallet connection
 * - Updates the embedded wallet state by setting isConnected to false
 *
 * @param {Object} options - Configuration options for the sign-out process
 * @param {() => void} [options.onSuccess] - Optional callback function to execute after successful sign-out
 * @param {(error: Error) => void} [options.onError] - Optional callback function to handle any errors during sign-out
 * @returns Mutation object with signOutWithPasskey function and mutation states
 */
export function useSignOutWithPasskey({ onSuccess, onError }: SignOutWithPasskeyOptions = {}) {
  const { setIsConnected } = useEmbeddedWalletState()
  const { logout, ready } = usePrivy()
  const activeEVMWallet = useActiveWallet(Platform.EVM)
  const connectedWithEmbeddedWallet = activeEVMWallet?.id === CONNECTION_PROVIDER_IDS.EMBEDDED_WALLET_CONNECTOR_ID

  const { mutate: signOutWithPasskey, ...rest } = usePasskeyAuthWithHelpModal(
    async () => {
      await disconnectWallet()
      if (connectedWithEmbeddedWallet && ready) {
        await logout().catch((err) => {
          logger.warn('useSignOutWithPasskey', 'Privy logout failed after disconnectWallet', err)
        })
      }
      return true
    },
    {
      onSuccess: () => {
        setIsConnected(false)
        onSuccess?.()
      },
      onError: (error: Error) => {
        logger.error(error, {
          tags: {
            file: 'useSignOutWithPasskey',
            function: 'signOutWithPasskey',
          },
        })
        onError?.(error)
      },
    },
  )

  return { signOutWithPasskey, ...rest }
}
