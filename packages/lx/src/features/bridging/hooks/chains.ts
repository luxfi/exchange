import { TradingApi } from '@luxfi/api'
import { useMemo } from 'react'
import { useTradingApiSwappableTokensQuery } from 'lx/src/data/apiClients/tradingApi/useTradingApiSwappableTokensQuery'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { toSupportedChainId } from 'lx/src/features/chains/utils'
import {
  NATIVE_ADDRESS_FOR_TRADING_API,
  toTradingApiSupportedChainId,
} from 'lx/src/features/transactions/swap/utils/tradingApi'

const FALLBACK_NUM_CHAINS = 8

export function useNumBridgingChains(): number {
  const { data: bridgingTokens } = useTradingApiSwappableTokensQuery({
    params: {
      tokenIn: NATIVE_ADDRESS_FOR_TRADING_API,
      tokenInChainId: TradingApi.ChainId._1,
    },
  })

  const chainSet = useMemo(() => new Set(bridgingTokens?.tokens?.map((t) => t.chainId) ?? []), [bridgingTokens])
  const numChains = chainSet.size + 1

  return numChains > 4 ? numChains : FALLBACK_NUM_CHAINS
}

export function useIsBridgingChain(chainId: UniverseChainId): boolean {
  const { data: bridgingTokens } = useTradingApiSwappableTokensQuery({
    params: {
      tokenIn: NATIVE_ADDRESS_FOR_TRADING_API,
      tokenInChainId: TradingApi.ChainId._1,
    },
  })

  const chainSet = useMemo(() => new Set(bridgingTokens?.tokens?.map((t) => t.chainId) ?? []), [bridgingTokens])

  const chainIdForTradingApi = toTradingApiSupportedChainId(chainId)
  return chainIdForTradingApi !== undefined && chainSet.has(chainIdForTradingApi)
}

export function useBridgingSupportedChainIds(): UniverseChainId[] {
  const { data: bridgingTokens } = useTradingApiSwappableTokensQuery({
    params: {
      tokenIn: NATIVE_ADDRESS_FOR_TRADING_API,
      tokenInChainId: TradingApi.ChainId._1,
    },
  })

  const chainSet = useMemo(
    () =>
      new Set(
        bridgingTokens?.tokens
          ?.map((t) => toSupportedChainId(t.chainId))
          .filter((chainId): chainId is UniverseChainId => chainId !== null) ?? [],
      ),
    [bridgingTokens],
  )
  return Array.from(chainSet)
}
