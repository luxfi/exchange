/**
 * Lux DEX Gateway - Advanced Trading Client
 *
 * HTTP client for the DEX gateway's CLOB, perpetual, margin,
 * and vault endpoints. Connects to the same gateway as LuxGatewayClient
 * but exposes the advanced trading surface.
 */
import { luxUrls } from 'lx/src/constants/urls'
import { logger } from 'utilities/src/logger/logger'

import type {
  CancelAllOrdersRequest,
  CancelOrderRequest,
  CollateralAsset,
  DepositVaultRequest,
  DexApiResponse,
  FundingPayment,
  FundingRate,
  MarginAccount,
  Market,
  MarketStats,
  Order,
  OrderBook,
  PaginatedResponse,
  PerpPosition,
  PlaceOrderRequest,
  RecentTrade,
  SetLeverageRequest,
  SetMarginModeRequest,
  Vault,
  VaultPosition,
  WithdrawVaultRequest,
} from './types'

const LOG_TAG = 'LuxDexClient'

function getBaseUrl(): string {
  return luxUrls.luxGatewayUrl
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const url = `${getBaseUrl()}${path}`

  logger.debug(LOG_TAG, method, `${method} ${path}`, { url })

  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  if (!response.ok) {
    const errorText = await response.text()
    logger.error(new Error(`DEX API error: ${response.status}`), {
      tags: { file: LOG_TAG, function: method },
      extra: { status: response.status, error: errorText, path },
    })
    throw new Error(`DEX API ${path}: ${response.status} - ${errorText}`)
  }

  const json: DexApiResponse<T> = await response.json()
  if (!json.success) {
    throw new Error(`DEX API error: ${json.error ?? 'Unknown error'}`)
  }
  return json.data
}

// ─── Markets ─────────────────────────────────────────────────────────

export async function getMarkets(chainId: number): Promise<Market[]> {
  return request<Market[]>('GET', `/api/markets?chainId=${chainId}`)
}

export async function getMarketStats(symbol: string): Promise<MarketStats> {
  return request<MarketStats>('GET', `/api/stats?symbol=${encodeURIComponent(symbol)}`)
}

// ─── Order Book ──────────────────────────────────────────────────────

export async function getOrderBook(symbol: string, depth = 50): Promise<OrderBook> {
  return request<OrderBook>('GET', `/api/orderbook?symbol=${encodeURIComponent(symbol)}&depth=${depth}`)
}

export async function getRecentTrades(symbol: string, limit = 100): Promise<RecentTrade[]> {
  return request<RecentTrade[]>('GET', `/api/trades?symbol=${encodeURIComponent(symbol)}&limit=${limit}`)
}

// ─── Orders ──────────────────────────────────────────────────────────

export async function placeOrder(req: PlaceOrderRequest): Promise<Order> {
  return request<Order>('POST', '/api/order', req)
}

export async function cancelOrder(req: CancelOrderRequest): Promise<{ cancelled: boolean }> {
  return request<{ cancelled: boolean }>('DELETE', `/api/order/${req.orderId}`, req)
}

export async function cancelAllOrders(req?: CancelAllOrdersRequest): Promise<{ cancelledCount: number }> {
  return request<{ cancelledCount: number }>('DELETE', '/api/orders', req)
}

export async function getOpenOrders(symbol?: string): Promise<Order[]> {
  const qs = symbol ? `?symbol=${encodeURIComponent(symbol)}` : ''
  return request<Order[]>('GET', `/api/orders${qs}`)
}

export async function getOrderHistory(params?: {
  symbol?: string
  limit?: number
  offset?: number
}): Promise<PaginatedResponse<Order>> {
  const qs = new URLSearchParams()
  if (params?.symbol) {
    qs.set('symbol', params.symbol)
  }
  if (params?.limit) {
    qs.set('limit', String(params.limit))
  }
  if (params?.offset) {
    qs.set('offset', String(params.offset))
  }
  const query = qs.toString()
  return request<PaginatedResponse<Order>>('GET', `/api/orders/history${query ? `?${query}` : ''}`)
}

// ─── Perpetual Positions ─────────────────────────────────────────────

export async function getPositions(symbol?: string): Promise<PerpPosition[]> {
  const qs = symbol ? `?symbol=${encodeURIComponent(symbol)}` : ''
  return request<PerpPosition[]>('GET', `/api/positions${qs}`)
}

export async function closePosition(symbol: string): Promise<Order> {
  return request<Order>('POST', '/api/positions/close', { symbol })
}

export async function setLeverage(req: SetLeverageRequest): Promise<{ leverage: number }> {
  return request<{ leverage: number }>('POST', '/api/leverage', req)
}

export async function setMarginMode(req: SetMarginModeRequest): Promise<{ mode: string }> {
  return request<{ mode: string }>('POST', '/api/margin-mode', req)
}

// ─── Margin Account ──────────────────────────────────────────────────

export async function getMarginAccount(): Promise<MarginAccount> {
  return request<MarginAccount>('GET', '/api/account/margin')
}

export async function getCollateral(): Promise<CollateralAsset[]> {
  return request<CollateralAsset[]>('GET', '/api/account/collateral')
}

// ─── Funding ─────────────────────────────────────────────────────────

export async function getFundingRate(symbol: string): Promise<FundingRate> {
  return request<FundingRate>('GET', `/api/funding/rate?symbol=${encodeURIComponent(symbol)}`)
}

export async function getFundingHistory(symbol: string, limit = 100): Promise<FundingPayment[]> {
  return request<FundingPayment[]>(
    'GET',
    `/api/funding/history?symbol=${encodeURIComponent(symbol)}&limit=${limit}`,
  )
}

// ─── Vaults ──────────────────────────────────────────────────────────

export async function getVaults(): Promise<Vault[]> {
  return request<Vault[]>('GET', '/api/vaults')
}

export async function getVault(vaultId: string): Promise<Vault> {
  return request<Vault>('GET', `/api/vaults/${vaultId}`)
}

export async function getVaultPositions(): Promise<VaultPosition[]> {
  return request<VaultPosition[]>('GET', '/api/vaults/positions')
}

export async function depositVault(req: DepositVaultRequest): Promise<VaultPosition> {
  return request<VaultPosition>('POST', `/api/vaults/${req.vaultId}/deposit`, req)
}

export async function withdrawVault(req: WithdrawVaultRequest): Promise<VaultPosition> {
  return request<VaultPosition>('POST', `/api/vaults/${req.vaultId}/withdraw`, req)
}

// ─── WebSocket ───────────────────────────────────────────────────────

export function createDexWebSocket(): WebSocket {
  const wsUrl = getBaseUrl().replace(/^http/, 'ws') + '/ws'
  return new WebSocket(wsUrl)
}
