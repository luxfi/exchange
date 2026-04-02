import {
  createFetchClient,
  createUnitagsApiClient,
  getCloudflareApiBaseUrl,
  provideSessionService,
  TrafficFlows,
} from '@l.x/api'
import { getConfig } from '@l.x/config'
import { getIsSessionServiceEnabled } from '@l.x/gating'
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
