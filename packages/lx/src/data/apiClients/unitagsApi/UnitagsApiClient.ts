import {
  createFetchClient,
  createUnitagsApiClient,
  getCloudflareApiBaseUrl,
  provideSessionService,
  TrafficFlows,
} from '@luxfi/api'
import { getConfig } from '@luxfi/config'
import { getIsSessionServiceEnabled } from '@luxfi/gating'
import { uniswapUrls } from 'lx/src/constants/urls'

const UnitagsApiFetchClient = createFetchClient({
  baseUrl: getConfig().unitagsApiUrlOverride || `${getCloudflareApiBaseUrl(TrafficFlows.Unitags)}/v2/unitags`,
  getSessionService: () =>
    provideSessionService({ getBaseUrl: () => uniswapUrls.apiBaseUrlV2, getIsSessionServiceEnabled }),
})

export const UnitagsApiClient = createUnitagsApiClient({
  fetchClient: UnitagsApiFetchClient,
})
