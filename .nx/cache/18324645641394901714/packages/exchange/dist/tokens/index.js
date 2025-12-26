/**
 * Native tokens
 */
export const NATIVE_LUX = {
    address: '0x0000000000000000000000000000000000000000',
    chainId: 96369,
    decimals: 18,
    symbol: 'LUX',
    name: 'LUX',
    isNative: true,
};
export const NATIVE_ZOO = {
    address: '0x0000000000000000000000000000000000000000',
    chainId: 200200,
    decimals: 18,
    symbol: 'ZOO',
    name: 'ZOO',
    isNative: true,
};
/**
 * Wrapped native tokens
 */
export const WLUX_MAINNET = {
    address: '0x55750d6CA62a041c06a8E28626b10Be6c688f471',
    chainId: 96369,
    decimals: 18,
    symbol: 'WLUX',
    name: 'Wrapped LUX',
};
export const WLUX_TESTNET = {
    address: '0x732740c5c895C9FCF619930ed4293fc858eb44c7',
    chainId: 96368,
    decimals: 18,
    symbol: 'WLUX',
    name: 'Wrapped LUX',
};
/**
 * Stablecoins
 */
export const LUSD = {
    address: '0x0000000000000000000000000000000000000000', // TODO: Deploy
    chainId: 96369,
    decimals: 18,
    symbol: 'LUSD',
    name: 'Lux Dollar',
};
/**
 * Bridge tokens (L-prefix for assets bridged to Lux)
 */
export const LETH = {
    address: '0xAA3AE951A7925F25aE8Ad65b052a76Bd8f052598',
    chainId: 96369,
    decimals: 18,
    symbol: 'LETH',
    name: 'Lux ETH',
};
export const LBTC = {
    address: '0x526903Ee6118de6737D11b37f82fC7f69B13685D',
    chainId: 96369,
    decimals: 8,
    symbol: 'LBTC',
    name: 'Lux BTC',
};
/**
 * Default token list for Lux Mainnet
 */
export const LUX_MAINNET_TOKENS = [
    NATIVE_LUX,
    WLUX_MAINNET,
    LETH,
    LBTC,
];
/**
 * Get wrapped native token for chain
 */
export function getWrappedNative(chainId) {
    switch (chainId) {
        case 96369:
            return WLUX_MAINNET;
        case 96368:
            return WLUX_TESTNET;
        default:
            return undefined;
    }
}
/**
 * Check if token is native
 */
export function isNativeToken(token) {
    return token.isNative === true || token.address === '0x0000000000000000000000000000000000000000';
}
