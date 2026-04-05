import { useCallback, useMemo } from 'react'
<<<<<<< HEAD
import { CONNECTION_PROVIDER_IDS } from '@l.x/lx/src/constants/web3'
=======
import { CONNECTION_PROVIDER_IDS } from 'uniswap/src/constants/web3'
>>>>>>> upstream/main
import { Connector, useConnectors } from 'wagmi'

type ConnectorID = (typeof CONNECTION_PROVIDER_IDS)[keyof typeof CONNECTION_PROVIDER_IDS]

<<<<<<< HEAD
=======
// oxlint-disable-next-line max-params -- biome-parity: oxlint is stricter here
>>>>>>> upstream/main
function getWagmiConnectorWithId(
  connectors: readonly Connector[],
  id: ConnectorID,
  options: { shouldThrow: true },
): Connector
function getWagmiConnectorWithId(connectors: readonly Connector[], id: ConnectorID): Connector | undefined
<<<<<<< HEAD
// eslint-disable-next-line max-params
=======
// oxlint-disable-next-line max-params
>>>>>>> upstream/main
function getWagmiConnectorWithId(
  connectors: readonly Connector[],
  id: ConnectorID,
  options?: { shouldThrow: true },
): Connector | undefined {
  const connector = connectors.find((c) => c.id === id)
  if (!connector && options?.shouldThrow) {
    throw new Error(`Expected connector ${id} missing from wagmi context.`)
  }
  return connector
}

/** Returns a wagmi `Connector` with the given id. If `shouldThrow` is passed, an error will be thrown if the connector is not found. */
export function useWagmiConnectorWithId(id: ConnectorID, options: { shouldThrow: true }): Connector
export function useWagmiConnectorWithId(id: ConnectorID): Connector | undefined
export function useWagmiConnectorWithId(id: ConnectorID, options?: { shouldThrow: true }): Connector | undefined {
  const connectors = useConnectors()
  return useMemo(
    () =>
      options?.shouldThrow ? getWagmiConnectorWithId(connectors, id, options) : getWagmiConnectorWithId(connectors, id),
    [connectors, id, options],
  )
}

export enum ExtensionRequestMethods {
<<<<<<< HEAD
  OPEN_SIDEBAR = 'lux_openSidebar',
=======
  OPEN_SIDEBAR = 'uniswap_openSidebar',
>>>>>>> upstream/main
}

const ExtensionRequestArguments = {
  [ExtensionRequestMethods.OPEN_SIDEBAR]: ['Tokens', 'Activity'],
} as const

<<<<<<< HEAD
export function useLuxExtensionRequest() {
  const connector = useWagmiConnectorWithId(CONNECTION_PROVIDER_IDS.LUX_EXTENSION_RDNS)
=======
export function useUniswapExtensionRequest() {
  const connector = useWagmiConnectorWithId(CONNECTION_PROVIDER_IDS.UNISWAP_EXTENSION_RDNS)
>>>>>>> upstream/main
  const extensionRequest = useCallback(
    async <
      Type extends keyof typeof ExtensionRequestArguments,
      Key extends (typeof ExtensionRequestArguments)[Type][number],
    >(
      method: Type,
      arg: Key,
    ) => {
      const provider = (await connector?.getProvider()) as {
        request?: (params: { method: Type; params: Key[] }) => Promise<void>
      }
      if (!provider.request) {
        return
      }

      await provider.request({
        method,
        params: [arg],
      })
    },
    [connector],
  )

  return useMemo(() => {
    return connector ? extensionRequest : undefined
  }, [connector, extensionRequest])
}
