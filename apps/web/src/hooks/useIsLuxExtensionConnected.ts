import { CONNECTION_PROVIDER_IDS } from '@luxexchange/lx/src/constants/web3'
import { useAccount } from '~/hooks/useAccount'

// Checks if the user is connected to the lux extension.
//
// @returns {boolean} True if the user is connected to the lux extension; otherwise, false.
//
export function useIsLuxExtensionConnected() {
  const currentConnector = useAccount().connector

  return currentConnector?.id === CONNECTION_PROVIDER_IDS.LUX_EXTENSION_RDNS
}
