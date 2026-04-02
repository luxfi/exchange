import { createFetchClient, type FetchClient, provideSessionService } from '@l.x/api'
import { getIsSessionServiceEnabled } from '@l.x/gating'
import { lxUrls } from 'lx/src/constants/urls'
import { getVersionHeader } from 'lx/src/data/getVersionHeader'
import { isMobileApp, isWebApp } from 'utilities/src/platform'
import { REQUEST_SOURCE } from 'utilities/src/platform/requestSource'

export const BASE_LX_HEADERS = {
  'x-request-source': REQUEST_SOURCE,
  ...(!isWebApp ? { 'x-app-version': getVersionHeader() } : {}),
  ...(isMobileApp ? { Origin: lxUrls.apiOrigin } : {}),
}

export function createLxFetchClient({
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
