import { CONNECTION_PROVIDER_IDS } from 'lx/src/constants/web3'
import { useAccount } from '~/hooks/useAccount'

// Checks if the user is connected to the lx extension.
//
// @returns {boolean} True if the user is connected to the lx extension; otherwise, false.
//
export function useIsLxExtensionConnected() {
  const currentConnector = useAccount().connector

  return currentConnector?.id === CONNECTION_PROVIDER_IDS.LX_EXTENSION_RDNS
}
