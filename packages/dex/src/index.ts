/**
 * @luxfi/dex
 *
 * LX Integration Package
 *
 * Native precompile integration for Lux DEX stack:
 * - LXPool (LP-9010): v4-style AMM PoolManager
 * - LXOracle (LP-9011): Multi-source price aggregation
 * - LXRouter (LP-9012): Optimized swap routing
 * - LXHooks (LP-9013): Hook contract registry
 * - LXFlash (LP-9014): Flash loan facility
 * - LXBook (LP-9020): CLOB matching engine
 * - LXVault (LP-9030): Custody and margin engine
 * - LXFeed (LP-9040): Mark price and funding feeds
 *
 * Architecture:
 * ```
 * ┌─────────────────────────────────────────────────────────────┐
 * │                    Omnichain Router                         │
 * │           Best execution between CLOB & AMM                 │
 * └─────────────────────────┬───────────────────────────────────┘
 *                           │
 *       ┌───────────────────┼───────────────────┐
 *       │                   │                   │
 *       ▼                   ▼                   ▼
 * ┌───────────┐      ┌───────────┐       ┌───────────┐
 * │  LXBook   │      │  LXPool   │       │  LXVault  │
 * │ (LP-9020) │      │ (LP-9010) │       │ (LP-9030) │
 * │           │      │           │       │           │
 * │ • Orders  │      │ • Swaps   │       │ • Custody │
 * │ • CLOB    │      │ • AMM     │       │ • Margin  │
 * │ • Perps   │      │ • Flash   │       │ • Liq.    │
 * └───────────┘      └───────────┘       └───────────┘
 *       │                   │                   │
 *       └───────────────────┴───────────────────┘
 *                           │
 *                    ┌──────┴──────┐
 *                    │   LXFeed    │
 *                    │  (LP-9040)  │
 *                    │             │
 *                    │ • Mark Px   │
 *                    │ • Index Px  │
 *                    │ • Funding   │
 *                    └─────────────┘
 * ```
 */

// =============================================================================
// Precompile Types, ABIs, and Addresses
// =============================================================================

export {
  // AMM Types (LP-9010)
  type Currency,
  type PoolKey,
  type BalanceDelta,
  type SwapParams,
  type ModifyLiquidityParams,
  type PoolState,
  type Position as AMMPosition,
  NATIVE_LUX,
  sortCurrencies,
  createPoolKey,

  // LXBook Types (LP-9020)
  TIF,
  OrderKind,
  GroupType,
  ActionType,
  type LXOrder,
  type LXAction,
  type LXPlaceResult,
  type LXL1,

  // LXVault Types (LP-9030)
  MarginMode,
  PositionSide,
  type LXAccount,
  type LXPosition,
  type LXMarginInfo,
  type LXSettlement,
  type LXLiquidationResult,

  // LXFeed Types (LP-9040)
  type LXMarkPrice,
  type LXFundingRate,

  // AMM ABIs
  POOL_MANAGER_ABI,
  SWAP_ROUTER_ABI,
  HOOKS_REGISTRY_ABI,
  FLASH_LOAN_ABI,

  // LX* ABIs
  LX_BOOK_ABI,
  LX_VAULT_ABI,
  LX_FEED_ABI,
  LX_ORACLE_ABI,

  // Addresses
  LX,
  DEX_PRECOMPILES,
  type LxdexPrecompile,
  type DexPrecompile,
  fromLP,
  toLP,
  isDEXPrecompile,
  isBridgePrecompile,
} from './precompile'

// =============================================================================
// CLOB Client (External ~/work/lux/dex integration)
// =============================================================================

export {
  type OrderSide,
  type OrderType,
  type OrderStatus,
  type TimeInForce,
  type OrderRequest,
  type Order,
  type OrderBookEntry,
  type OrderBook,
  type Trade,
  type Position as CLOBPosition,
  type Balance,
  type ICLOBClient,
  CLOBClient,
  createCLOBClient,
} from './client'

// =============================================================================
// Omnichain Router
// =============================================================================

export * from './router'

// =============================================================================
// React Hooks
// =============================================================================

export * from './hooks'
