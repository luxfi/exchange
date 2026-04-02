import { Transport } from '@connectrpc/connect'
import { ConnectTransportOptions } from '@connectrpc/connect-web'
import { getEntryGatewayUrl, getTransport } from '@l.x/api'
import { lxUrls } from 'lx/src/constants/urls'
import { BASE_LX_HEADERS } from 'lx/src/data/apiClients/createLxFetchClient'
import { isWebApp } from 'utilities/src/platform'

export function createConnectTransportWithDefaults({
  options = {},
  getBaseUrlOverride,
}: {
  options?: Partial<ConnectTransportOptions>
  getBaseUrlOverride?: () => string
}): Transport {
  return getTransport({
    getBaseUrl: getBaseUrlOverride ?? ((): string => lxUrls.apiBaseUrlV2),
    getHeaders: () => BASE_LX_HEADERS,
    options,
  })
}

/**
 * Connectrpc transports for Lux REST BE service
 */
export const lxGetTransport = createConnectTransportWithDefaults({ options: { useHttpGet: true } })
export const lxPostTransport = createConnectTransportWithDefaults({})

// The string arg to pass to the BE for chainId to get data for all networks
export const ALL_NETWORKS_ARG = 'ALL_NETWORKS'

/**
 * To add a ConnectRPC hook for a new BE client service:
 * 1. Create a new file in the `data/rest` directory with a name matching the service
 * 2. Copy the below template replacing `newService` with the service name
 *   a. The client service, Request, and Response types are imported from the generated client
 *   b. You can use exploreStats as a reference for how to structure the hook
 * export function useNewServiceQuery(
    input?: PartialMessage<NewServiceRequest>,
  ): UseQueryResult<NewServiceResponse, ConnectError> {
    return useQuery(newService, input, { transport: lxGetTransport })
  }
 */

export const dataApiGetTransport = createConnectTransportWithDefaults({
  options: { useHttpGet: true },
  getBaseUrlOverride: () => lxUrls.dataApiBaseUrlV2,
})

export const dataApiPostTransport = createConnectTransportWithDefaults({
  getBaseUrlOverride: () => lxUrls.dataApiBaseUrlV2,
})

/**
 * ConnectRPC transport for services behind the entry-gateway (sessions-authenticated).
 */
export const entryGatewayPostTransport = createConnectTransportWithDefaults({
  // Web uses cookies (credentials: 'include'), while mobile/extension use session headers (via getTransport interceptor).
  options: isWebApp ? { credentials: 'include' } : undefined,
  getBaseUrlOverride: getEntryGatewayUrl,
})
