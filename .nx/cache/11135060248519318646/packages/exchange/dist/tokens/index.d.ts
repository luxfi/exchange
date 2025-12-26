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
/**
 * Stablecoins
 */
export declare const LUSD: Token;
/**
 * Bridge tokens (L-prefix for assets bridged to Lux)
 */
export declare const LETH: Token;
export declare const LBTC: Token;
/**
 * Default token list for Lux Mainnet
 */
export declare const LUX_MAINNET_TOKENS: Token[];
/**
 * Get wrapped native token for chain
 */
export declare function getWrappedNative(chainId: number): Token | undefined;
/**
 * Check if token is native
 */
export declare function isNativeToken(token: Token): boolean;
//# sourceMappingURL=index.d.ts.map