/**
 * LXGatewayClient — Routes Lux ecosystem chain requests to the Lux DEX Gateway
 * instead of the upstream TradingAPI (which only handles Ethereum chains).
 *
 * When fetchQuote or fetchIndicativeQuote is called:
 * 1. If tokenInChainId is a Lux ecosystem chain (96369, 200200, 36963, 36911, 494949, etc.)
 * 2. Request is routed to Lux Gateway (/v1/quote)
 * 3. Response is transformed to match DiscriminatedQuoteResponse format
 * 4. Falls back to TradingAPI on gateway failure
 */
import type { TradingApiClient } from '@l.x/api/src/clients/trading/createTradingApiClient'
import type { ClassicQuoteResponse, DiscriminatedQuoteResponse } from '@l.x/api/src/clients/trading/tradeTypes'
import type { QuoteRequest } from '@l.x/api/src/clients/trading/__generated__/models/QuoteRequest'
import { Routing } from '@l.x/api/src/clients/trading/__generated__/models/Routing'
import { brand } from '@l.x/config'
import { isDevEnv } from 'utilities/src/environment/env'

// ---------------------------------------------------------------------------
// Chain detection
// ---------------------------------------------------------------------------

/** All Lux ecosystem EVM chain IDs (mainnet + testnet + local dev). */
const LUX_ECOSYSTEM_CHAIN_IDS = new Set([
  96369,  // Lux C-Chain mainnet
  96368,  // Lux C-Chain testnet
  200200, // Zoo mainnet
  200201, // Zoo testnet
  36963,  // Hanzo mainnet
  36911,  // SPC mainnet
  494949, // Pars mainnet
  1337,   // Local dev (lux dev start)
])

/** Returns true if the given chainId belongs to the Lux ecosystem. */
export function isLuxEcosystemChain(chainId: number): boolean {
  return LUX_ECOSYSTEM_CHAIN_IDS.has(chainId)
}

// ---------------------------------------------------------------------------
// Gateway URL
// ---------------------------------------------------------------------------

const DEV_GATEWAY_URL = 'http://localhost:8085'
const PROD_GATEWAY_DOMAIN = 'dex.lux.network'

/**
 * Returns the full base URL of the Lux DEX Gateway.
 * Priority: brand.gatewayDomain (from runtime config.json) > environment default.
 */
export function getLXGatewayUrl(): string {
  if (brand.gatewayDomain) {
    return `https://${brand.gatewayDomain}`
  }
  if (isDevEnv()) {
    return DEV_GATEWAY_URL
  }
  return `https://${PROD_GATEWAY_DOMAIN}`
}

// ---------------------------------------------------------------------------
// Gateway quote fetcher
// ---------------------------------------------------------------------------

interface LXGatewayQuoteRequest {
  tokenIn: string
  tokenOut: string
  amount: string
  isExactIn: boolean
  chainId: number
}

interface LXGatewayQuoteResponse {
  amountIn: string
  amountOut: string
  route: string
  gasEstimate: string
  priceImpact: number
}

/**
 * Fetch a quote from the Lux DEX Gateway (/v1/quote).
 * Throws on non-OK HTTP status.
 */
export async function fetchLXGatewayQuote(request: LXGatewayQuoteRequest): Promise<LXGatewayQuoteResponse> {
  const url = `${getLXGatewayUrl()}/v1/quote`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!res.ok) {
    throw new Error(`LX Gateway quote failed: ${res.status} ${res.statusText}`)
  }
  return res.json() as Promise<LXGatewayQuoteResponse>
}

// ---------------------------------------------------------------------------
// Transform gateway response -> DiscriminatedQuoteResponse
// ---------------------------------------------------------------------------

function transformToClassicQuoteResponse(
  gatewayQuote: LXGatewayQuoteResponse,
  params: QuoteRequest & { isUSDQuote?: boolean },
): ClassicQuoteResponse {
  return {
    requestId: `lx-gateway-${Date.now()}`,
    routing: Routing.CLASSIC,
    permitData: null,
    quote: {
      input: {
        token: params.tokenIn,
        amount: gatewayQuote.amountIn,
      },
      output: {
        token: params.tokenOut,
        amount: gatewayQuote.amountOut,
      },
      chainId: params.tokenInChainId,
      tradeType: params.type,
      route: [
        [
          {
            type: 'v2-pool',
            address: gatewayQuote.route || '0x0000000000000000000000000000000000000000',
            tokenIn: {
              address: params.tokenIn,
              chainId: params.tokenInChainId,
              symbol: '',
              decimals: '18',
            },
            tokenOut: {
              address: params.tokenOut,
              chainId: params.tokenOutChainId,
              symbol: '',
              decimals: '18',
            },
            amountIn: gatewayQuote.amountIn,
            amountOut: gatewayQuote.amountOut,
          },
        ],
      ],
      routeString: `LX Gateway: ${params.tokenIn} -> ${params.tokenOut}`,
      gasUseEstimate: gatewayQuote.gasEstimate || '150000',
      priceImpact: gatewayQuote.priceImpact ?? 0,
      quoteId: `lx-${Date.now()}`,
    },
  }
}

// ---------------------------------------------------------------------------
// Trading client wrapper
// ---------------------------------------------------------------------------

/** Subset of QuoteRequest used for indicative (fast) quotes. */
type IndicativeQuoteRequest = Pick<
  QuoteRequest,
  'type' | 'amount' | 'tokenInChainId' | 'tokenOutChainId' | 'tokenIn' | 'tokenOut' | 'swapper'
>

/**
 * Wraps a TradingApiClient so that fetchQuote and fetchIndicativeQuote are
 * routed through the Lux DEX Gateway for Lux ecosystem chains.
 * All other methods and non-Lux chains pass through unchanged.
 * On gateway failure, logs a warning and falls back to the original client.
 */
export function createLXGatewayAwareTradingClient(client: TradingApiClient): TradingApiClient {
  const originalFetchQuote = client.fetchQuote.bind(client)
  const originalFetchIndicativeQuote = client.fetchIndicativeQuote.bind(client)

  async function fetchQuoteViaGateway(
    params: QuoteRequest & { isUSDQuote?: boolean },
  ): Promise<DiscriminatedQuoteResponse> {
    if (!isLuxEcosystemChain(params.tokenInChainId)) {
      return originalFetchQuote(params)
    }
    try {
      const isExactIn = params.type === 'EXACT_INPUT'
      const gatewayQuote = await fetchLXGatewayQuote({
        tokenIn: params.tokenIn,
        tokenOut: params.tokenOut,
        amount: params.amount,
        isExactIn,
        chainId: params.tokenInChainId,
      })
      return transformToClassicQuoteResponse(gatewayQuote, params)
    } catch (err) {
      console.warn('[LXGatewayClient] Gateway quote failed, falling back to TradingAPI:', err)
      return originalFetchQuote(params)
    }
  }

  async function fetchIndicativeQuoteViaGateway(
    params: IndicativeQuoteRequest,
  ): Promise<DiscriminatedQuoteResponse> {
    if (!isLuxEcosystemChain(params.tokenInChainId)) {
      return originalFetchIndicativeQuote(params)
    }
    try {
      const isExactIn = params.type === 'EXACT_INPUT'
      const gatewayQuote = await fetchLXGatewayQuote({
        tokenIn: params.tokenIn,
        tokenOut: params.tokenOut,
        amount: params.amount,
        isExactIn,
        chainId: params.tokenInChainId,
      })
      return transformToClassicQuoteResponse(gatewayQuote, {
        ...params,
        swapper: params.swapper,
        amount: params.amount,
      })
    } catch (err) {
      console.warn('[LXGatewayClient] Gateway indicative quote failed, falling back to TradingAPI:', err)
      return originalFetchIndicativeQuote(params)
    }
  }

  return {
    ...client,
    fetchQuote: fetchQuoteViaGateway,
    fetchIndicativeQuote: fetchIndicativeQuoteViaGateway,
  }
}
