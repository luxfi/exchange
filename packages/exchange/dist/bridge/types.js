/**
 * Cross-chain bridge types for XVM ↔ C-Chain atomic swaps
 */
export const DEFAULT_SWAP_CONFIG = {
    networkId: 1,
    xvmChainId: '0x0000000000000000000000000000000000000000000000000000000000000000',
    cChainId: '0x0000000000000000000000000000000000000000000000000000000000000000',
    warpPrecompile: '0x0200000000000000000000000000000000000005',
    bridgeContract: '0x0000000000000000000000000000000000000410',
    defaultDeadline: 3600, // 1 hour
};
/**
 * Well-known asset mappings for Lux mainnet
 */
export const ASSET_MAPPINGS = [
    {
        xvmAssetId: '0x0000000000000000000000000000000000000000000000000000000000000001',
        wrappedToken: '0x0000000000000000000000000000000000000001', // WLUX
        symbol: 'WLUX',
        decimals: 6,
    },
    // Add more mappings as tokens are registered
];
/**
 * Get wrapped token address for an XVM asset
 */
export function getWrappedToken(xvmAssetId) {
    const mapping = ASSET_MAPPINGS.find((m) => m.xvmAssetId === xvmAssetId);
    return mapping?.wrappedToken ?? null;
}
/**
 * Get XVM asset ID for a wrapped token
 */
export function getXvmAsset(wrappedToken) {
    const mapping = ASSET_MAPPINGS.find((m) => m.wrappedToken.toLowerCase() === wrappedToken.toLowerCase());
    return mapping?.xvmAssetId ?? null;
}
