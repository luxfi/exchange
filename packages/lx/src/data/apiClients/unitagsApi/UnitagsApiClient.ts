import {
  createFetchClient,
  createUnitagsApiClient,
  getCloudflareApiBaseUrl,
  provideSessionService,
  TrafficFlows,
} from '@luxfi/api'
import { getConfig } from '@luxfi/config'
import { getIsSessionServiceEnabled } from '@luxfi/gating'
import { luxUrls } from 'lx/src/constants/urls'

const UnitagsApiFetchClient = createFetchClient({
  baseUrl:
    getConfig().unitagsApiUrlOverride || getCloudflareApiBaseUrl({ flow: TrafficFlows.Unitags, postfix: 'v2/unitags' }),
  getSessionService: () =>
    provideSessionService({ getBaseUrl: () => luxUrls.apiBaseUrlV2, getIsSessionServiceEnabled }),
})

export const UnitagsApiClient = createUnitagsApiClient({
  fetchClient: UnitagsApiFetchClient,
})
