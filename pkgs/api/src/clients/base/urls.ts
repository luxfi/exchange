import { brand, getGatewayUrl, getWsUrl } from '@l.x/config'
import { isExtensionApp, isMobileApp } from '@l.x/utils/src/platform'

export enum TrafficFlows {
  GraphQL = 'graphql',
  TradingApi = 'trading-api-labs',
  Unitags = 'unitags',
  FOR = 'for',
  Scantastic = 'scantastic',
  DataApi = 'data-api',
}

export const helpUrl = brand.helpUrl

/**
 * `https://${gatewayHost}/v1/<flow>[/<postfix>]` — single host, path-routed.
 * KrakenD routes by path. No subdomain prefixes per service or per platform.
 */
export function getCloudflareApiBaseUrl(params?: { flow?: TrafficFlows; postfix?: string }): string {
  const { flow, postfix } = params ?? {}
  const gatewayHost = process.env.REACT_APP_GATEWAY_HOST || brand.gatewayDomain
  const segments = ['v1']
  if (flow) segments.push(flow)
  if (postfix) segments.push(postfix.replace(/^\/+/, ''))
  return `https://${gatewayHost}/${segments.join('/')}`
}

export function createHelpArticleUrl(resourceId: string, path: string = 'articles'): string {
  const product = isMobileApp ? 'mobileApp' : isExtensionApp ? 'extension' : 'web'
  return `${helpUrl}/${path}/${resourceId}?product_link=${product}`
}

export const DEV_ENTRY_GATEWAY_API_BASE_URL: string =
  process.env.REACT_APP_DEV_ENTRY_GATEWAY_URL || getGatewayUrl('/conversion')
export const STAGING_ENTRY_GATEWAY_API_BASE_URL: string =
  process.env.REACT_APP_STAGING_ENTRY_GATEWAY_URL || getGatewayUrl('/conversion')
export const PROD_ENTRY_GATEWAY_API_BASE_URL: string =
  process.env.REACT_APP_PROD_ENTRY_GATEWAY_URL || getGatewayUrl('/conversion')

export const DEV_WEBSOCKET_BASE_URL: string =
  process.env.REACT_APP_DEV_WEBSOCKET_URL || getWsUrl('/staging')
export const STAGING_WEBSOCKET_BASE_URL: string =
  process.env.REACT_APP_STAGING_WEBSOCKET_URL || getWsUrl('/staging')
export const PROD_WEBSOCKET_BASE_URL: string =
  process.env.REACT_APP_PROD_WEBSOCKET_URL || getWsUrl('')
