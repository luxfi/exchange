/**
 * Lux Exchange - Contract Addresses
 *
 * Contains all deployed contract addresses per chain.
 * Updated with real mainnet/testnet addresses from /Users/z/work/lux/standard/deployments
 */

import {
  luxMainnet,
  luxTestnet,
  luxDev,
  zooMainnet,
  zooTestnet,
  hanzoMainnet,
  spcMainnet,
  parsMainnet,
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
// LUX DEV CONTRACTS (Chain ID: 1337)
// Deployed via DeployFullStack.s.sol to luxd dev mode
// =============================================================================

export const LUX_DEV_CONTRACTS: ChainContracts = {
  tokens: {
    WLUX: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788" as Address,
    // Bridged collateral tokens
    WETH: "0x5FbDB2315678afecb367f032d93F642f64180aa3" as Address,
    USDC: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0" as Address,
    USDT: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9" as Address,
    DAI: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9" as Address,
  },
  amm: {
    // AMM V2 (QuantumSwap)
    V2_FACTORY: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1" as Address,
    V2_ROUTER: "0x9A9f2CCfdE556A7E9Ff0848998Aa4a0CFD8863AE" as Address,
    MULTICALL: "0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F" as Address,
  },
}

// =============================================================================
// LUX MAINNET CONTRACTS (Chain ID: 96369)
// Deployed from /Users/z/work/lux/standard
// =============================================================================

export const LUX_MAINNET_CONTRACTS: ChainContracts = {
  tokens: {
    
    
    WLUX: "0x4888E4a2Ee0F03051c72d2bD3acf755Ed3498b3E" as Address,
    LETH: "0x5a88986958ea76Dd043f834542724F081cA1443B" as Address,
    LBTC: "0x8a3fad1c7FB94461621351aa6A983B6f814F039c" as Address,
    LUSD: "0x57f9E717dc080a6A76fB6F77BecA8C9C1D266B96" as Address,
  },
  amm: {
    // V2 (CREATE2) — survived re-genesis, has code but different ABI
    V2_FACTORY: "0xD173926A10A0C4eCd3A51B1422270b65Df0551c1" as Address,
    V2_ROUTER: "0xAe2cf1E403aAFE6C05A5b8Ef63EB19ba591d8511" as Address,
    // V3 (CREATE2) — 27 pools, 100k+ swaps, active trading
    V3_FACTORY: "0x80bBc7C4C7a59C899D1B37BC14539A22D5830a84" as Address,
    V3_ROUTER: "0x939bC0Bca6F9B9c52E6e3AD8A3C590b5d9B9D10E" as Address, // SwapRouter02
    V3_QUOTER: "0x12e2B76FaF4dDA5a173a4532916bb6Bfa3645275" as Address, // QuoterV2
    V3_POSITION_MANAGER: "0x7a4C48B9dae0b7c396569b34042fcA604150Ee28" as Address,
    MULTICALL: "0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F" as Address,
  },
}

// =============================================================================
// LUX TESTNET CONTRACTS (Chain ID: 96368)
// =============================================================================

export const LUX_TESTNET_CONTRACTS: ChainContracts = {
  tokens: {
    WLUX: "0xDe5310d0Eccc04C8987cB66Ff6b89Ee793442C91" as Address,
    WETH: "0xA695a8A66fbe3E32d15a531db04185313595771A" as Address,
    // Bridge tokens - deployed via DeployMultiNetwork.s.sol 2026-02-27
    LETH: "0xA695a8A66fbe3E32d15a531db04185313595771A" as Address,
    LBTC: "0x5a88986958ea76Dd043f834542724F081cA1443B" as Address,
    LUSD: "0x8a3fad1c7FB94461621351aa6A983B6f814F039c" as Address,
  },
  amm: {
    // V2 - deployed via DeployMultiNetwork.s.sol 2026-02-27
    V2_FACTORY: "0x1DD4e6cbC6B8FD032fCAD5A3B0a45e446A014637" as Address,
    V2_ROUTER: "0xb06B31521Afc434F87Fe4852c98FC15A26c92aE8" as Address,
    MULTICALL: "0xd25F88CBdAe3c2CCA3Bb75FC4E723b44C0Ea362F" as Address,
  },
}

// =============================================================================
// ZOO MAINNET CONTRACTS (Chain ID: 200200)
// Shared subnet deployment addresses (nonce 0)
// =============================================================================

export const ZOO_MAINNET_CONTRACTS: ChainContracts = {
  tokens: {
    WLUX: "0x5491216406daB99b7032b83765F36790E27F8A61" as Address,
    LETH: "0x4870621EA8be7a383eFCfdA225249d35888bD9f2" as Address,
    LBTC: "0x6fc44509a32E513bE1aa00d27bb298e63830C6A8" as Address,
    LUSD: "0xb2ee1CE7b84853b83AA08702aD0aD4D79711882D" as Address,
  },
  amm: {
    V2_FACTORY: "0xF034942c1140125b5c278aE9cEE1B488e915B2FE" as Address,
    V2_ROUTER: "0x2cd306913e6546C59249b48d7c786A6D1d7ebE08" as Address,
  },
}

// =============================================================================
// ZOO TESTNET CONTRACTS (Chain ID: 200201)
// =============================================================================

export const ZOO_TESTNET_CONTRACTS: ChainContracts = {
  tokens: {
    WLUX: undefined,
  },
  amm: {
    V2_FACTORY: "0x0000000000000000000000000000000000000000" as Address,
    V2_ROUTER: "0x0000000000000000000000000000000000000000" as Address,
  },
}

// =============================================================================
// HANZO MAINNET CONTRACTS (Chain ID: 36963)
// Shared subnet deployment addresses (nonce 0)
// =============================================================================

export const HANZO_MAINNET_CONTRACTS: ChainContracts = {
  tokens: {
    WLUX: "0xc65ea8882020Af7CDa7854d590C6Fcd34BF364ec" as Address,
    LETH: "0x9378b62fC172d2A4f715d7ecF49DE0362f1BB702" as Address,
    LBTC: "0x7fC4f8a926E47Fa3587C0d7658C00E7489e67916" as Address,
    LUSD: "0x51c3408B9A6a0B2446CCB78c72C846CEB76201FA" as Address,
  },
  amm: {
    V2_FACTORY: "0xDc384E006BAec602b0b2B2fe6f2712646EFb1e9D" as Address,
    V2_ROUTER: "0x191067f88d61f9506555E88CEab9CF71deeD61A9" as Address,
  },
}

// =============================================================================
// SPC MAINNET CONTRACTS (Chain ID: 36911)
// Shared subnet deployment addresses (nonce 0)
// =============================================================================

export const SPC_MAINNET_CONTRACTS: ChainContracts = {
  tokens: {
    // NOT DEPLOYED — genesis key unknown
  },
  amm: {
    V2_FACTORY: "0x0000000000000000000000000000000000000000" as Address,
    V2_ROUTER: "0x0000000000000000000000000000000000000000" as Address,
  },
}

// =============================================================================
// PARS MAINNET CONTRACTS (Chain ID: 494949)
// Shared subnet deployment addresses (nonce 0)
// =============================================================================

export const PARS_MAINNET_CONTRACTS: ChainContracts = {
  tokens: {
    WLUX: "0x548F54Dfb32ea6cE4fa3515236696CF3d1b7D26a" as Address,
    LETH: "0xe0f7E9A0cB1688ccA453995fd6e19AE4fbD9cBfd" as Address,
    LBTC: "0x7d7cC8D05BB0F38D80b5Ce44b4b069A6FB769468" as Address,
    LUSD: "0xC5e4A6f54Be469551a342872C1aB83AB46f61b22" as Address,
  },
  amm: {
    V2_FACTORY: "0x84CF0A13db1be8e1F0676405cfcBC8b09692FD1C" as Address,
    V2_ROUTER: "0x2382F7A49FA48E1F91Bec466c32e1D7F13ec8206" as Address,
  },
}

// =============================================================================
// ETHEREUM MAINNET CONTRACTS (Chain ID: 1)
// Standard Lux V2 addresses
// =============================================================================

export const ETHEREUM_MAINNET_CONTRACTS: ChainContracts = {
  tokens: {
    WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as Address,
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" as Address,
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7" as Address,
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F" as Address,
    // Lux bridge tokens on Ethereum
    LBTC: "0x526903Ee6118de6737D11b37f82fC7f69B13685D" as Address,
    LETH: "0xAA3AE951A7925F25aE8Ad65b052a76Bd8f052598" as Address,
  },
  amm: {
    // Lux V2 on Ethereum
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
    // Lux V2 on Sepolia
    V2_FACTORY: "0x7E0987E5b3a30e3f2828572Bb659A548460a3003" as Address,
    V2_ROUTER: "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008" as Address,
    MULTICALL: "0xcA11bde05977b3631167028862bE2a173976CA11" as Address,
  },
}

// =============================================================================
// CONTRACT LOOKUP BY CHAIN ID
// =============================================================================

export const CONTRACTS_BY_CHAIN: Record<number, ChainContracts> = {
  [luxDev.id]: LUX_DEV_CONTRACTS,
  [luxMainnet.id]: LUX_MAINNET_CONTRACTS,
  [luxTestnet.id]: LUX_TESTNET_CONTRACTS,
  [zooMainnet.id]: ZOO_MAINNET_CONTRACTS,
  [zooTestnet.id]: ZOO_TESTNET_CONTRACTS,
  [hanzoMainnet.id]: HANZO_MAINNET_CONTRACTS,
  [spcMainnet.id]: SPC_MAINNET_CONTRACTS,
  [parsMainnet.id]: PARS_MAINNET_CONTRACTS,
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
