/**
 * Omnichain Router
 * Routes orders between CLOB and AMM for best execution
 */
import type { Address, PublicClient } from 'viem'
import { DEX_PRECOMPILES } from '../precompile/addresses'
import { POOL_MANAGER_ABI, SWAP_ROUTER_ABI } from '../precompile/abis'
import { createPoolKey, type PoolKey } from '../precompile/types'
import type { ICLOBClient } from '../client/types'
import type {
  RouterConfig,
  QuoteRequest,
  Quote,
  RouteStep,
  SwapRequest,
  SwapResult,
} from './types'

const DEFAULT_CONFIG: RouterConfig = {
  clobEnabled: true,
  ammEnabled: true,
  maxHops: 3,
  preferCLOB: false,
  hybridEnabled: true,
}

/**
 * Omnichain Router
 * Best execution routing between CLOB and AMM
 */
export class OmnichainRouter {
  private config: RouterConfig
  private publicClient: PublicClient | null = null
  private clobClient: ICLOBClient | null = null

  constructor(config: Partial<RouterConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Set the public client for AMM interactions
   */
  setPublicClient(client: PublicClient) {
    this.publicClient = client
  }

  /**
   * Set the CLOB client
   */
  setCLOBClient(client: ICLOBClient) {
    this.clobClient = client
  }

  /**
   * Get a quote for a swap
   */
  async getQuote(request: QuoteRequest): Promise<Quote> {
    const {
      tokenIn,
      tokenOut,
      amountIn,
      slippageTolerance = 50, // 0.5%
      preferredSource,
    } = request

    const quotes: Quote[] = []

    // Get AMM quote if enabled
    if (this.config.ammEnabled && (!preferredSource || preferredSource !== 'clob')) {
      try {
        const ammQuote = await this.getAMMQuote(tokenIn, tokenOut, amountIn)
        if (ammQuote) quotes.push(ammQuote)
      } catch (error) {
        console.warn('AMM quote failed:', error)
      }
    }

    // Get CLOB quote if enabled
    if (this.config.clobEnabled && this.clobClient && (!preferredSource || preferredSource !== 'amm')) {
      try {
        const clobQuote = await this.getCLOBQuote(tokenIn, tokenOut, amountIn)
        if (clobQuote) quotes.push(clobQuote)
      } catch (error) {
        console.warn('CLOB quote failed:', error)
      }
    }

    if (quotes.length === 0) {
      throw new Error('No quotes available')
    }

    // Select best quote (highest output)
    const bestQuote = quotes.reduce((best, quote) =>
      quote.amountOut > best.amountOut ? quote : best
    )

    // Apply slippage tolerance
    const minimumAmountOut = bestQuote.amountOut - (bestQuote.amountOut * BigInt(slippageTolerance)) / 10000n

    return {
      ...bestQuote,
      minimumAmountOut,
      validUntil: Date.now() + 30000, // 30 seconds
    }
  }

  /**
   * Get AMM quote using precompiles
   */
  private async getAMMQuote(
    tokenIn: Address,
    tokenOut: Address,
    amountIn: bigint
  ): Promise<Quote | null> {
    if (!this.publicClient) return null

    try {
      // Create pool key
      const poolKey = createPoolKey(tokenIn, tokenOut)
      const zeroForOne = tokenIn.toLowerCase() < tokenOut.toLowerCase()

      // Get pool state
      const slot0 = await this.publicClient.readContract({
        address: DEX_PRECOMPILES.POOL_MANAGER,
        abi: POOL_MANAGER_ABI,
        functionName: 'getSlot0',
        args: [poolKey],
      }) as [bigint, number, number, number]

      if (slot0[0] === 0n) {
        return null // Pool doesn't exist
      }

      // Calculate expected output (simplified - real implementation would use tick math)
      // For now, use a simple estimate based on sqrt price
      const sqrtPriceX96 = slot0[0]
      const price = (sqrtPriceX96 * sqrtPriceX96) / (2n ** 192n)
      const amountOut = zeroForOne
        ? (amountIn * price) / (10n ** 18n)
        : (amountIn * (10n ** 18n)) / price

      // Estimate price impact (simplified)
      const priceImpact = Number((amountIn * 10n) / (amountIn + amountOut))

      const step: RouteStep = {
        source: 'amm',
        tokenIn,
        tokenOut,
        amountIn,
        amountOut,
        pool: DEX_PRECOMPILES.POOL_MANAGER,
        fee: (amountIn * BigInt(poolKey.fee)) / 1_000_000n,
        priceImpact,
      }

      return {
        tokenIn,
        tokenOut,
        amountIn,
        amountOut,
        minimumAmountOut: amountOut,
        route: [step],
        priceImpact,
        estimatedGas: 150_000n,
        validUntil: Date.now() + 30000,
      }
    } catch (error) {
      console.error('AMM quote error:', error)
      return null
    }
  }

  /**
   * Get CLOB quote
   */
  private async getCLOBQuote(
    tokenIn: Address,
    tokenOut: Address,
    amountIn: bigint
  ): Promise<Quote | null> {
    if (!this.clobClient || !this.clobClient.isConnected()) return null

    try {
      // Convert addresses to symbol (e.g., "LUX-USDT")
      const symbol = this.getSymbol(tokenIn, tokenOut)
      if (!symbol) return null

      const orderBook = await this.clobClient.getOrderBook(symbol, 50)

      // Calculate output by walking the order book
      let remainingIn = amountIn
      let totalOut = 0n
      const side = tokenIn.toLowerCase() < tokenOut.toLowerCase() ? 'asks' : 'bids'
      const levels = side === 'asks' ? orderBook.asks : orderBook.bids

      for (const level of levels) {
        if (remainingIn <= 0n) break

        const levelSize = BigInt(Math.floor(level.size * 1e18))
        const levelPrice = BigInt(Math.floor(level.price * 1e18))

        const fillSize = remainingIn < levelSize ? remainingIn : levelSize
        const fillOut = side === 'asks'
          ? (fillSize * (10n ** 18n)) / levelPrice
          : (fillSize * levelPrice) / (10n ** 18n)

        totalOut += fillOut
        remainingIn -= fillSize
      }

      if (totalOut === 0n) return null

      // Calculate price impact
      const avgPrice = (amountIn * (10n ** 18n)) / totalOut
      const bestPrice = BigInt(Math.floor(levels[0]?.price * 1e18 || 0))
      const priceImpact = bestPrice > 0n
        ? Number(((avgPrice - bestPrice) * 10000n) / bestPrice)
        : 0

      const step: RouteStep = {
        source: 'clob',
        tokenIn,
        tokenOut,
        amountIn,
        amountOut: totalOut,
        symbol,
        fee: (amountIn * 30n) / 10000n, // 0.3% maker fee estimate
        priceImpact,
      }

      return {
        tokenIn,
        tokenOut,
        amountIn,
        amountOut: totalOut,
        minimumAmountOut: totalOut,
        route: [step],
        priceImpact,
        estimatedGas: 50_000n, // CLOB is off-chain
        validUntil: Date.now() + 10000, // 10 seconds (faster expiry for CLOB)
      }
    } catch (error) {
      console.error('CLOB quote error:', error)
      return null
    }
  }

  /**
   * Convert token addresses to trading symbol
   */
  private getSymbol(tokenIn: Address, tokenOut: Address): string | null {
    // TODO: Implement proper token-to-symbol mapping
    // This should look up the token registry
    const tokenMap: Record<string, string> = {
      '0x0000000000000000000000000000000000000000': 'LUX',
      // Add more tokens as needed
    }

    const symbolIn = tokenMap[tokenIn.toLowerCase()]
    const symbolOut = tokenMap[tokenOut.toLowerCase()]

    if (!symbolIn || !symbolOut) return null

    return `${symbolIn}-${symbolOut}`
  }

  /**
   * Execute a swap
   */
  async executeSwap(request: SwapRequest): Promise<SwapResult> {
    const { quote, recipient, deadline = Math.floor(Date.now() / 1000) + 1200 } = request

    if (Date.now() > quote.validUntil) {
      throw new Error('Quote expired')
    }

    // Determine execution path
    const source = quote.route[0]?.source

    if (source === 'amm') {
      return this.executeAMMSwap(quote, recipient, deadline)
    } else if (source === 'clob') {
      return this.executeCLOBSwap(quote, recipient)
    } else {
      throw new Error(`Unknown route source: ${source}`)
    }
  }

  /**
   * Execute AMM swap via precompile
   */
  private async executeAMMSwap(
    quote: Quote,
    recipient: Address,
    deadline: number
  ): Promise<SwapResult> {
    // This would be called by the wallet/wagmi on the frontend
    // Just return the transaction parameters
    throw new Error('AMM swap execution should be handled by wagmi writeContract')
  }

  /**
   * Execute CLOB swap
   */
  private async executeCLOBSwap(quote: Quote, recipient: Address): Promise<SwapResult> {
    if (!this.clobClient) {
      throw new Error('CLOB client not configured')
    }

    const step = quote.route[0]
    if (!step?.symbol) {
      throw new Error('Invalid CLOB route')
    }

    // Place market order on CLOB
    const order = await this.clobClient.placeOrder({
      symbol: step.symbol,
      side: step.tokenIn.toLowerCase() < step.tokenOut.toLowerCase() ? 'buy' : 'sell',
      type: 'market',
      size: Number(quote.amountIn) / 1e18,
    })

    return {
      txHash: `0x${order.orderId}` as `0x${string}`,
      amountIn: quote.amountIn,
      amountOut: quote.amountOut,
      route: quote.route,
    }
  }
}

/**
 * Create an omnichain router instance
 */
export function createRouter(config?: Partial<RouterConfig>): OmnichainRouter {
  return new OmnichainRouter(config)
}
