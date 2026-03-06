import { Transport } from '@connectrpc/connect'
import { ConnectTransportOptions } from '@connectrpc/connect-web'
import { getTransport } from '@luxfi/api'
import { luxUrls } from 'lx/src/constants/urls'
import { BASE_LUX_HEADERS } from 'lx/src/data/apiClients/createLuxFetchClient'
import { isMobileApp } from 'utilities/src/platform'

export const createConnectTransportWithDefaults = (
  options: Partial<ConnectTransportOptions> = {},
  apiUrlOverride?: string,
): Transport =>
  getTransport({
    getBaseUrl: () => apiUrlOverride ?? luxUrls.apiBaseUrlV2,
    getHeaders: () => (isMobileApp ? BASE_LUX_HEADERS : {}),
    options,
  })

/**
 * Connectrpc transports for Lux REST BE service
 */
export const luxGetTransport = createConnectTransportWithDefaults({ useHttpGet: true })
export const luxPostTransport = createConnectTransportWithDefaults()

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
    return useQuery(newService, input, { transport: luxGetTransport })
  }
 */

export const dataApiGetTransport = createConnectTransportWithDefaults(
  { useHttpGet: true },
  luxUrls.dataApiBaseUrlV2,
)

export const dataApiPostTransport = createConnectTransportWithDefaults(undefined, luxUrls.dataApiBaseUrlV2)
