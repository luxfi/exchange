import { TradingApi } from '@l.x/api'
import { useMemo } from 'react'
import { useTradingApiSwappableTokensQuery } from '@l.x/lx/src/data/apiClients/tradingApi/useTradingApiSwappableTokensQuery'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { toSupportedChainId } from '@l.x/lx/src/features/chains/utils'
import {
  NATIVE_ADDRESS_FOR_TRADING_API,
  toTradingApiSupportedChainId,
} from '@l.x/lx/src/features/transactions/swap/utils/tradingApi'

const FALLBACK_NUM_CHAINS = 8

export function useNumBridgingChains(): number {
  const { data: bridgingTokens } = useTradingApiSwappableTokensQuery({
    params: {
      tokenIn: NATIVE_ADDRESS_FOR_TRADING_API,
      tokenInChainId: TradingApi.ChainId._1,
    },
  })

  const chainSet = useMemo(() => new Set(bridgingTokens?.tokens.map((t) => t.chainId)), [bridgingTokens])
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

  const chainSet = useMemo(() => new Set(bridgingTokens?.tokens.map((t) => t.chainId)), [bridgingTokens])

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
          .map((t) => toSupportedChainId(t.chainId))
          .filter((chainId): chainId is UniverseChainId => chainId !== null),
      ),
    [bridgingTokens],
  )
  return Array.from(chainSet)
}
