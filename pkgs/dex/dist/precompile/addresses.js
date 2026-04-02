/**
 * LX Precompile addresses (LP-9xxx range)
 * LX prefix naming convention for developer-facing contracts
 * Address format: 0x0000000000000000000000000000000000LPNUM
 */
export const LX = {
    /**
     * LXPool (LP-9010)
     * v4 PoolManager-compatible core AMM
     * - Initialize pools
     * - Execute swaps
     * - Modify liquidity
     * - Flash accounting settlement
     */
    LX_POOL: '0x0000000000000000000000000000000000009010',
    /**
     * LXOracle (LP-9011)
     * Multi-source price aggregation
     * - Chainlink, Pyth, TWAP aggregation
     * - Price feed validation
     */
    LX_ORACLE: '0x0000000000000000000000000000000000009011',
    /**
     * LXRouter (LP-9012)
     * Optimized swap routing
     * - exactInputSingle / exactOutputSingle
     * - Multi-hop swaps
     * - Native LUX support
     */
    LX_ROUTER: '0x0000000000000000000000000000000000009012',
    /**
     * LXHooks (LP-9013)
     * Hook contract registry
     * - Register hook contracts
     * - Query hook permissions
     */
    LX_HOOKS: '0x0000000000000000000000000000000000009013',
    /**
     * LXFlash (LP-9014)
     * Flash loan facility
     * - Borrow any token
     * - Repay in same transaction
     */
    LX_FLASH: '0x0000000000000000000000000000000000009014',
    /**
     * LXBook (LP-9020)
     * Permissionless orderbooks + matching + advanced orders
     * - Market factory (createMarket)
     * - Order lifecycle (place/cancel/modify)
     * - Advanced orders (trigger, TWAP)
     * - Book views (L1, order info)
     */
    LX_BOOK: '0x0000000000000000000000000000000000009020',
    /**
     * LXVault (LP-9030)
     * Balances, margin, collateral, liquidations
     * - Token custody
     * - Margin requirements
     * - Position liquidations
     */
    LX_VAULT: '0x0000000000000000000000000000000000009030',
    /**
     * LXFeed (LP-9040)
     * Price feed aggregator
     */
    LX_FEED: '0x0000000000000000000000000000000000009040',
    /**
     * Teleport Bridge (LP-6010)
     * Cross-chain asset teleportation
     */
    TELEPORT: '0x0000000000000000000000000000000000006010',
};
/**
 * Backwards compatibility - old naming convention
 * @deprecated Use LX export instead
 */
export const DEX_PRECOMPILES = {
    POOL_MANAGER: LX.LX_POOL,
    ORACLE_HUB: LX.LX_ORACLE,
    SWAP_ROUTER: LX.LX_ROUTER,
    HOOKS_REGISTRY: LX.LX_HOOKS,
    FLASH_LOAN: LX.LX_FLASH,
    CLOB: LX.LX_BOOK,
    VAULT: LX.LX_VAULT,
    PRICE_FEED: LX.LX_FEED,
    TELEPORT: LX.TELEPORT,
};
/**
 * Generate precompile address from LP number
 * @param lpNumber - The LP number (e.g., 9010)
 * @returns The precompile address
 */
export function fromLP(lpNumber) {
    return `0x${lpNumber.toString(16).padStart(40, '0')}`;
}
/**
 * Extract LP number from precompile address
 * @param address - The precompile address
 * @returns The LP number
 */
export function toLP(address) {
    return parseInt(address.slice(-4), 16);
}
/**
 * Check if address is a DEX precompile (LP-9xxx range)
 */
export function isDEXPrecompile(address) {
    const lp = toLP(address);
    return lp >= 9000 && lp < 10000;
}
/**
 * Check if address is a Bridge precompile (LP-6xxx range)
 */
export function isBridgePrecompile(address) {
    const lp = toLP(address);
    return lp >= 6000 && lp < 7000;
}
