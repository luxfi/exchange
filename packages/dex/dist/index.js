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
export { NATIVE_LUX, sortCurrencies, createPoolKey, 
// LXBook Types (LP-9020)
TIF, OrderKind, GroupType, ActionType, 
// LXVault Types (LP-9030)
MarginMode, PositionSide, 
// AMM ABIs
POOL_MANAGER_ABI, SWAP_ROUTER_ABI, HOOKS_REGISTRY_ABI, FLASH_LOAN_ABI, 
// LX* ABIs
LX_BOOK_ABI, LX_VAULT_ABI, LX_FEED_ABI, LX_ORACLE_ABI, 
// Addresses
LX, DEX_PRECOMPILES, fromLP, toLP, isDEXPrecompile, isBridgePrecompile, } from './precompile';
// =============================================================================
// CLOB Client (External ~/work/lux/dex integration)
// =============================================================================
export { CLOBClient, createCLOBClient, } from './client';
// =============================================================================
// Omnichain Router
// =============================================================================
export * from './router';
// =============================================================================
// React Hooks
// =============================================================================
export * from './hooks';
