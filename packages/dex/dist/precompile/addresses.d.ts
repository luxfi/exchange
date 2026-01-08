/**
 * LX Precompile Addresses (LP-Aligned)
 * Native Go implementation at EVM level
 *
 * LX is the umbrella name for the Lux DEX stack:
 * - AMM (Uniswap v4-style)
 * - CLOB (Hyperliquid-style)
 * - Vaults, Feeds, Routing
 *
 * LP-Aligned Address Format (LP-9015):
 * - Address = 0x0000000000000000000000000000000000LPNUM
 * - LP number directly visible as trailing hex digits
 * - Example: LP-9010 → 0x0000...009010
 *
 * @see LP-9015 (Precompile Registry) for canonical spec
 * @see ~/work/lux/precompile/dex/module.go for Go implementation
 * @see ~/work/lux/lps/LPs/lp-9015-precompile-registry.md
 */
import type { Address } from 'viem';
/**
 * LX Precompile addresses (LP-9xxx range)
 * LX prefix naming convention for developer-facing contracts
 * Address format: 0x0000000000000000000000000000000000LPNUM
 */
export declare const LX: {
    /**
     * LXPool (LP-9010)
     * v4 PoolManager-compatible core AMM
     * - Initialize pools
     * - Execute swaps
     * - Modify liquidity
     * - Flash accounting settlement
     */
    readonly LX_POOL: Address;
    /**
     * LXOracle (LP-9011)
     * Multi-source price aggregation
     * - Chainlink, Pyth, TWAP aggregation
     * - Price feed validation
     */
    readonly LX_ORACLE: Address;
    /**
     * LXRouter (LP-9012)
     * Optimized swap routing
     * - exactInputSingle / exactOutputSingle
     * - Multi-hop swaps
     * - Native LUX support
     */
    readonly LX_ROUTER: Address;
    /**
     * LXHooks (LP-9013)
     * Hook contract registry
     * - Register hook contracts
     * - Query hook permissions
     */
    readonly LX_HOOKS: Address;
    /**
     * LXFlash (LP-9014)
     * Flash loan facility
     * - Borrow any token
     * - Repay in same transaction
     */
    readonly LX_FLASH: Address;
    /**
     * LXBook (LP-9020)
     * Permissionless orderbooks + matching + advanced orders
     * - Market factory (createMarket)
     * - Order lifecycle (place/cancel/modify)
     * - Advanced orders (trigger, TWAP)
     * - Book views (L1, order info)
     */
    readonly LX_BOOK: Address;
    /**
     * LXVault (LP-9030)
     * Balances, margin, collateral, liquidations
     * - Token custody
     * - Margin requirements
     * - Position liquidations
     */
    readonly LX_VAULT: Address;
    /**
     * LXFeed (LP-9040)
     * Price feed aggregator
     */
    readonly LX_FEED: Address;
    /**
     * Teleport Bridge (LP-6010)
     * Cross-chain asset teleportation
     */
    readonly TELEPORT: Address;
};
/**
 * Backwards compatibility - old naming convention
 * @deprecated Use LX export instead
 */
export declare const DEX_PRECOMPILES: {
    readonly POOL_MANAGER: `0x${string}`;
    readonly ORACLE_HUB: `0x${string}`;
    readonly SWAP_ROUTER: `0x${string}`;
    readonly HOOKS_REGISTRY: `0x${string}`;
    readonly FLASH_LOAN: `0x${string}`;
    readonly CLOB: `0x${string}`;
    readonly VAULT: `0x${string}`;
    readonly PRICE_FEED: `0x${string}`;
    readonly TELEPORT: `0x${string}`;
};
export type LxdexPrecompile = keyof typeof LX;
export type DexPrecompile = keyof typeof DEX_PRECOMPILES;
/**
 * Generate precompile address from LP number
 * @param lpNumber - The LP number (e.g., 9010)
 * @returns The precompile address
 */
export declare function fromLP(lpNumber: number): Address;
/**
 * Extract LP number from precompile address
 * @param address - The precompile address
 * @returns The LP number
 */
export declare function toLP(address: Address): number;
/**
 * Check if address is a DEX precompile (LP-9xxx range)
 */
export declare function isDEXPrecompile(address: Address): boolean;
/**
 * Check if address is a Bridge precompile (LP-6xxx range)
 */
export declare function isBridgePrecompile(address: Address): boolean;
//# sourceMappingURL=addresses.d.ts.map