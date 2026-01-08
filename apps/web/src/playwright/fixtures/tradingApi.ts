// biome-ignore lint/style/noRestrictedImports: Trading API fixtures need direct Playwright imports
import { test as base } from '@playwright/test'
import { isLuxdMode } from 'playwright/anvil/anvil-manager'
import { Mocks } from 'playwright/mocks/mocks'
import { type Page } from 'playwright/test'
import { uniswapUrls } from 'lx/src/constants/urls'

export const DEFAULT_TEST_GAS_LIMIT = '20000000'

// Lux Gateway URL for dev/test environment
const LUX_GATEWAY_DEV_URL = 'http://localhost:8085'

// Native token address used by Trading API (zero address)
const NATIVE_ADDRESS_FOR_TRADING_API = '0x0000000000000000000000000000000000000000'

// Known wrapped native token addresses for various chains
const WRAPPED_NATIVE_TOKENS: Record<number, string> = {
  1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH on Mainnet
  1337: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // WLUX on LuxDev (Deterministic CREATE address from nonce 0)
  43112: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // WLUX on Lux Local Stack (same as LuxDev)
  96369: '0x0401000000000000000000000000000000000001', // WLUX on Lux Mainnet
  96368: '0x0401000000000000000000000000000000000001', // WLUX on Lux Testnet
}

// Check if this is a Lux chain request based on chainId in the request body
const isLuxChainRequest = (postData: any): boolean => {
  const chainId = postData?.quote?.chainId || postData?.chainId || postData?.tokenInChainId
  return chainId === 96369 || chainId === 96368 || chainId === 43112 || chainId === 1337 // Lux mainnet, testnet, local, or dev
}

// Check if this is a wrap operation (native -> wrapped native)
const isWrapOperation = (postData: any): boolean => {
  // Check both quote endpoint format (tokenIn/tokenOut) and swap endpoint format (quote.input.token/quote.output.token)
  const tokenIn = (postData?.tokenIn || postData?.quote?.input?.token)?.toLowerCase()
  const tokenOut = (postData?.tokenOut || postData?.quote?.output?.token)?.toLowerCase()
  const chainId = postData?.tokenInChainId || postData?.quote?.chainId || postData?.chainId

  if (!tokenIn || !tokenOut) return false

  const wrappedAddress = WRAPPED_NATIVE_TOKENS[chainId]?.toLowerCase()
  return tokenIn === NATIVE_ADDRESS_FOR_TRADING_API.toLowerCase() && tokenOut === wrappedAddress
}

// Check if this is an unwrap operation (wrapped native -> native)
const isUnwrapOperation = (postData: any): boolean => {
  // Check both quote endpoint format (tokenIn/tokenOut) and swap endpoint format (quote.input.token/quote.output.token)
  const tokenIn = (postData?.tokenIn || postData?.quote?.input?.token)?.toLowerCase()
  const tokenOut = (postData?.tokenOut || postData?.quote?.output?.token)?.toLowerCase()
  const chainId = postData?.tokenInChainId || postData?.quote?.chainId || postData?.chainId

  if (!tokenIn || !tokenOut) return false

  const wrappedAddress = WRAPPED_NATIVE_TOKENS[chainId]?.toLowerCase()
  return tokenIn === wrappedAddress && tokenOut === NATIVE_ADDRESS_FOR_TRADING_API.toLowerCase()
}

const shouldIgnorePageError = (error: Error): { ignored: boolean } => {
  if (
    error.message.includes('Target page, context or browser has been closed') ||
    error.message.includes('Test ended')
  ) {
    console.log(`🟡 Ignored route error after page close: ${error.message}`)
    return { ignored: true }
  }

  return { ignored: false }
}

// Generate a mock wrap/unwrap quote response
const generateWrapUnwrapQuoteResponse = (postData: any, isWrap: boolean): any => {
  const chainId = postData?.tokenInChainId || postData?.quote?.chainId || postData?.chainId || 1337
  const amount = postData?.amount || postData?.quote?.amount || '1000000000000000000'
  const swapper = postData?.swapper || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  const tokenIn = postData?.tokenIn || NATIVE_ADDRESS_FOR_TRADING_API
  const tokenOut = postData?.tokenOut || WRAPPED_NATIVE_TOKENS[chainId] || '0x5FbDB2315678afecb367f032d93F642f64180aa3'

  return {
    requestId: `lux-${isWrap ? 'wrap' : 'unwrap'}-${Date.now()}`,
    routing: isWrap ? 'WRAP' : 'UNWRAP', // Use WRAP/UNWRAP routing so isWrap() returns true and wrapCallback is used
    quote: {
      chainId,
      input: {
        amount,
        token: tokenIn,
      },
      output: {
        amount, // 1:1 conversion for wrap/unwrap
        token: tokenOut,
        recipient: swapper,
      },
      swapper,
      tradeType: postData?.type || 'EXACT_INPUT',
      quoteId: `lux-${isWrap ? 'wrap' : 'unwrap'}-quote-${Date.now()}`,
      gasFeeUSD: '0.00499',
      gasFeeQuote: '1508616120023',
      gasUseEstimate: '45000', // Wrap/unwrap uses ~45k gas
      txFailureReasons: [],
      gasPrice: '5629546',
      gasFee: '2609240163336',
      gasEstimates: [],
    },
    permitData: null,
  }
}

// Generate a mock approval response for Lux chain
const generateLuxApprovalResponse = (postData: any): any => {
  const chainId = postData?.chainId || postData?.tokenInChainId || 1337
  const token = postData?.token || postData?.tokenAddress || '0x0000000000000000000000000000000000000000'
  const walletAddress = postData?.walletAddress || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

  // Return a response indicating no approval is needed (already approved or native token)
  return {
    requestId: `lux-approval-${Date.now()}`,
    approval: null, // No approval transaction needed - tokens are already approved or it's a native token
    gasFee: '0',
    gasFeeUSD: '0',
  }
}

// Generate a mock swap response for Lux chain
const generateLuxSwapResponse = (postData: any, endpoint?: string): any => {
  // Check if this is a wrap/unwrap operation (for quote endpoint)
  if (endpoint === 'quote') {
    if (isWrapOperation(postData)) {
      return generateWrapUnwrapQuoteResponse(postData, true)
    }
    if (isUnwrapOperation(postData)) {
      return generateWrapUnwrapQuoteResponse(postData, false)
    }
  }

  // For swap endpoint with wrap/unwrap, generate appropriate transaction
  const chainId = postData?.quote?.chainId || postData?.tokenInChainId || 1337
  const wrappedAddress = WRAPPED_NATIVE_TOKENS[chainId] || '0x5FbDB2315678afecb367f032d93F642f64180aa3'

  // Native DEX router on Lux chain (LP-9012 SwapRouter)
  const LUX_DEX_ROUTER = '0x0000000000000000000000000000000000009012'
  const TEST_WALLET = postData?.swapper || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

  // Check if this is wrap/unwrap for swap endpoint
  // The quote data has input.token and output.token structure (from our quote response)
  const quoteData = postData?.quote
  if (quoteData) {
    // Token addresses are in input.token and output.token (from our quote response format)
    const tokenIn = quoteData?.input?.token?.toLowerCase()
    const tokenOut = quoteData?.output?.token?.toLowerCase()
    const isWrap = tokenIn === NATIVE_ADDRESS_FOR_TRADING_API.toLowerCase() && tokenOut === wrappedAddress.toLowerCase()
    const isUnwrap = tokenIn === wrappedAddress.toLowerCase() && tokenOut === NATIVE_ADDRESS_FOR_TRADING_API.toLowerCase()

    if (isWrap || isUnwrap) {
      const amount = quoteData?.input?.amount || quoteData?.amount || '1000000000000000000'
      // For wrap, we call deposit() on WLUX contract
      // For unwrap, we call withdraw() on WLUX contract
      // The WETH/WLUX contract ABI has: deposit() and withdraw(uint256)
      const depositSelector = '0xd0e30db0' // deposit()
      const withdrawSelector = '0x2e1a7d4d' // withdraw(uint256)

      return {
        requestId: `lux-${isWrap ? 'wrap' : 'unwrap'}-swap-${Date.now()}`,
        routing: isWrap ? 'WRAP' : 'UNWRAP', // Use WRAP/UNWRAP routing so isWrap() returns true
        quote: quoteData, // Pass through the quote data as-is
        swap: {
          chainId, // REQUIRED: validateTransactionRequest checks for chainId
          from: quoteData?.swapper || TEST_WALLET,
          to: wrappedAddress, // Send to wrapped token contract
          data: isWrap ? depositSelector : `${withdrawSelector}${BigInt(amount).toString(16).padStart(64, '0')}`,
          value: isWrap ? `0x${BigInt(amount).toString(16)}` : '0x0',
          gasLimit: DEFAULT_TEST_GAS_LIMIT,
        },
        gasFee: '2609240163336',
        permitData: null,
        approval: null,
      }
    }
  }

  // For AMM swaps, we need to generate proper router calldata
  // AMM Router address from DeployFullStack.s.sol (deterministic deployment)
  const AMM_ROUTER = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'

  // Get token addresses from the request
  const tokenIn = postData?.tokenIn || postData?.quote?.input?.token || '0x0000000000000000000000000000000000000000'
  const tokenOut = postData?.tokenOut || postData?.quote?.output?.token || wrappedAddress
  const amountIn = postData?.amount || postData?.quote?.input?.amount || '1000000000000000000'
  const amountOutMin = '1' // Minimum 1 wei (high slippage for tests)
  const deadline = Math.floor(Date.now() / 1000) + 3600 // 1 hour from now

  // Encode swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline)
  // Function selector: 0x38ed1739
  const swapSelector = '0x38ed1739'

  // For native token input, use swapExactETHForTokens (0x7ff36ab5)
  // For native token output, use swapExactTokensForETH (0x18cbafe5)
  const isNativeIn = tokenIn.toLowerCase() === NATIVE_ADDRESS_FOR_TRADING_API.toLowerCase()
  const isNativeOut = tokenOut.toLowerCase() === NATIVE_ADDRESS_FOR_TRADING_API.toLowerCase()

  let calldata: string
  let value: string

  if (isNativeIn) {
    // swapExactETHForTokens(uint amountOutMin, address[] path, address to, uint deadline)
    // Use WLUX as the first hop for native input
    const path = [wrappedAddress, tokenOut]
    calldata = encodeSwapExactETHForTokens(amountOutMin, path, TEST_WALLET, deadline)
    value = `0x${BigInt(amountIn).toString(16)}`
  } else if (isNativeOut) {
    // swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline)
    const path = [tokenIn, wrappedAddress]
    calldata = encodeSwapExactTokensForETH(amountIn, amountOutMin, path, TEST_WALLET, deadline)
    value = '0x0'
  } else {
    // swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline)
    const path = [tokenIn, tokenOut]
    calldata = encodeSwapExactTokensForTokens(amountIn, amountOutMin, path, TEST_WALLET, deadline)
    value = '0x0'
  }

  // Get token metadata from the known LuxDev tokens
  const tokenInMeta = getLuxDevTokenMeta(tokenIn, chainId)
  const tokenOutMeta = getLuxDevTokenMeta(tokenOut, chainId)

  // For V2 pools, native tokens must be represented as WLUX
  // parseV2PairApi calls parseTokenApi which throws for native address (0x0000...0000)
  const WLUX_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  const NATIVE_ADDRESS = '0x0000000000000000000000000000000000000000'

  // Get wrapped version of native tokens for V2 pool reserves
  const reserve0TokenMeta =
    tokenIn.toLowerCase() === NATIVE_ADDRESS.toLowerCase()
      ? getLuxDevTokenMeta(WLUX_ADDRESS, chainId)
      : tokenInMeta
  const reserve1TokenMeta =
    tokenOut.toLowerCase() === NATIVE_ADDRESS.toLowerCase()
      ? getLuxDevTokenMeta(WLUX_ADDRESS, chainId)
      : tokenOutMeta

  // Build proper V2 route structure for computeRoutes()
  // Each route is an array of pools, and for a direct swap we have one pool
  // parseV2PairApi expects reserve0.token and reserve1.token to be full ERC20 token objects (not native)
  const v2Route = [
    {
      type: 'v2-pool' as const,
      address: '0x0000000000000000000000000000000000000001', // Mock pool address
      tokenIn: tokenInMeta, // Keep original (native OK here - used for routing direction)
      tokenOut: tokenOutMeta, // Keep original (native OK here - used for routing direction)
      reserve0: {
        token: reserve0TokenMeta, // Must be ERC20 (WLUX for native)
        quotient: '1000000000000000000000000', // 1M tokens reserve
      },
      reserve1: {
        token: reserve1TokenMeta, // Must be ERC20 (WLUX for native)
        quotient: '1000000000000000000000000', // 1M tokens reserve
      },
      amountIn: amountIn,
      amountOut: amountIn, // 1:1 for mock (same as quote)
    },
  ]

  return {
    requestId: `lux-mock-${Date.now()}`,
    routing: 'CLASSIC', // Use CLASSIC routing for all Lux swaps
    quote: {
      // Include input/output so swap endpoint can extract token addresses
      input: {
        amount: amountIn,
        token: tokenIn,
      },
      output: {
        amount: amountIn, // 1:1 for mock
        token: tokenOut,
        recipient: TEST_WALLET,
      },
      chainId, // Include chainId for swap endpoint
      swapper: TEST_WALLET,
      methodParameters: {
        calldata,
        value,
        to: AMM_ROUTER,
      },
      blockNumber: '1000000',
      amount: amountIn,
      amountDecimals: '1',
      quote: amountIn, // 1:1 for mock
      quoteDecimals: '1',
      quoteGasAdjusted: amountIn,
      quoteGasAdjustedDecimals: '1',
      gasUseEstimateQuote: '0.001',
      gasUseEstimateQuoteDecimals: '0.001',
      gasUseEstimate: '150000',
      gasUseEstimateUSD: '0.50',
      simulationError: false,
      simulationStatus: 'SUCCESS',
      gasPriceWei: '20000000000',
      route: [v2Route], // Proper V2 route structure
      routeString: 'LUX_AMM_V2',
      quoteId: `lux-quote-${Date.now()}`,
      tradeType: postData?.type || postData?.quote?.tradeType || 'EXACT_INPUT',
      slippage: parseFloat(postData?.quote?.slippage) || 0.5, // Must be a number, not string
      portionBips: 0,
      portionRecipient: '0x0000000000000000000000000000000000000000',
      portionAmount: '0',
      gasFee: '3000000000000000', // 0.003 LUX - required for gas fee validation
      txFailureReasons: [], // Empty array means no failures
    },
    swap: {
      chainId, // REQUIRED: validateTransactionRequest checks for chainId
      from: TEST_WALLET,
      to: AMM_ROUTER,
      data: calldata,
      value,
      gasLimit: DEFAULT_TEST_GAS_LIMIT,
    },
    permitData: null, // Must be null, not {} - empty object is truthy and triggers permit signature flow
    approval: null,
  }
}

// Helper to get token metadata for LuxDev tokens
// IMPORTANT: decimals must be a string to match TradingApi.TokenInRoute type
function getLuxDevTokenMeta(address: string, chainId: number): {
  chainId: number
  address: string
  decimals: string  // Must be string per TradingApi.TokenInRoute type
  symbol: string
  name: string
} {
  const addr = address.toLowerCase()
  const tokens: Record<string, { decimals: string; symbol: string; name: string }> = {
    '0x0000000000000000000000000000000000000000': { decimals: '18', symbol: 'LUX', name: 'Lux' },
    '0x5fbdb2315678afecb367f032d93f642f64180aa3': { decimals: '18', symbol: 'WLUX', name: 'Wrapped LUX' },
    '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512': { decimals: '18', symbol: 'LETH', name: 'Bridged ETH' },
    '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0': { decimals: '8', symbol: 'LBTC', name: 'Bridged BTC' },
    '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9': { decimals: '6', symbol: 'LUSD', name: 'Bridged USDC' },
  }
  const meta = tokens[addr] || { decimals: '18', symbol: 'UNKNOWN', name: 'Unknown Token' }
  return {
    chainId,
    address,
    ...meta,
  }
}

// Helper functions to encode AMM router calls
function encodeSwapExactTokensForTokens(
  amountIn: string,
  amountOutMin: string,
  path: string[],
  to: string,
  deadline: number
): string {
  // swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)
  const selector = '38ed1739'
  return '0x' + selector + encodeSwapParams(amountIn, amountOutMin, path, to, deadline)
}

function encodeSwapExactETHForTokens(
  amountOutMin: string,
  path: string[],
  to: string,
  deadline: number
): string {
  // swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline)
  const selector = '7ff36ab5'
  return '0x' + selector + encodeSwapParamsETH(amountOutMin, path, to, deadline)
}

function encodeSwapExactTokensForETH(
  amountIn: string,
  amountOutMin: string,
  path: string[],
  to: string,
  deadline: number
): string {
  // swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline)
  const selector = '18cbafe5'
  return '0x' + selector + encodeSwapParams(amountIn, amountOutMin, path, to, deadline)
}

function encodeSwapParams(
  amountIn: string,
  amountOutMin: string,
  path: string[],
  to: string,
  deadline: number
): string {
  // ABI encode: amountIn, amountOutMin, path offset, to, deadline, path length, path elements
  const amountInHex = BigInt(amountIn).toString(16).padStart(64, '0')
  const amountOutMinHex = BigInt(amountOutMin).toString(16).padStart(64, '0')
  const pathOffset = (160).toString(16).padStart(64, '0') // offset to path array (5 * 32 bytes)
  const toHex = to.slice(2).toLowerCase().padStart(64, '0')
  const deadlineHex = BigInt(deadline).toString(16).padStart(64, '0')
  const pathLength = path.length.toString(16).padStart(64, '0')
  const pathElements = path.map(addr => addr.slice(2).toLowerCase().padStart(64, '0')).join('')
  
  return amountInHex + amountOutMinHex + pathOffset + toHex + deadlineHex + pathLength + pathElements
}

function encodeSwapParamsETH(
  amountOutMin: string,
  path: string[],
  to: string,
  deadline: number
): string {
  // ABI encode: amountOutMin, path offset, to, deadline, path length, path elements
  const amountOutMinHex = BigInt(amountOutMin).toString(16).padStart(64, '0')
  const pathOffset = (128).toString(16).padStart(64, '0') // offset to path array (4 * 32 bytes)
  const toHex = to.slice(2).toLowerCase().padStart(64, '0')
  const deadlineHex = BigInt(deadline).toString(16).padStart(64, '0')
  const pathLength = path.length.toString(16).padStart(64, '0')
  const pathElements = path.map(addr => addr.slice(2).toLowerCase().padStart(64, '0')).join('')
  
  return amountOutMinHex + pathOffset + toHex + deadlineHex + pathLength + pathElements
}

// Generate a mock Lux Gateway quote response
const generateLuxGatewayQuoteResponse = (postData: any): any => {
  const chainId = postData?.chainId || 1337
  const amount = postData?.amount || '1000000000000000000'
  const tokenIn = postData?.tokenIn || NATIVE_ADDRESS_FOR_TRADING_API
  const tokenOut = postData?.tokenOut || WRAPPED_NATIVE_TOKENS[chainId] || '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  const recipient = postData?.recipient || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

  // Check if this is wrap/unwrap
  const wrappedAddress = WRAPPED_NATIVE_TOKENS[chainId]?.toLowerCase()
  const isWrap = tokenIn.toLowerCase() === NATIVE_ADDRESS_FOR_TRADING_API.toLowerCase() &&
                 tokenOut.toLowerCase() === wrappedAddress
  const isUnwrap = tokenIn.toLowerCase() === wrappedAddress &&
                   tokenOut.toLowerCase() === NATIVE_ADDRESS_FOR_TRADING_API.toLowerCase()

  // For wrap/unwrap, return a special response that indicates this is a wrap operation
  // The LuxGatewayClient transforms this to a TradingAPI format, but for wrap/unwrap
  // we want to return the response in the exact format that the UI expects
  if (isWrap || isUnwrap) {
    console.log(`[stubLuxGatewayEndpoint] Detected ${isWrap ? 'wrap' : 'unwrap'} operation`)
    // Return an error response so the client falls back to the TradingAPI stub
    // which has proper wrap/unwrap handling
    return {
      success: false,
      error: 'Wrap/unwrap operations should use TradingAPI stub',
    }
  }

  return {
    success: true,
    data: {
      tokenIn: {
        token: {
          address: tokenIn,
          chainId,
          decimals: '18',
          symbol: tokenIn === NATIVE_ADDRESS_FOR_TRADING_API ? 'LUX' : 'WLUX',
          name: tokenIn === NATIVE_ADDRESS_FOR_TRADING_API ? 'LUX' : 'Wrapped LUX',
        },
        amount,
      },
      tokenOut: {
        token: {
          address: tokenOut,
          chainId,
          decimals: '18',
          symbol: tokenOut === NATIVE_ADDRESS_FOR_TRADING_API ? 'LUX' : 'WLUX',
          name: tokenOut === NATIVE_ADDRESS_FOR_TRADING_API ? 'LUX' : 'Wrapped LUX',
        },
        amount,
      },
      route: [],
      priceImpact: 0,
      gasEstimate: '45000',
      quoteId: `lux-gateway-quote-${Date.now()}`,
      expiresAt: new Date(Date.now() + 30000).toISOString(),
      providerName: 'lux-gateway-mock',
    },
  }
}

/**
 * Stub the Lux Gateway endpoint for tests
 * This is called BEFORE the TradingAPI for Lux chain requests
 */
export async function stubLuxGatewayEndpoint({ page }: { page: Page }) {
  // Stub the /v1/quote endpoint
  await page.route(`${LUX_GATEWAY_DEV_URL}/v1/quote`, async (route) => {
    try {
      const request = route.request()
      const postData = request.postDataJSON()
      console.log(`[stubLuxGatewayEndpoint] Received request:`, JSON.stringify(postData, null, 2))

      const responseJson = generateLuxGatewayQuoteResponse(postData)
      console.log(`[stubLuxGatewayEndpoint] Response:`, JSON.stringify(responseJson, null, 2))

      // Return error for wrap/unwrap to force fallback to TradingAPI stub
      if (!responseJson.success) {
        await route.fulfill({
          status: 400,
          body: JSON.stringify(responseJson),
          contentType: 'application/json',
        })
        return
      }

      await route.fulfill({
        body: JSON.stringify(responseJson),
        contentType: 'application/json',
      })
    } catch (error) {
      const { ignored } = shouldIgnorePageError(error)
      if (ignored) {
        return
      }
      throw error
    }
  })

  // Stub the /v1/swap endpoint
  await page.route(`${LUX_GATEWAY_DEV_URL}/v1/swap`, async (route) => {
    try {
      const request = route.request()
      const postData = request.postDataJSON()
      console.log(`[stubLuxGatewayEndpoint] /v1/swap request:`, JSON.stringify(postData, null, 2))

      // Return error to force fallback to TradingAPI stub
      await route.fulfill({
        status: 400,
        body: JSON.stringify({ success: false, error: 'Use TradingAPI stub for swaps' }),
        contentType: 'application/json',
      })
    } catch (error) {
      const { ignored } = shouldIgnorePageError(error)
      if (ignored) {
        return
      }
      throw error
    }
  })
}

/**
 * Generic helper function to stub trading API endpoints and disable transaction simulation
 */
// eslint-disable-next-line max-params
export async function stubTradingApiEndpoint({
  page,
  endpoint,
  modifyRequestData,
  modifyResponseData,
}: {
  page: Page
  endpoint: string
  modifyRequestData?: (data: any) => any
  modifyResponseData?: (data: any) => any
}) {
  // Use regex to match exact endpoint or endpoint with query params
  // This avoids matching unrelated paths (e.g., /v1/swap matching /v1/swappable_tokens)
  const escapedUrl = (uniswapUrls.tradingApiUrl + endpoint).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const routeRegex = new RegExp(`^${escapedUrl}(\\?.*)?$`)

  await page.route(routeRegex, async (route) => {
    try {
      const request = route.request()
      const postData = request.postDataJSON()

      // For Lux chain requests, luxd mode, or wrap/unwrap operations,
      // return mock response directly because:
      // 1. Trading API doesn't support Lux chain
      // 2. We don't have authentication for the real API in tests
      // 3. Wrap/unwrap operations don't actually use the trading API anyway - they're handled locally
      const isWrap = isWrapOperation(postData)
      const isUnwrap = isUnwrapOperation(postData)
      if (isLuxdMode() || isLuxChainRequest(postData) || isWrap || isUnwrap) {
        // Determine the endpoint type from the URL
        const endpointType = endpoint.includes('approval') ? 'approval' : endpoint.includes('quote') ? 'quote' : endpoint.includes('swap') ? 'swap' : undefined
        const rawPostData = request.postData()
        const method = request.method()
        const url = request.url()
        console.log(`[stubTradingApiEndpoint] method=${method}, url=${url}`)
        console.log(`[stubTradingApiEndpoint] endpoint=${endpoint}, endpointType=${endpointType}`)
        console.log(`[stubTradingApiEndpoint] rawPostData:`, rawPostData)
        console.log(`[stubTradingApiEndpoint] postData parsed:`, JSON.stringify(postData, null, 2))
        console.log(`[stubTradingApiEndpoint] isWrap: ${isWrap}, isUnwrap: ${isUnwrap}`)
        
        // Handle approval endpoint separately
        let responseJson: any
        if (endpointType === 'approval') {
          responseJson = generateLuxApprovalResponse(postData)
        } else {
          responseJson = generateLuxSwapResponse(postData, endpointType)
        }
        console.log(`[stubTradingApiEndpoint] Response:`, JSON.stringify(responseJson, null, 2))

        if (modifyResponseData) {
          responseJson = modifyResponseData(responseJson)
        }

        await route.fulfill({
          body: JSON.stringify(responseJson),
          contentType: 'application/json',
        })
        return
      }

      let modifiedData = {
        ...postData,
        // Disable transaction simulation because we can't actually simulate the transaction or it will fail
        // Because the TAPI uses the actual blockchain to simulate the transaction, whereas playwright is running an anvil fork
        simulateTransaction: false,
      }

      if (modifyRequestData) {
        modifiedData = modifyRequestData(modifiedData)
      }

      // Create a new request with modified data
      let response
      try {
        response = await route.fetch({
          postData: JSON.stringify(modifiedData),
        })
      } catch (fetchError) {
        // If the trading API is not accessible, return a mock response
        console.log(`[stubTradingApiEndpoint] Trading API not accessible, using mock response`)
        const endpointType = endpoint.includes('quote') ? 'quote' : endpoint.includes('swap') ? 'swap' : undefined
        let responseJson = generateLuxSwapResponse(postData, endpointType)
        if (modifyResponseData) {
          responseJson = modifyResponseData(responseJson)
        }
        await route.fulfill({
          body: JSON.stringify(responseJson),
          contentType: 'application/json',
        })
        return
      }

      const responseText = await response.text()
      let responseJson
      try {
        responseJson = JSON.parse(responseText)
      } catch (parseError) {
        // If the trading API returns an error, return a mock response
        console.log(`[stubTradingApiEndpoint] Trading API returned invalid JSON: ${responseText}, using mock response`)
        const endpointType = endpoint.includes('quote') ? 'quote' : endpoint.includes('swap') ? 'swap' : undefined
        responseJson = generateLuxSwapResponse(postData, endpointType)
      }

      // Set a high gas limit to avoid OutOfGas
      if (endpoint === uniswapUrls.tradingApiPaths.swap) {
        responseJson.swap.gasLimit = DEFAULT_TEST_GAS_LIMIT
      }

      if (modifyResponseData) {
        responseJson = modifyResponseData(responseJson)
      }

      await route.fulfill({
        body: JSON.stringify(responseJson),
      })
    } catch (error) {
      const { ignored } = shouldIgnorePageError(error)
      if (ignored) {
        return
      }

      throw error
    }
  })
}

/**
 * Mocks the /v1/swap endpoint with a static mock response
 * Use this instead of stubTradingApiEndpoint when you need to avoid calling the real API
 */
// eslint-disable-next-line import/no-unused-modules
export async function mockTradingApiSwapResponse({ page }: { page: Page }) {
  await page.route(`**/${uniswapUrls.tradingApiPaths.swap}`, async (route) => {
    await route.fulfill({ path: Mocks.TradingApi.swap })
  })
}

type TradingApiFixture = {
  swappableTokens: void
  txPolling: void
  connectRpcFallback: void
}

// Generate a mock tx polling response for Lux chain
const generateLuxTxPollingResponse = (txHashes: string[]): any => {
  return {
    requestId: `lux-poll-${Date.now()}`,
    swaps: txHashes.map((txHash) => ({
      status: 'SUCCESS',
      swapType: 'CLASSIC',
      txHash,
    })),
  }
}

// Generate mock swappable tokens response for E2E tests
const generateSwappableTokensResponse = (chainId: number): any => {
  // Helper to create a token with proper project structure
  const createToken = (
    address: string,
    tokenChainId: number,
    symbol: string,
    name: string,
    decimals: number,
    logoUrl: string | null,
  ) => ({
    address,
    chainId: tokenChainId,
    symbol,
    name,
    decimals,
    project: {
      logo: logoUrl ? { url: logoUrl } : null,
      safetyLevel: 'VERIFIED',
      isSpam: false,
    },
    isSpam: false,
  })

  // Common tokens for Ethereum mainnet (chain 1)
  const mainnetTokens = [
    createToken(
      '0x0000000000000000000000000000000000000000',
      1,
      'ETH',
      'Ether',
      18,
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    ),
    createToken(
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      1,
      'WETH',
      'Wrapped Ether',
      18,
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    ),
    createToken(
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      1,
      'USDC',
      'USD Coin',
      6,
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    ),
    createToken(
      '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      1,
      'USDT',
      'Tether USD',
      6,
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    ),
    createToken(
      '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      1,
      'DAI',
      'Dai Stablecoin',
      18,
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
    ),
  ]

  // LuxDev tokens (chain 1337) - addresses from DEFAULT_DEPLOYED_CONTRACTS in luxd-manager.ts
  const luxDevTokens = [
    createToken('0x0000000000000000000000000000000000000000', 1337, 'LUX', 'Lux', 18, null),
    createToken('0x5FbDB2315678afecb367f032d93F642f64180aa3', 1337, 'WLUX', 'Wrapped LUX', 18, null),
    createToken('0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', 1337, 'LETH', 'Bridged ETH', 18, null),
    createToken('0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', 1337, 'LBTC', 'Bridged BTC', 8, null),
    createToken('0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', 1337, 'LUSD', 'Bridged USDC', 6, null),
  ]

  if (chainId === 1337) {
    return { requestId: `mock-swappable-${Date.now()}`, tokens: luxDevTokens }
  }
  return { requestId: `mock-swappable-${Date.now()}`, tokens: mainnetTokens }
}

export const test = base.extend<TradingApiFixture>({
  // Intercept swappable_tokens requests to return mock token list for E2E tests
  swappableTokens: [
    async ({ page }, use) => {
      try {
        await page.route(
          `${uniswapUrls.tradingApiUrl}${uniswapUrls.tradingApiPaths.swappableTokens}*`,
          async (route) => {
            try {
              const url = new URL(route.request().url())
              const chainIdParam = url.searchParams.get('tokenInChainId') || '1'
              const chainId = parseInt(chainIdParam, 10)
              const mockResponse = generateSwappableTokensResponse(chainId)
              return route.fulfill({
                body: JSON.stringify(mockResponse),
                contentType: 'application/json',
              })
            } catch (error) {
              const { ignored } = shouldIgnorePageError(error)
              if (ignored) {
                return undefined
              }
              throw error
            }
          },
        )
        await use(undefined)
      } catch (e) {
        console.warn('[swappableTokens fixture] Failed to set up route interception:', e)
        await use(undefined)
      }
    },
    { auto: true },
  ],
  // Intercept tx polling requests to trading api and succeed
  // https://trading-api-labs.interface.gateway.uniswap.org/v1/swaps
  // {
  //     "requestId": "1b0bef68-a804-4532-b956-781bf9856229",
  //     "swaps": [
  //         {
  //             "status": "SUCCESS",
  //             "swapType": "CLASSIC",
  //             "txHash": "0x3feefd82ee859f26985bb90467361f49c42dde6f9c3c9199f5bc33849f74ecd0"
  //         }
  //     ]
  // }
  txPolling: [
    async ({ page }, use) => {
      try {
        await page.route(
          `${uniswapUrls.tradingApiUrl}${uniswapUrls.tradingApiPaths.swaps}?txHashes=*`,
          async (route) => {
            try {
              // Always return mock response for tx polling in tests
              // The real Trading API requires authentication and may not be accessible
              const url = new URL(route.request().url())
              const txHashesParam = url.searchParams.get('txHashes') || ''
              const txHashes = txHashesParam.split(',').filter(Boolean)
              const mockResponse = generateLuxTxPollingResponse(txHashes)
              return route.fulfill({
                body: JSON.stringify(mockResponse),
                contentType: 'application/json',
              })
            } catch (error) {
              const { ignored } = shouldIgnorePageError(error)
              if (ignored) {
                return undefined
              }

              throw error
            }
          },
        )

        await use(undefined)
      } catch (e) {
        console.warn('[txPolling fixture] Failed to set up route interception:', e)
        await use(undefined)
      }
    },
    { auto: true },
  ],
  // Intercept ConnectRPC REST endpoints (/v2) and return empty responses
  // This prevents network errors from breaking E2E tests
  connectRpcFallback: [
    async ({ page }, use) => {
      try {
        // Match /v2 endpoints on gateway.uniswap.org (used by ConnectRPC)
        const connectRpcPattern = /(?:\w+\.)?(?:interface|beta)\.(?:gateway|api)\.uniswap\.org\/v2\//

        await page.route(connectRpcPattern, async (route) => {
          try {
            const url = route.request().url()
            console.log(`[ConnectRPC Fallback] Intercepting: ${url}`)

            // Return empty but valid ConnectRPC response
            // The format depends on the specific service, but most return arrays/objects
            const emptyResponse = {
              // TokenRankings response format
              tokenRankings: {
                trending: { tokens: [] },
                topGainers: { tokens: [] },
                topLosers: { tokens: [] },
              },
            }

            return route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify(emptyResponse),
            })
          } catch (error) {
            const { ignored } = shouldIgnorePageError(error)
            if (ignored) {
              return undefined
            }
            throw error
          }
        })

        await use(undefined)
      } catch (e) {
        console.warn('[connectRpcFallback fixture] Failed to set up route interception:', e)
        await use(undefined)
      }
    },
    { auto: true },
  ],
})
