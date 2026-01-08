/**
 * G-Chain - Native Lux Blockchain Data Layer
 *
 * G-Chain provides read-only GraphQL access to blockchain data:
 * - Blocks and transactions
 * - Accounts and balances
 * - Chain metadata (C, P, X, D chains)
 * - DEX/AMM data (pools, pairs, swaps, positions)
 * - Oracle price feeds (ETH, LUX, token prices, TWAP)
 *
 * Endpoints:
 * - POST /ext/bc/G/graphql - Execute GraphQL queries
 * - GET /ext/bc/G/schema - List registered schemas
 * - POST /ext/bc/G/query - Execute ad-hoc queries
 *
 * Ports:
 * - Mainnet: 9630
 * - Testnet: 9650
 * - Devnet: 9650
 */

// Client and queries
export {
  GCHAIN_ACCOUNT_QUERY,
  GCHAIN_ALL_CHAINS_QUERY,
  GCHAIN_BALANCE_QUERY,
  GCHAIN_BLOCK_QUERY,
  GCHAIN_BLOCKS_QUERY,
  // DEX/AMM Queries
  GCHAIN_BUNDLE_QUERY,
  GCHAIN_FACTORY_QUERY,
  // Queries
  GCHAIN_INFO_QUERY,
  GCHAIN_PAIR_QUERY,
  GCHAIN_POOL_BY_TOKENS_QUERY,
  GCHAIN_POOL_HOUR_DATA_QUERY,
  GCHAIN_POOL_QUERY,
  GCHAIN_POOLS_QUERY,
  GCHAIN_POSITIONS_QUERY,
  GCHAIN_SWAPS_QUERY,
  GCHAIN_TICKS_QUERY,
  GCHAIN_TOKEN_DAY_DATA_QUERY,
  GCHAIN_TOKEN_QUERY,
  GCHAIN_TOKENS_QUERY,
  GCHAIN_TRANSACTION_QUERY,
  type GChainAccount,
  type GChainBlock,
  // DEX/AMM Types
  type GChainBundle,
  type GChainChain,
  type GChainChainStats,
  type GChainFactory,
  // Types
  type GChainInfo,
  type GChainPair,
  type GChainPool,
  type GChainPosition,
  type GChainSwap,
  type GChainTick,
  type GChainToken,
  type GChainTokenDayData,
  type GChainTransaction,
  getAccount,
  getAllChainsStats,
  getBalance,
  getBlock,
  getChainInfo,
  getFactoryStats,
  getGChainClient,
  getLatestBlocks,
  getPair,
  getPool,
  getPoolByTokens,
  getPositions,
  // DEX/AMM functions
  getPriceBundle,
  getSwaps,
  getTicks,
  getToken,
  getTokenPriceHistory,
  getTokenPriceUSD,
  getTopPools,
  getTopTokens,
  getTransaction,
  getTWAP,
} from './client'

// React hooks - Core
export {
  useGChainAccount,
  useGChainAllChainsStats,
  useGChainBalance,
  useGChainBlock,
  useGChainFactoryStats,
  useGChainInfo,
  useGChainLatestBlocks,
  useGChainPair,
  useGChainPool,
  useGChainPoolByTokens,
  // Composite hooks
  useGChainPoolWithPrices,
  useGChainPositions,
  useGChainPositionsWithValue,
  // DEX/AMM hooks
  useGChainPriceBundle,
  useGChainSwaps,
  useGChainTicks,
  useGChainToken,
  useGChainTokenPrice,
  useGChainTokenPriceHistory,
  useGChainTopPools,
  useGChainTopTokens,
  useGChainTransaction,
  useGChainTWAP,
} from './hooks'

// Lux-specific balance hooks
export {
  formatLuxBalance,
  isGChainSupported,
  useFormattedLuxBalance,
  useLuxAccount,
  useLuxNativeBalance,
} from './useLuxBalance'
