import type { Address } from 'viem';
/**
 * Token type definition
 */
export interface Token {
    address: Address;
    chainId: number;
    decimals: number;
    symbol: string;
    name: string;
    logoURI?: string;
    isNative?: boolean;
}
/**
 * Native tokens
 */
export declare const NATIVE_LUX: Token;
export declare const NATIVE_ZOO: Token;
/**
 * Wrapped native tokens
 */
export declare const WLUX_MAINNET: Token;
export declare const WLUX_TESTNET: Token;
export declare const WLUX_DEV: Token;
/**
 * Stablecoins
 */
export declare const LUSD: Token;
/**
 * Bridge tokens (L-prefix for assets bridged to Lux)
 * These are the canonical mainnet addresses from @luxfi/config
 */
export declare const LETH: Token;
export declare const LBTC: Token;
/**
 * Testnet bridge tokens
 */
export declare const LETH_TESTNET: Token;
export declare const LBTC_TESTNET: Token;
export declare const LUSD_TESTNET: Token;
/**
 * Dev mode bridge tokens (deterministic CREATE addresses)
 */
export declare const LETH_DEV: Token;
export declare const LBTC_DEV: Token;
export declare const LUSD_DEV: Token;
/**
 * Major tokens on Lux Mainnet
 */
export declare const USDC_LUX: Token;
export declare const USDT_LUX: Token;
export declare const WETH_LUX: Token;
export declare const WBTC_LUX: Token;
export declare const DAI_LUX: Token;
/**
 * Zoo chain tokens
 */
export declare const WZOO: Token;
export declare const USDC_ZOO: Token;
export declare const USDT_ZOO: Token;
export declare const WETH_ZOO: Token;
/**
 * Default token list for Lux Mainnet
 */
export declare const LUX_MAINNET_TOKENS: Token[];
/**
 * Default token list for Zoo Mainnet
 */
export declare const ZOO_MAINNET_TOKENS: Token[];
/**
 * Default token list for Lux Testnet
 */
export declare const LUX_TESTNET_TOKENS: Token[];
/**
 * Default token list for Lux Dev
 */
export declare const LUX_DEV_TOKENS: Token[];
/**
 * Get tokens for a chain
 */
export declare function getTokensForChain(chainId: number): Token[];
/**
 * Get wrapped native token for chain
 */
export declare function getWrappedNative(chainId: number): Token | undefined;
/**
 * Check if token is native
 */
export declare function isNativeToken(token: Token): boolean;
//# sourceMappingURL=index.d.ts.map