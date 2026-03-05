/**
 * Lux DEX Gateway - React Query Hooks
 *
 * Hooks for consuming CLOB, perpetual, margin, and vault data
 * from the Lux DEX gateway.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import * as dexClient from './client'
import type {
  CancelAllOrdersRequest,
  CancelOrderRequest,
  DepositVaultRequest,
  Market,
  MarketStats,
  Order,
  OrderBook,
  OrderBookUpdate,
  PerpPosition,
  PlaceOrderRequest,
  PriceLevel,
  SetLeverageRequest,
  SetMarginModeRequest,
  WithdrawVaultRequest,
  WsMessage,
  WsSubscription,
} from './types'

// ─── Query Keys ──────────────────────────────────────────────────────

const dexKeys = {
  all: ['dex'] as const,
  markets: (chainId: number) => [...dexKeys.all, 'markets', chainId] as const,
  marketStats: (symbol: string) => [...dexKeys.all, 'stats', symbol] as const,
  orderBook: (symbol: string) => [...dexKeys.all, 'orderbook', symbol] as const,
  recentTrades: (symbol: string) => [...dexKeys.all, 'trades', symbol] as const,
  openOrders: (symbol?: string) => [...dexKeys.all, 'orders', symbol ?? 'all'] as const,
  orderHistory: (symbol?: string) => [...dexKeys.all, 'orderHistory', symbol ?? 'all'] as const,
  positions: (symbol?: string) => [...dexKeys.all, 'positions', symbol ?? 'all'] as const,
  marginAccount: () => [...dexKeys.all, 'marginAccount'] as const,
  collateral: () => [...dexKeys.all, 'collateral'] as const,
  fundingRate: (symbol: string) => [...dexKeys.all, 'funding', symbol] as const,
  fundingHistory: (symbol: string) => [...dexKeys.all, 'fundingHistory', symbol] as const,
  vaults: () => [...dexKeys.all, 'vaults'] as const,
  vault: (id: string) => [...dexKeys.all, 'vault', id] as const,
  vaultPositions: () => [...dexKeys.all, 'vaultPositions'] as const,
}

// ─── Markets ─────────────────────────────────────────────────────────

export function useMarkets(chainId: number, enabled = true) {
  return useQuery<Market[]>({
    queryKey: dexKeys.markets(chainId),
    queryFn: () => dexClient.getMarkets(chainId),
    enabled,
    staleTime: 60_000,
  })
}

export function useMarketStats(symbol: string, enabled = true) {
  return useQuery<MarketStats>({
    queryKey: dexKeys.marketStats(symbol),
    queryFn: () => dexClient.getMarketStats(symbol),
    enabled: enabled && !!symbol,
    refetchInterval: 5_000,
  })
}

// ─── Order Book ──────────────────────────────────────────────────────

export function useOrderBook(symbol: string, depth = 50, enabled = true) {
  return useQuery<OrderBook>({
    queryKey: dexKeys.orderBook(symbol),
    queryFn: () => dexClient.getOrderBook(symbol, depth),
    enabled: enabled && !!symbol,
    refetchInterval: 1_000,
  })
}

export function useRecentTrades(symbol: string, limit = 100, enabled = true) {
  return useQuery({
    queryKey: dexKeys.recentTrades(symbol),
    queryFn: () => dexClient.getRecentTrades(symbol, limit),
    enabled: enabled && !!symbol,
    refetchInterval: 2_000,
  })
}

// ─── Orders ──────────────────────────────────────────────────────────

export function useOpenOrders(symbol?: string, enabled = true) {
  return useQuery<Order[]>({
    queryKey: dexKeys.openOrders(symbol),
    queryFn: () => dexClient.getOpenOrders(symbol),
    enabled,
    refetchInterval: 3_000,
  })
}

export function useOrderHistory(symbol?: string, enabled = true) {
  return useQuery({
    queryKey: dexKeys.orderHistory(symbol),
    queryFn: () => dexClient.getOrderHistory({ symbol }),
    enabled,
  })
}

export function usePlaceOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (req: PlaceOrderRequest) => dexClient.placeOrder(req),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: dexKeys.openOrders(variables.symbol) })
      queryClient.invalidateQueries({ queryKey: dexKeys.positions(variables.symbol) })
      queryClient.invalidateQueries({ queryKey: dexKeys.marginAccount() })
    },
  })
}

export function useCancelOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (req: CancelOrderRequest) => dexClient.cancelOrder(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dexKeys.openOrders() })
    },
  })
}

export function useCancelAllOrders() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (req?: CancelAllOrdersRequest) => dexClient.cancelAllOrders(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dexKeys.openOrders() })
    },
  })
}

// ─── Perpetual Positions ─────────────────────────────────────────────

export function usePositions(symbol?: string, enabled = true) {
  return useQuery<PerpPosition[]>({
    queryKey: dexKeys.positions(symbol),
    queryFn: () => dexClient.getPositions(symbol),
    enabled,
    refetchInterval: 5_000,
  })
}

export function useClosePosition() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (symbol: string) => dexClient.closePosition(symbol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dexKeys.positions() })
      queryClient.invalidateQueries({ queryKey: dexKeys.marginAccount() })
    },
  })
}

export function useSetLeverage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (req: SetLeverageRequest) => dexClient.setLeverage(req),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: dexKeys.positions(variables.symbol) })
      queryClient.invalidateQueries({ queryKey: dexKeys.marginAccount() })
    },
  })
}

export function useSetMarginMode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (req: SetMarginModeRequest) => dexClient.setMarginMode(req),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: dexKeys.marginAccount() })
    },
  })
}

// ─── Margin Account ──────────────────────────────────────────────────

export function useMarginAccount(enabled = true) {
  return useQuery({
    queryKey: dexKeys.marginAccount(),
    queryFn: () => dexClient.getMarginAccount(),
    enabled,
    refetchInterval: 5_000,
  })
}

export function useCollateral(enabled = true) {
  return useQuery({
    queryKey: dexKeys.collateral(),
    queryFn: () => dexClient.getCollateral(),
    enabled,
  })
}

// ─── Funding ─────────────────────────────────────────────────────────

export function useFundingRate(symbol: string, enabled = true) {
  return useQuery({
    queryKey: dexKeys.fundingRate(symbol),
    queryFn: () => dexClient.getFundingRate(symbol),
    enabled: enabled && !!symbol,
    refetchInterval: 30_000,
  })
}

export function useFundingHistory(symbol: string, enabled = true) {
  return useQuery({
    queryKey: dexKeys.fundingHistory(symbol),
    queryFn: () => dexClient.getFundingHistory(symbol),
    enabled: enabled && !!symbol,
  })
}

// ─── Vaults ──────────────────────────────────────────────────────────

export function useVaults(enabled = true) {
  return useQuery({
    queryKey: dexKeys.vaults(),
    queryFn: () => dexClient.getVaults(),
    enabled,
    staleTime: 30_000,
  })
}

export function useVault(vaultId: string, enabled = true) {
  return useQuery({
    queryKey: dexKeys.vault(vaultId),
    queryFn: () => dexClient.getVault(vaultId),
    enabled: enabled && !!vaultId,
  })
}

export function useVaultPositions(enabled = true) {
  return useQuery({
    queryKey: dexKeys.vaultPositions(),
    queryFn: () => dexClient.getVaultPositions(),
    enabled,
  })
}

export function useDepositVault() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (req: DepositVaultRequest) => dexClient.depositVault(req),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: dexKeys.vault(variables.vaultId) })
      queryClient.invalidateQueries({ queryKey: dexKeys.vaultPositions() })
    },
  })
}

export function useWithdrawVault() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (req: WithdrawVaultRequest) => dexClient.withdrawVault(req),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: dexKeys.vault(variables.vaultId) })
      queryClient.invalidateQueries({ queryKey: dexKeys.vaultPositions() })
    },
  })
}

// ─── WebSocket Hook ──────────────────────────────────────────────────

export function useDexWebSocket(subscriptions: WsSubscription[]) {
  const wsRef = useRef<WebSocket | null>(null)
  const [connected, setConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState<WsMessage | null>(null)

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    const ws = dexClient.createDexWebSocket()

    ws.onopen = () => {
      setConnected(true)
      // Subscribe to channels
      for (const sub of subscriptions) {
        ws.send(JSON.stringify({ action: 'subscribe', ...sub }))
      }
    }

    ws.onmessage = (event) => {
      try {
        const msg: WsMessage = JSON.parse(event.data)
        setLastMessage(msg)
      } catch {
        // Ignore non-JSON messages (ping/pong)
      }
    }

    ws.onclose = () => {
      setConnected(false)
      // Reconnect after 3s
      setTimeout(connect, 3000)
    }

    ws.onerror = () => {
      ws.close()
    }

    wsRef.current = ws
  }, [subscriptions])

  useEffect(() => {
    connect()
    return () => {
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [connect])

  const send = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data))
    }
  }, [])

  return { connected, lastMessage, send }
}

/**
 * Hook for streaming order book via WebSocket with automatic fallback to polling.
 */
export function useStreamingOrderBook(symbol: string) {
  const queryClient = useQueryClient()
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null)

  // Use WebSocket for live updates
  const { connected, lastMessage } = useDexWebSocket(
    symbol ? [{ channel: 'orderbook', symbol }] : [],
  )

  useEffect(() => {
    if (!lastMessage || lastMessage.channel !== 'orderbook' || lastMessage.symbol !== symbol) {
      return
    }

    const update = lastMessage.data as OrderBookUpdate
    if (update.type === 'snapshot') {
      setOrderBook({
        symbol: update.symbol,
        bids: update.bids,
        asks: update.asks,
        timestamp: update.timestamp,
        sequence: update.sequence,
      })
    } else {
      // Incremental update - merge into existing state
      setOrderBook((prev) => {
        if (!prev) {
          return null
        }
        return {
          ...prev,
          bids: mergeLevels(prev.bids, update.bids),
          asks: mergeLevels(prev.asks, update.asks),
          timestamp: update.timestamp,
          sequence: update.sequence,
        }
      })
    }
  }, [lastMessage, symbol])

  // Polling fallback when WebSocket is disconnected
  const pollingQuery = useOrderBook(symbol, 50, !connected && !!symbol)

  // Invalidate cache when we get WS data
  useEffect(() => {
    if (connected && orderBook) {
      queryClient.setQueryData(dexKeys.orderBook(symbol), orderBook)
    }
  }, [connected, orderBook, symbol, queryClient])

  return {
    orderBook: connected ? orderBook : pollingQuery.data ?? null,
    isStreaming: connected,
    isLoading: !connected && pollingQuery.isLoading,
  }
}

/** Merge incremental price level updates into existing levels */
function mergeLevels(existing: PriceLevel[], updates: PriceLevel[]): PriceLevel[] {
  const map = new Map(existing.map((l) => [l.price, l]))
  for (const update of updates) {
    if (update.size === '0') {
      map.delete(update.price)
    } else {
      map.set(update.price, update)
    }
  }
  return Array.from(map.values())
}
