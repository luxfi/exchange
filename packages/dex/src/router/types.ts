/**
 * Router Types
 * Types for hybrid CLOB + AMM routing
 */
import type { Address } from 'viem'

/**
 * Route source - where liquidity comes from
 */
export type RouteSource = 'clob' | 'amm' | 'hybrid'

/**
 * Quote request
 */
export interface QuoteRequest {
  tokenIn: Address
  tokenOut: Address
  amountIn: bigint
  slippageTolerance?: number // basis points (default 50 = 0.5%)
  preferredSource?: RouteSource
}

/**
 * Route step
 */
export interface RouteStep {
  source: RouteSource
  tokenIn: Address
  tokenOut: Address
  amountIn: bigint
  amountOut: bigint
  pool?: Address // For AMM
  symbol?: string // For CLOB
  fee: bigint
  priceImpact: number // basis points
}

/**
 * Quote response
 */
export interface Quote {
  tokenIn: Address
  tokenOut: Address
  amountIn: bigint
  amountOut: bigint
  minimumAmountOut: bigint
  route: RouteStep[]
  priceImpact: number // total price impact in basis points
  estimatedGas: bigint
  validUntil: number // timestamp
}

/**
 * Swap request
 */
export interface SwapRequest {
  quote: Quote
  recipient: Address
  deadline?: number
}

/**
 * Swap result
 */
export interface SwapResult {
  txHash: `0x${string}`
  amountIn: bigint
  amountOut: bigint
  route: RouteStep[]
}

/**
 * Router configuration
 */
export interface RouterConfig {
  // CLOB connection
  clobUrl?: string
  clobEnabled?: boolean

  // AMM configuration
  ammEnabled?: boolean
  maxHops?: number // max number of AMM hops

  // Routing preferences
  preferCLOB?: boolean // prefer CLOB for limit orders
  hybridEnabled?: boolean // allow splitting between CLOB and AMM
}
