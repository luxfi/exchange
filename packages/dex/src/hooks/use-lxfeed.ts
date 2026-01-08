/**
 * LXFeed Hooks (LP-9040)
 * React hooks for price feeds, mark price, and funding rates
 */
import { useReadContract } from 'wagmi'
import type { Address } from 'viem'
import { LX } from '../precompile/addresses'
import { LX_FEED_ABI, LX_ORACLE_ABI } from '../precompile/abis'
import type { LXMarkPrice, LXFundingRate } from '../precompile/types'

/**
 * Hook to get mark price for a market
 */
export function useLXFeedMarkPrice(marketId: number) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: LX.LX_FEED,
    abi: LX_FEED_ABI,
    functionName: 'getMarkPrice',
    args: [marketId],
  })

  return {
    markPrice: data as LXMarkPrice | undefined,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to get index price for a market
 */
export function useLXFeedIndexPrice(marketId: number) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: LX.LX_FEED,
    abi: LX_FEED_ABI,
    functionName: 'getIndexPrice',
    args: [marketId],
  })

  const result = data as [bigint, bigint] | undefined

  return {
    priceX18: result?.[0],
    timestamp: result?.[1],
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to get funding rate for a market
 */
export function useLXFeedFundingRate(marketId: number) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: LX.LX_FEED,
    abi: LX_FEED_ABI,
    functionName: 'getFundingRate',
    args: [marketId],
  })

  const result = data as [bigint, bigint] | undefined

  return {
    rateX18: result?.[0],
    nextFundingTime: result?.[1],
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to get trigger price for stop/take orders
 */
export function useLXFeedTriggerPrice(marketId: number, isBuy: boolean) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: LX.LX_FEED,
    abi: LX_FEED_ABI,
    functionName: 'getTriggerPrice',
    args: [marketId, isBuy],
  })

  return {
    triggerPriceX18: data as bigint | undefined,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to get oracle price for token pair
 */
export function useLXOraclePrice(baseToken: Address, quoteToken: Address) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: LX.LX_ORACLE,
    abi: LX_ORACLE_ABI,
    functionName: 'getPrice',
    args: [baseToken, quoteToken],
  })

  return {
    price: data,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to get aggregated oracle price with deviation info
 */
export function useLXOracleAggregatedPrice(
  baseToken: Address,
  quoteToken: Address,
  maxStaleness: bigint = 3600n // 1 hour default
) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: LX.LX_ORACLE,
    abi: LX_ORACLE_ABI,
    functionName: 'getAggregatedPrice',
    args: [baseToken, quoteToken, maxStaleness],
  })

  return {
    aggregated: data,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Hook to check if oracle price is fresh
 */
export function useLXOraclePriceFresh(
  baseToken: Address,
  quoteToken: Address,
  maxStaleness: bigint = 3600n
) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: LX.LX_ORACLE,
    abi: LX_ORACLE_ABI,
    functionName: 'isPriceFresh',
    args: [baseToken, quoteToken, maxStaleness],
  })

  return {
    isFresh: data as boolean | undefined,
    isLoading,
    error,
    refetch,
  }
}

/**
 * Combined hook for market price data
 */
export function useLXMarketPrices(marketId: number) {
  const mark = useLXFeedMarkPrice(marketId)
  const index = useLXFeedIndexPrice(marketId)
  const funding = useLXFeedFundingRate(marketId)

  return {
    markPrice: mark.markPrice,
    indexPrice: index.priceX18,
    fundingRate: funding.rateX18,
    nextFundingTime: funding.nextFundingTime,
    isLoading: mark.isLoading || index.isLoading || funding.isLoading,
    error: mark.error || index.error || funding.error,
    refetch: () => {
      mark.refetch()
      index.refetch()
      funding.refetch()
    },
  }
}
