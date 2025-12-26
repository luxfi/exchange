/**
 * @luxfi/dex
 *
 * DEX Integration Package
 *
 * Provides routing between:
 * - CLOB (Central Limit Order Book) via ~/work/lux/dex
 * - AMM Precompiles (0x0400-0x0403) for native swaps
 *
 * Architecture:
 * ```
 * ┌────────────────────────────────────────┐
 * │           Omnichain Router             │
 * │  Best execution between CLOB & AMM     │
 * └─────────────────┬──────────────────────┘
 *                   │
 *     ┌─────────────┴─────────────┐
 *     │                           │
 *     ▼                           ▼
 * ┌─────────┐              ┌───────────────┐
 * │  CLOB   │              │ AMM Precompile│
 * │ Client  │              │   (0x0400)    │
 * │         │              │               │
 * │ • Limit │              │ • Swap        │
 * │ • HFT   │              │ • Liquidity   │
 * │ • Perps │              │ • Flash       │
 * └─────────┘              └───────────────┘
 * ```
 */

// Precompile types and ABIs (AMM)
export {
  // Types
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
  // ABIs
  POOL_MANAGER_ABI,
  SWAP_ROUTER_ABI,
  HOOKS_REGISTRY_ABI,
  FLASH_LOAN_ABI,
  // Addresses
  DEX_PRECOMPILES,
  type DexPrecompile,
} from './precompile'

// CLOB client (exports Position as CLOBPosition to avoid conflict)
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

// Omnichain router
export * from './router'

// React hooks
export * from './hooks'
