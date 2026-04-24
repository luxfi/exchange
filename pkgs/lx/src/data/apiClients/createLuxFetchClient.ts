import { createFetchClient, type FetchClient, provideSessionService } from '@l.x/api'
import { getIsSessionServiceEnabled } from '@l.x/gating'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { getVersionHeader } from '@l.x/lx/src/data/getVersionHeader'
import { isMobileApp, isWebApp } from '@l.x/utils/src/platform'
import { REQUEST_SOURCE } from '@l.x/utils/src/platform/requestSource'

export const BASE_LX_HEADERS = {
  'x-request-source': REQUEST_SOURCE,
  ...(!isWebApp ? { 'x-app-version': getVersionHeader() } : {}),
  ...(isMobileApp ? { Origin: lxUrls.apiOrigin } : {}),
}

export function createLXFetchClient({
  baseUrl,
  includeBaseLxHeaders = true,
  additionalHeaders = {},
}: {
  baseUrl: string
  includeBaseLxHeaders?: boolean
  additionalHeaders?: HeadersInit & {
    'x-uniquote-enabled'?: string
  }
}): FetchClient {
  const headers = includeBaseLxHeaders ? { ...BASE_LX_HEADERS, ...additionalHeaders } : additionalHeaders

  return createFetchClient({
    baseUrl,
    getHeaders: () => headers,
    getSessionService: () =>
      provideSessionService({ getBaseUrl: () => lxUrls.apiBaseUrlV2, getIsSessionServiceEnabled }),
  })
}
