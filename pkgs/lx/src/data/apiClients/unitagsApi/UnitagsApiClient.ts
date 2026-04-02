import {
  createFetchClient,
  createUnitagsApiClient,
  getCloudflareApiBaseUrl,
  provideSessionService,
  TrafficFlows,
} from '@luxexchange/api'
import { getConfig } from '@luxexchange/config'
import { getIsSessionServiceEnabled } from '@luxexchange/gating'
import { lxUrls } from 'lx/src/constants/urls'

const UnitagsApiFetchClient = createFetchClient({
  baseUrl:
    getConfig().unitagsApiUrlOverride || getCloudflareApiBaseUrl({ flow: TrafficFlows.Unitags, postfix: 'v2/unitags' }),
  getSessionService: () =>
    provideSessionService({ getBaseUrl: () => lxUrls.apiBaseUrlV2, getIsSessionServiceEnabled }),
})

export const UnitagsApiClient = createUnitagsApiClient({
  fetchClient: UnitagsApiFetchClient,
})
