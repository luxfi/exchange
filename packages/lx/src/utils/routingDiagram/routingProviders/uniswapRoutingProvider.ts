import { Protocol } from '@luxdex/router-sdk'
import { Percent, TradeType } from '@luxamm/sdk-core'
import { Pair } from '@luxamm/v2-sdk'
import { Pool as V3Pool } from '@luxamm/v3-sdk'
import { Pool as V4Pool } from '@luxamm/v4-sdk'
import { DYNAMIC_FEE_AMOUNT, V2_DEFAULT_FEE_TIER } from 'lx/src/constants/pools'
import { Trade } from 'lx/src/features/transactions/swap/types/trade'
import { isChained, isClassic } from 'lx/src/features/transactions/swap/utils/routing'
import { currencyId } from 'lx/src/utils/currencyId'
import type { RoutingDiagramEntry, RoutingHop, RoutingProvider } from 'lx/src/utils/routingDiagram/types'

type UniswapPool = Pair | V3Pool | V4Pool

function getPoolType(pool: UniswapPool): 'V2' | 'V3' | 'V4' {
  if (pool instanceof Pair) {
    return 'V2'
  }
  if (pool instanceof V3Pool) {
    return 'V3'
  }
  if (pool instanceof V4Pool) {
    return 'V4'
  }

  // This should never happen with proper typing, but provides a fallback
  throw new Error(`Unknown pool type: ${(pool as unknown)?.toString()}`)
}

/**
 * Generates a human-readable protocol label for a swap route.
 *
 * @example
 * // For a single protocol route
 * getProtocolLabel({ protocol: Protocol.V3, pools: [...] }) // Returns: "V3"
 *
 * @example
 * // For a mixed protocol route with V2, V3, and V4 pools
 * getProtocolLabel({
 *   protocol: Protocol.MIXED,
 *   pools: [v2Pool, v4Pool, v3Pool]
 * }) // Returns: "V2 + V3 + V4"
 */
function getProtocolLabel(route: { protocol: Protocol; pools: UniswapPool[] }): string {
  if (route.protocol === Protocol.MIXED) {
    const poolTypes = route.pools.map((pool) => getPoolType(pool))
    return [...new Set(poolTypes)].sort().join(' + ')
  }
  return route.protocol.toUpperCase()
}

export const uniswapRoutingProvider: RoutingProvider = {
  name: 'Uniswap API',
  icon: undefined,
  iconColor: '$neutral1',

  getRoutingEntries: (trade: Trade): RoutingDiagramEntry[] => {
    if (!isClassic(trade)) {
      throw new Error(`Invalid call to uniswapProvider.getRoutingEntries with non-classic trade: ${trade.routing}`)
    }

    return trade.swaps.map(({ route, inputAmount, outputAmount }) => {
      const portion =
        trade.tradeType === TradeType.EXACT_INPUT
          ? inputAmount.divide(trade.inputAmount)
          : outputAmount.divide(trade.outputAmount)
      const percent = new Percent(portion.numerator, portion.denominator)

      const path: RoutingHop[] = route.pools.map((pool, i) => {
        const inputCurrency = route.path[i]
        const outputCurrency = route.path[i + 1]
        if (!inputCurrency || !outputCurrency) {
          throw new Error('Invalid route path')
        }
        let fee: number
        let isDynamic = false

        if (pool instanceof Pair) {
          fee = V2_DEFAULT_FEE_TIER
        } else if (pool instanceof V3Pool) {
          fee = pool.fee
        } else if (pool instanceof V4Pool) {
          fee = pool.fee
          isDynamic = fee === DYNAMIC_FEE_AMOUNT
        } else {
          throw new Error(`Unknown pool type: ${(pool as unknown)?.toString()}`)
        }

        return {
          type: 'uniswapPool',
          inputCurrencyId: currencyId(inputCurrency),
          outputCurrencyId: currencyId(outputCurrency),
          poolType: getPoolType(pool),
          fee,
          isDynamic,
        }
      })

      // Type assertion needed because @luxdex/router-sdk uses @uniswap/* SDKs internally
      // while local code uses @luxamm/* SDKs which have incompatible private property declarations
      const protocolLabel = getProtocolLabel(route as unknown as { protocol: Protocol; pools: UniswapPool[] })

      return {
        percent,
        path,
        protocolLabel,
      }
    })
  },

  getDescription: (t) => t('swap.routing.uniswapAutoRouter.description'),
}

export const uniswapChainedRoutingProvider: RoutingProvider = {
  name: 'Uniswap API',
  icon: undefined,
  iconColor: '$neutral1',

  getRoutingEntries: (trade: Trade): RoutingDiagramEntry[] => {
    if (!isChained(trade)) {
      throw new Error(`Invalid call to uniswapProvider.getRoutingEntries with non-chained trade: ${trade.routing}`)
    }

    // TODO: SWAP-770 - Implement chained routing diagram
    return []
  },

  getDescription: (t) => t('swap.routing.uniswapAutoRouter.description'),
}
