import { brand, getGatewayUrl, getWsUrl } from '@l.x/config'
import { isBetaEnv, isDevEnv, isPlaywrightEnv, isTestEnv } from 'utilities/src/environment/env'
import { isAndroid, isExtensionApp, isMobileApp, isWebApp } from 'utilities/src/platform'

export enum TrafficFlows {
  GraphQL = 'graphql',
  Metrics = 'metrics',
  Gating = 'gating',
  TradingApi = 'trading-api-labs',
  Unitags = 'unitags',
  FOR = 'for',
  Scantastic = 'scantastic',
  DataApi = 'data-api',
}

export const helpUrl = brand.helpUrl

const FLOWS_USING_BETA = [TrafficFlows.FOR]

const isDevOrBeta = isPlaywrightEnv() ? false : isDevEnv() || isBetaEnv()

export function getCloudflarePrefix(flow?: TrafficFlows): string {
  if (flow && isDevOrBeta && FLOWS_USING_BETA.includes(flow)) {
    return `beta`
  }

  if (isMobileApp) {
    return `${isAndroid ? 'android' : 'ios'}.wallet`
  }

  if (isExtensionApp) {
    return 'extension'
  }

  if (isPlaywrightEnv() || isWebApp) {
    return 'interface'
  }

  if (isTestEnv()) {
    return 'wallet'
  }

  throw new Error('Could not determine app to generate Cloudflare prefix')
}

export function getServicePrefix(flow?: TrafficFlows): string {
  if (flow && (isPlaywrightEnv() || !(isDevOrBeta && FLOWS_USING_BETA.includes(flow)))) {
    return flow + '.'
  } else {
    return ''
  }
}

export function getCloudflareApiBaseUrl(params?: { flow?: TrafficFlows; postfix?: string }): string {
  const { flow, postfix } = params ?? {}
  let baseUrl
  const gatewayHost = process.env.REACT_APP_GATEWAY_HOST || brand.gatewayDomain
  if (flow === TrafficFlows.TradingApi && !isPlaywrightEnv()) {
    // This is an exception that only applies to dev + TAPI where the order of the prefix matters
    baseUrl = `https://${isDevEnv() ? 'beta.' : ''}trading-api-labs.${getCloudflarePrefix(flow)}.${gatewayHost}`
  }
  // Only changing this for DataApi to use the new prefixing logic that points both prod and beta to prod
  else if (flow === TrafficFlows.DataApi) {
    baseUrl = `https://${isDevEnv() && !isPlaywrightEnv() ? 'beta' : getCloudflarePrefix(flow)}.${gatewayHost}`
  } else {
    baseUrl = `https://${getServicePrefix(flow)}${getCloudflarePrefix(flow)}.${gatewayHost}`
  }
  if (postfix) {
    baseUrl += `/${postfix}`
  }
  return baseUrl
}

export function createHelpArticleUrl(resourceId: string, path: string = 'articles'): string {
  const product = isMobileApp ? 'mobileApp' : isExtensionApp ? 'extension' : 'web'
  return `${helpUrl}/${path}/${resourceId}?product_link=${product}`
}

// Entry Gateway API URLs — configurable via brand config + env overrides
export const DEV_ENTRY_GATEWAY_API_BASE_URL: string =
  process.env.REACT_APP_DEV_ENTRY_GATEWAY_URL || getGatewayUrl('/conversion')
export const STAGING_ENTRY_GATEWAY_API_BASE_URL: string =
  process.env.REACT_APP_STAGING_ENTRY_GATEWAY_URL || getGatewayUrl('/conversion')
export const PROD_ENTRY_GATEWAY_API_BASE_URL: string =
  process.env.REACT_APP_PROD_ENTRY_GATEWAY_URL || getGatewayUrl('/conversion')

// WebSocket URLs — configurable via brand config + env overrides
export const DEV_WEBSOCKET_BASE_URL: string =
  process.env.REACT_APP_DEV_WEBSOCKET_URL || getWsUrl('/staging')
export const STAGING_WEBSOCKET_BASE_URL: string =
  process.env.REACT_APP_STAGING_WEBSOCKET_URL || getWsUrl('/staging')
export const PROD_WEBSOCKET_BASE_URL: string =
  process.env.REACT_APP_PROD_WEBSOCKET_URL || getWsUrl('')
