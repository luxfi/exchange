/**
 * Lux Exchange - Contract Addresses
 *
 * Contains all deployed contract addresses per chain.
 * Placeholder addresses (0x0...0001) will be replaced after deployment.
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
  MULTICALL?: Address
}

export interface ChainContracts {
  tokens: TokenAddresses
  amm: AMMAddresses
}

// =============================================================================
// PLACEHOLDER ADDRESSES (will be replaced after deployment)
// =============================================================================

// Using deterministic placeholder addresses for easy identification
const PLACEHOLDER = {
  // Tokens
  WLUX: "0x0000000000000000000000000000000000000001" as Address,
  LETH: "0x0000000000000000000000000000000000000002" as Address,
  LBTC: "0x0000000000000000000000000000000000000003" as Address,
  LUSD: "0x0000000000000000000000000000000000000004" as Address,
  WZOO: "0x0000000000000000000000000000000000000005" as Address,

  // AMM V2
  V2_FACTORY: "0x0000000000000000000000000000000000000010" as Address,
  V2_ROUTER: "0x0000000000000000000000000000000000000011" as Address,
  MULTICALL: "0x0000000000000000000000000000000000000012" as Address,
}

// =============================================================================
// LUX MAINNET CONTRACTS (Chain ID: 96369)
// =============================================================================

export const LUX_MAINNET_CONTRACTS: ChainContracts = {
  tokens: {
    WLUX: PLACEHOLDER.WLUX,
    LETH: PLACEHOLDER.LETH,
    LBTC: PLACEHOLDER.LBTC,
    LUSD: PLACEHOLDER.LUSD,
  },
  amm: {
    V2_FACTORY: PLACEHOLDER.V2_FACTORY,
    V2_ROUTER: PLACEHOLDER.V2_ROUTER,
    MULTICALL: PLACEHOLDER.MULTICALL,
  },
}

// =============================================================================
// LUX TESTNET CONTRACTS (Chain ID: 96368)
// =============================================================================

export const LUX_TESTNET_CONTRACTS: ChainContracts = {
  tokens: {
    WLUX: PLACEHOLDER.WLUX,
    LETH: PLACEHOLDER.LETH,
    LBTC: PLACEHOLDER.LBTC,
    LUSD: PLACEHOLDER.LUSD,
  },
  amm: {
    V2_FACTORY: PLACEHOLDER.V2_FACTORY,
    V2_ROUTER: PLACEHOLDER.V2_ROUTER,
    MULTICALL: PLACEHOLDER.MULTICALL,
  },
}

// =============================================================================
// ZOO MAINNET CONTRACTS (Chain ID: 200200)
// =============================================================================

export const ZOO_MAINNET_CONTRACTS: ChainContracts = {
  tokens: {
    WZOO: PLACEHOLDER.WZOO,
    WLUX: PLACEHOLDER.WLUX, // Bridged WLUX on Zoo
  },
  amm: {
    V2_FACTORY: PLACEHOLDER.V2_FACTORY,
    V2_ROUTER: PLACEHOLDER.V2_ROUTER,
    MULTICALL: PLACEHOLDER.MULTICALL,
  },
}

// =============================================================================
// ZOO TESTNET CONTRACTS (Chain ID: 200201)
// =============================================================================

export const ZOO_TESTNET_CONTRACTS: ChainContracts = {
  tokens: {
    WZOO: PLACEHOLDER.WZOO,
    WLUX: PLACEHOLDER.WLUX,
  },
  amm: {
    V2_FACTORY: PLACEHOLDER.V2_FACTORY,
    V2_ROUTER: PLACEHOLDER.V2_ROUTER,
    MULTICALL: PLACEHOLDER.MULTICALL,
  },
}

// =============================================================================
// ETHEREUM MAINNET CONTRACTS (Chain ID: 1)
// =============================================================================

export const ETHEREUM_MAINNET_CONTRACTS: ChainContracts = {
  tokens: {
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as Address,
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as Address,
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7" as Address,
    DAI: "0x6B175474E89094C44Da98b954EescdeCB5BE3830" as Address,
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
 * Get AMM router address for a specific chain
 */
export function getRouterAddress(chainId: number): Address | undefined {
  return CONTRACTS_BY_CHAIN[chainId]?.amm.V2_ROUTER
}

/**
 * Get AMM factory address for a specific chain
 */
export function getFactoryAddress(chainId: number): Address | undefined {
  return CONTRACTS_BY_CHAIN[chainId]?.amm.V2_FACTORY
}

/**
 * Check if contracts are deployed (not placeholder addresses)
 */
export function areContractsDeployed(chainId: number): boolean {
  const contracts = CONTRACTS_BY_CHAIN[chainId]
  if (!contracts) return false

  // Check if factory is not a placeholder
  return !contracts.amm.V2_FACTORY.startsWith("0x000000000000000000000000000000000000")
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
