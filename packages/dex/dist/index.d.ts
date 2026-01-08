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
export { type Currency, type PoolKey, type BalanceDelta, type SwapParams, type ModifyLiquidityParams, type PoolState, type Position as AMMPosition, NATIVE_LUX, sortCurrencies, createPoolKey, TIF, OrderKind, GroupType, ActionType, type LXOrder, type LXAction, type LXPlaceResult, type LXL1, MarginMode, PositionSide, type LXAccount, type LXPosition, type LXMarginInfo, type LXSettlement, type LXLiquidationResult, type LXMarkPrice, type LXFundingRate, POOL_MANAGER_ABI, SWAP_ROUTER_ABI, HOOKS_REGISTRY_ABI, FLASH_LOAN_ABI, LX_BOOK_ABI, LX_VAULT_ABI, LX_FEED_ABI, LX_ORACLE_ABI, LX, DEX_PRECOMPILES, type LxdexPrecompile, type DexPrecompile, fromLP, toLP, isDEXPrecompile, isBridgePrecompile, } from './precompile';
export { type OrderSide, type OrderType, type OrderStatus, type TimeInForce, type OrderRequest, type Order, type OrderBookEntry, type OrderBook, type Trade, type Position as CLOBPosition, type Balance, type ICLOBClient, CLOBClient, createCLOBClient, } from './client';
export * from './router';
export * from './hooks';
//# sourceMappingURL=index.d.ts.map