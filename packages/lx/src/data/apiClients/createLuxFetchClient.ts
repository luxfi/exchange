import { createFetchClient, type FetchClient, provideSessionService } from '@universe/api'
import { getIsSessionServiceEnabled } from '@universe/gating'
import { luxUrls } from 'lx/src/constants/urls'
import { getVersionHeader } from 'lx/src/data/getVersionHeader'
import { isMobileApp, isWebApp } from 'utilities/src/platform'
import { REQUEST_SOURCE } from 'utilities/src/platform/requestSource'

export const BASE_LUX_HEADERS = {
  'x-request-source': REQUEST_SOURCE,
  ...(!isWebApp ? { 'x-app-version': getVersionHeader() } : {}),
  ...(isMobileApp ? { Origin: luxUrls.apiOrigin } : {}),
}

export function createLuxFetchClient({
  baseUrl,
  includeBaseLuxHeaders = true,
  additionalHeaders = {},
}: {
  baseUrl: string
  includeBaseLuxHeaders?: boolean
  additionalHeaders?: HeadersInit & {
    'x-uniquote-enabled'?: string
  }
}): FetchClient {
  const headers = includeBaseLuxHeaders ? { ...BASE_LUX_HEADERS, ...additionalHeaders } : additionalHeaders

  return createFetchClient({
    baseUrl,
    getHeaders: () => headers,
    getSessionService: () =>
      provideSessionService({ getBaseUrl: () => luxUrls.apiBaseUrlV2, getIsSessionServiceEnabled }),
  })
}
