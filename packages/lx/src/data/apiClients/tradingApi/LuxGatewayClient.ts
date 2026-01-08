/**
 * Lux Gateway Client
 *
 * Routes quote requests for Lux (96369) and Zoo (200200) chains to the
 * Lux Gateway, which provides native DEX precompile access with Uniswap
 * as fallback for other operations.
 */
import type { DiscriminatedQuoteResponse, TradingApiClient } from '@luxfi/api'
import type { QuoteRequest, Routing, TradeType } from '@luxfi/api/src/clients/trading/__generated__'
import { uniswapUrls } from 'lx/src/constants/urls'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { logger } from 'utilities/src/logger/logger'

// Lux ecosystem chain IDs
const LUX_CHAIN_IDS = new Set<number>([
  UniverseChainId.Lux, // 96369
  UniverseChainId.Zoo, // 200200
  UniverseChainId.LuxDev, // 1337 - local dev mode
])

/**
 * Check if a chain ID belongs to the Lux ecosystem
 */
export function isLuxChain(chainId: number | undefined): boolean {
  return chainId !== undefined && LUX_CHAIN_IDS.has(chainId)
}

/**
 * Gateway quote request format - matches the Go server's quoteRequest struct
 */
interface GatewayQuoteRequest {
  tokenIn: string
  tokenOut: string
  amount: string
  isExactIn: boolean
  chainId: number
  slippage?: number
  recipient?: string
}

/**
 * Gateway API response wrapper
 */
interface GatewayApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

/**
 * Gateway quote response format - matches the Go server's SwapQuote struct
 */
interface GatewayQuoteResponse {
  tokenIn: {
    token: {
      address: string
      chainId: number
      decimals: number
      symbol: string
      name: string
    }
    amount: string | number
  }
  tokenOut: {
    token: {
      address: string
      chainId: number
      decimals: number
      symbol: string
      name: string
    }
    amount: string | number
  }
  route: Array<{
    poolAddress: string
    poolType: string
    tokenIn: {
      address: string
      chainId: number
      decimals: number
      symbol: string
      name: string
    }
    tokenOut: {
      address: string
      chainId: number
      decimals: number
      symbol: string
      name: string
    }
    fee: number
  }>
  priceImpact: number
  gasEstimate: string
  quoteId: string
  expiresAt: string
  providerName: string
}

/**
 * Transform gateway response to TradingAPI DiscriminatedQuoteResponse format
 */
function transformGatewayResponse(
  gatewayResponse: GatewayQuoteResponse,
  request: QuoteRequest,
): DiscriminatedQuoteResponse {
  // Convert amounts to strings (gateway may return numbers)
  const amountIn = String(gatewayResponse.tokenIn.amount)
  const amountOut = String(gatewayResponse.tokenOut.amount)

  // Build a ClassicQuote-like response that the UI expects
  // Use unknown cast to bypass strict type checking since we're building a response
  // that matches the expected shape but may not have all optional fields
  return {
    requestId: gatewayResponse.quoteId,
    routing: 'CLASSIC' as Routing.CLASSIC,
    permitData: null, // No permit required for native Lux DEX swaps
    quote: {
      chainId: request.tokenInChainId,
      swapper: request.swapper,
      input: {
        token: gatewayResponse.tokenIn.token.address,
        amount: amountIn,
      },
      output: {
        token: gatewayResponse.tokenOut.token.address,
        amount: amountOut,
        recipient: request.swapper,
      },
      tradeType: request.type,
      slippage: {
        tolerance: request.slippageTolerance ?? 50, // 0.5% default
      },
      route: gatewayResponse.route.map((hop) => [
        [
          {
            type: 'v4-pool' as const,
            address: hop.poolAddress,
            tokenIn: {
              address: hop.tokenIn.address,
              chainId: hop.tokenIn.chainId,
              decimals: hop.tokenIn.decimals,
              symbol: hop.tokenIn.symbol,
            },
            tokenOut: {
              address: hop.tokenOut.address,
              chainId: hop.tokenOut.chainId,
              decimals: hop.tokenOut.decimals,
              symbol: hop.tokenOut.symbol,
            },
            fee: String(hop.fee),
            liquidity: '0',
            sqrtRatioX96: '0',
            tickCurrent: '0',
            hooks: '0x0000000000000000000000000000000000000000',
            tickSpacing: 60,
          },
        ],
      ]),
      gasFee: gatewayResponse.gasEstimate,
      gasFeeUSD: '0', // TODO: Calculate from gas estimate
      gasFeeQuote: gatewayResponse.gasEstimate,
      priceImpact: gatewayResponse.priceImpact,
      txFailureReasons: [],
      quoteId: gatewayResponse.quoteId,
    },
  } as unknown as DiscriminatedQuoteResponse
}

/**
 * Fetch quote from Lux Gateway
 */
async function fetchLuxGatewayQuote(
  request: QuoteRequest & { isUSDQuote?: boolean },
): Promise<DiscriminatedQuoteResponse> {
  const gatewayUrl = uniswapUrls.luxGatewayQuoteUrl

  // Transform to gateway format
  const gatewayRequest: GatewayQuoteRequest = {
    tokenIn: request.tokenIn,
    tokenOut: request.tokenOut,
    amount: request.amount,
    isExactIn: request.type === ('EXACT_INPUT' as TradeType),
    chainId: request.tokenInChainId,
    slippage: request.slippageTolerance,
    recipient: request.swapper,
  }

  logger.debug('LuxGatewayClient', 'fetchQuote', 'Fetching from Lux Gateway', {
    url: gatewayUrl,
    chainId: request.tokenInChainId,
    tokenIn: request.tokenIn,
    tokenOut: request.tokenOut,
  })

  const response = await fetch(gatewayUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(gatewayRequest),
  })

  if (!response.ok) {
    const errorText = await response.text()
    logger.error(new Error(`Lux Gateway error: ${response.status}`), {
      tags: { file: 'LuxGatewayClient', function: 'fetchQuote' },
      extra: { status: response.status, error: errorText, request: gatewayRequest },
    })
    throw new Error(`Lux Gateway request failed: ${response.status} - ${errorText}`)
  }

  const apiResponse: GatewayApiResponse<GatewayQuoteResponse> = await response.json()

  if (!apiResponse.success || !apiResponse.data) {
    throw new Error(`Lux Gateway error: ${apiResponse.error ?? 'Unknown error'}`)
  }

  const gatewayResponse = apiResponse.data

  logger.debug('LuxGatewayClient', 'fetchQuote', 'Got response from Lux Gateway', {
    quoteId: gatewayResponse.quoteId,
    provider: gatewayResponse.providerName,
    amountOut: gatewayResponse.tokenOut.amount,
  })

  return transformGatewayResponse(gatewayResponse, request)
}

/**
 * Create a Lux-aware wrapper around the TradingApiClient.
 * Routes Lux/Zoo chain requests to the Lux Gateway, while delegating
 * all other requests to the original TradingApiClient.
 */
export function createLuxGatewayAwareTradingClient(
  tradingApiClient: TradingApiClient,
): TradingApiClient {
  return {
    ...tradingApiClient,

    fetchQuote: async (params: QuoteRequest & { isUSDQuote?: boolean }) => {
      // Route Lux/Zoo chain requests to the gateway
      if (isLuxChain(params.tokenInChainId)) {
        try {
          return await fetchLuxGatewayQuote(params)
        } catch (error) {
          logger.warn('LuxGatewayClient', 'fetchQuote', 'Gateway request failed, falling back to TradingAPI', {
            error: error instanceof Error ? error.message : String(error),
            chainId: params.tokenInChainId,
          })
          // Fall through to TradingAPI as backup
        }
      }

      // Use standard TradingAPI for non-Lux chains or on gateway failure
      return tradingApiClient.fetchQuote(params)
    },

    fetchIndicativeQuote: async (params) => {
      // Route Lux/Zoo chain requests to the gateway
      if (isLuxChain(params.tokenInChainId)) {
        try {
          // Create a full QuoteRequest from the indicative request params
          const fullRequest: QuoteRequest = {
            ...params,
            slippageTolerance: 100, // 1% for indicative quotes
          }
          return await fetchLuxGatewayQuote(fullRequest)
        } catch (error) {
          logger.warn('LuxGatewayClient', 'fetchIndicativeQuote', 'Gateway request failed, falling back', {
            error: error instanceof Error ? error.message : String(error),
          })
        }
      }

      return tradingApiClient.fetchIndicativeQuote(params)
    },
  }
}
