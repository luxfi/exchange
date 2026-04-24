import { useMemo } from 'react'
import { useLuxContextSelector } from '@l.x/lx/src/contexts/LuxContext'
import { useEnabledChains } from '@l.x/lx/src/features/chains/hooks/useEnabledChains'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { isL2ChainId } from '@l.x/lx/src/features/chains/utils'
import { Platform } from '@l.x/lx/src/features/platforms/types/Platform'
import { getEVMTradeRepository } from '@l.x/lx/src/features/repositories'
import { useWithQuoteLogging } from '@l.x/lx/src/features/transactions/swap/hooks/useTrade/logging'
import { createEVMTradeService } from '@l.x/lx/src/features/transactions/swap/services/tradeService/evmTradeService'
import { createSolanaTradeService } from '@l.x/lx/src/features/transactions/swap/services/tradeService/svmTradeService'
import {
  createTradeService,
  TradeService,
} from '@l.x/lx/src/features/transactions/swap/services/tradeService/tradeService'
import { getMinAutoSlippageToleranceL2 } from '@l.x/lx/src/features/transactions/swap/utils/tradingApi'
import { getLogger } from '@l.x/utils/src/logger/logger'

/**
 * Services
 *
 * This is where we create instances of services that are used in hooks/components.
 * Services orchestrate business logic and use repositories for data access.
 *
 * List of services:
 * - Trade Service
 */

interface TradeServiceContext {
  // dependencies from React layer
  getIsLXSupported?: (chainId?: number) => boolean
  getEnabledChains: () => UniverseChainId[]
}

/**
 * Trade Service
 *
 * Creates a trade service instance with the necessary dependencies.
 * Only requires minimal context from the React layer.
 *
 * @param ctx - Context containing React-layer dependencies
 * @returns A trade service that orchestrates the swap flow
 */
export function getTradeService(ctx: TradeServiceContext): TradeService {
  const { getIsLXSupported, getEnabledChains } = ctx

  const evmTradeService = createEVMTradeService({
    tradeRepository: getEVMTradeRepository(),
    getIsLXSupported,
    getEnabledChains,
    getIsL2ChainId: (chainId?: UniverseChainId) => (chainId ? isL2ChainId(chainId) : false),
    getMinAutoSlippageToleranceL2,
    logger: getLogger(),
  })

  const svmTradeService =
    createSolanaTradeService(
      // { tradeRepository: getSolanaTradeRepository() } // TODO(SWAP-383): build Solana Trade Repository
    )

  return createTradeService({
    serviceByPlatform: {
      [Platform.EVM]: evmTradeService,
      [Platform.SVM]: svmTradeService,
    },
  })
}

export function useTradeService(): TradeService {
  const withQuoteLogging = useWithQuoteLogging()
  const getIsLXSupported = useLuxContextSelector((state) => state.getIsLXSupported)
  const enabledChains = useEnabledChains()

  return useMemo(() => {
    const baseService = getTradeService({
      getIsLXSupported: getIsLXSupported ?? ((): boolean => false),
      getEnabledChains: () => enabledChains.chains,
    })

    return withQuoteLogging(baseService)
  }, [getIsLXSupported, enabledChains, withQuoteLogging])
}
