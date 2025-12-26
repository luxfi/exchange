/**
 * Lux Exchange - Contract Addresses
 *
 * Contains all deployed contract addresses per chain.
 * Updated with real mainnet/testnet addresses from /Users/z/work/lux/standard/deployments
 */

import {
  luxMainnet,
  luxTestnet,
  zooMainnet,
  zooTestnet,
  ethereum,
  sepolia,
} from "./chains"

// =============================================================================
// TYPES
// =============================================================================

export type Address = `0x${string}`

export interface TokenAddresses {
  WLUX?: Address
  LETH?: Address
  LBTC?: Address
  LUSD?: Address
  WZOO?: Address
  WETH?: Address
  USDC?: Address
  USDT?: Address
  DAI?: Address
}

export interface AMMAddresses {
  V2_FACTORY: Address
  V2_ROUTER: Address
  V3_FACTORY?: Address
  V3_ROUTER?: Address
  V3_QUOTER?: Address
  V3_POSITION_MANAGER?: Address
  MULTICALL?: Address
}

export interface ChainContracts {
  tokens: TokenAddresses
  amm: AMMAddresses
}

// =============================================================================
// LUX MAINNET CONTRACTS (Chain ID: 96369)
// Deployed from /Users/z/work/lux/standard
// =============================================================================

export const LUX_MAINNET_CONTRACTS: ChainContracts = {
  tokens: {
    WLUX: "0x55750d6CA62a041c06a8E28626b10Be6c688f471" as Address,
    // Bridge tokens - addresses TBD after Lux bridge deployment
    LETH: undefined,
    LBTC: undefined,
    LUSD: undefined,
  },
  amm: {
    // V2 (QuantumSwap)
    V2_FACTORY: "0xd9a95609DbB228A13568Bd9f9A285105E7596970" as Address,
    V2_ROUTER: "0x1F6cbC7d3bc7D803ee76D80F0eEE25767431e674" as Address,
    // V3 (Concentrated Liquidity)
    V3_FACTORY: "0xb732BD88F25EdD9C3456638671fB37685D4B4e3f" as Address,
    V3_ROUTER: "0x939bC0Bca6F9B9c52E6e3AD8A3C590b5d9B9D10E" as Address, // SwapRouter02
    V3_QUOTER: "0x15C729fdd833Ba675edd466Dfc63E1B737925A4c" as Address, // QuoterV2
    V3_POSITION_MANAGER: "0x7a4C48B9dae0b7c396569b34042fcA604150Ee28" as Address,
    MULTICALL: "0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F" as Address,
  },
}

// =============================================================================
// LUX TESTNET CONTRACTS (Chain ID: 96368)
// =============================================================================

export const LUX_TESTNET_CONTRACTS: ChainContracts = {
  tokens: {
    WLUX: "0x732740c5c895C9FCF619930ed4293fc858eb44c7" as Address,
    WETH: "0xd9956542B51032d940ef076d70B69410667277A3" as Address,
    // Bridge tokens - addresses TBD after testnet bridge deployment
    LETH: undefined,
    LBTC: undefined,
    LUSD: undefined,
  },
  amm: {
    // V2
    V2_FACTORY: "0x81C3669B139D92909AA67DbF74a241b10540d919" as Address,
    V2_ROUTER: "0xDB6c703c80BFaE5F9a56482d3c8535f27E1136EB" as Address,
    // V3
    V3_FACTORY: "0x80bBc7C4C7a59C899D1B37BC14539A22D5830a84" as Address,
    V3_ROUTER: "0x939bC0Bca6F9B9c52E6e3AD8A3C590b5d9B9D10E" as Address,
    V3_QUOTER: "0x15C729fdd833Ba675edd466Dfc63E1B737925A4c" as Address,
    V3_POSITION_MANAGER: "0x7a4C48B9dae0b7c396569b34042fcA604150Ee28" as Address,
    MULTICALL: "0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F" as Address,
  },
}

// =============================================================================
// ZOO MAINNET CONTRACTS (Chain ID: 200200)
// =============================================================================

export const ZOO_MAINNET_CONTRACTS: ChainContracts = {
  tokens: {
    // Zoo native wrapped token - TBD
    WZOO: undefined,
    // Bridged WLUX on Zoo - TBD
    WLUX: undefined,
  },
  amm: {
    // Deploy pending - use placeholder
    V2_FACTORY: "0x0000000000000000000000000000000000000000" as Address,
    V2_ROUTER: "0x0000000000000000000000000000000000000000" as Address,
  },
}

// =============================================================================
// ZOO TESTNET CONTRACTS (Chain ID: 200201)
// =============================================================================

export const ZOO_TESTNET_CONTRACTS: ChainContracts = {
  tokens: {
    WZOO: undefined,
    WLUX: undefined,
  },
  amm: {
    V2_FACTORY: "0x0000000000000000000000000000000000000000" as Address,
    V2_ROUTER: "0x0000000000000000000000000000000000000000" as Address,
  },
}

// =============================================================================
// ETHEREUM MAINNET CONTRACTS (Chain ID: 1)
// Standard Uniswap V2 addresses
// =============================================================================

export const ETHEREUM_MAINNET_CONTRACTS: ChainContracts = {
  tokens: {
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as Address,
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as Address,
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7" as Address,
    DAI: "0x6B175474E89094C44Da98b954EescdeCB5BE3830" as Address,
    // Lux bridge tokens on Ethereum
    LBTC: "0x526903Ee6118de6737D11b37f82fC7f69B13685D" as Address,
    LETH: "0xAA3AE951A7925F25aE8Ad65b052a76Bd8f052598" as Address,
  },
  amm: {
    // Uniswap V2 on Ethereum
    V2_FACTORY: "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f" as Address,
    V2_ROUTER: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D" as Address,
    MULTICALL: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696" as Address,
  },
}

// =============================================================================
// SEPOLIA TESTNET CONTRACTS (Chain ID: 11155111)
// =============================================================================

export const SEPOLIA_CONTRACTS: ChainContracts = {
  tokens: {
    WETH: "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9" as Address,
    USDC: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238" as Address,
  },
  amm: {
    // Uniswap V2 on Sepolia
    V2_FACTORY: "0x7E0987E5b3a30e3f2828572Bb659A548460a3003" as Address,
    V2_ROUTER: "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008" as Address,
    MULTICALL: "0xcA11bde05977b3631167028862bE2a173976CA11" as Address,
  },
}

// =============================================================================
// CONTRACT LOOKUP BY CHAIN ID
// =============================================================================

export const CONTRACTS_BY_CHAIN: Record<number, ChainContracts> = {
  [luxMainnet.id]: LUX_MAINNET_CONTRACTS,
  [luxTestnet.id]: LUX_TESTNET_CONTRACTS,
  [zooMainnet.id]: ZOO_MAINNET_CONTRACTS,
  [zooTestnet.id]: ZOO_TESTNET_CONTRACTS,
  [ethereum.id]: ETHEREUM_MAINNET_CONTRACTS,
  [sepolia.id]: SEPOLIA_CONTRACTS,
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get contracts for a specific chain
 */
export function getContracts(chainId: number): ChainContracts | undefined {
  return CONTRACTS_BY_CHAIN[chainId]
}

/**
 * Get token address for a specific chain
 */
export function getTokenAddress(
  chainId: number,
  symbol: keyof TokenAddresses
): Address | undefined {
  return CONTRACTS_BY_CHAIN[chainId]?.tokens[symbol]
}

/**
 * Get AMM router address for a specific chain (V2)
 */
export function getRouterAddress(chainId: number): Address | undefined {
  return CONTRACTS_BY_CHAIN[chainId]?.amm.V2_ROUTER
}

/**
 * Get AMM factory address for a specific chain (V2)
 */
export function getFactoryAddress(chainId: number): Address | undefined {
  return CONTRACTS_BY_CHAIN[chainId]?.amm.V2_FACTORY
}

/**
 * Get V3 router address for a specific chain
 */
export function getV3RouterAddress(chainId: number): Address | undefined {
  return CONTRACTS_BY_CHAIN[chainId]?.amm.V3_ROUTER
}

/**
 * Check if contracts are deployed (not zero/placeholder addresses)
 */
export function areContractsDeployed(chainId: number): boolean {
  const contracts = CONTRACTS_BY_CHAIN[chainId]
  if (!contracts) return false

  const factory = contracts.amm.V2_FACTORY
  return factory !== undefined &&
         factory !== ("0x0000000000000000000000000000000000000000" as Address)
}

/**
 * Check if V3 contracts are available
 */
export function hasV3Contracts(chainId: number): boolean {
  const contracts = CONTRACTS_BY_CHAIN[chainId]
  return contracts?.amm.V3_FACTORY !== undefined
}

// =============================================================================
// ABIs (minimal interfaces for common operations)
// =============================================================================

export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 value) returns (bool)",
  "function transfer(address to, uint256 value) returns (bool)",
  "function transferFrom(address from, address to, uint256 value) returns (bool)",
] as const

export const V2_ROUTER_ABI = [
  "function swapExactTokensForTokens(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) returns (uint256[] amounts)",
  "function swapTokensForExactTokens(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) returns (uint256[] amounts)",
  "function swapExactETHForTokens(uint256 amountOutMin, address[] path, address to, uint256 deadline) payable returns (uint256[] amounts)",
  "function swapTokensForExactETH(uint256 amountOut, uint256 amountInMax, address[] path, address to, uint256 deadline) returns (uint256[] amounts)",
  "function swapExactTokensForETH(uint256 amountIn, uint256 amountOutMin, address[] path, address to, uint256 deadline) returns (uint256[] amounts)",
  "function swapETHForExactTokens(uint256 amountOut, address[] path, address to, uint256 deadline) payable returns (uint256[] amounts)",
  "function getAmountsOut(uint256 amountIn, address[] path) view returns (uint256[] amounts)",
  "function getAmountsIn(uint256 amountOut, address[] path) view returns (uint256[] amounts)",
  "function addLiquidity(address tokenA, address tokenB, uint256 amountADesired, uint256 amountBDesired, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) returns (uint256 amountA, uint256 amountB, uint256 liquidity)",
  "function removeLiquidity(address tokenA, address tokenB, uint256 liquidity, uint256 amountAMin, uint256 amountBMin, address to, uint256 deadline) returns (uint256 amountA, uint256 amountB)",
] as const

export const V2_FACTORY_ABI = [
  "function getPair(address tokenA, address tokenB) view returns (address pair)",
  "function allPairs(uint256) view returns (address pair)",
  "function allPairsLength() view returns (uint256)",
  "function createPair(address tokenA, address tokenB) returns (address pair)",
] as const

export const V2_PAIR_ABI = [
  "function token0() view returns (address)",
  "function token1() view returns (address)",
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
] as const

export const V3_QUOTER_ABI = [
  "function quoteExactInputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountIn, uint160 sqrtPriceLimitX96) external returns (uint256 amountOut)",
  "function quoteExactInput(bytes path, uint256 amountIn) external returns (uint256 amountOut)",
  "function quoteExactOutputSingle(address tokenIn, address tokenOut, uint24 fee, uint256 amountOut, uint160 sqrtPriceLimitX96) external returns (uint256 amountIn)",
  "function quoteExactOutput(bytes path, uint256 amountOut) external returns (uint256 amountIn)",
] as const

export const MULTICALL_ABI = [
  "function aggregate(tuple(address target, bytes callData)[] calls) returns (uint256 blockNumber, bytes[] returnData)",
  "function tryAggregate(bool requireSuccess, tuple(address target, bytes callData)[] calls) returns (tuple(bool success, bytes returnData)[] returnData)",
] as const
