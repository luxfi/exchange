import type { Address } from 'viem';
/**
 * Format address to short form
 */
export declare function formatAddress(address: Address, chars?: number): string;
/**
 * Format balance with decimals
 */
export declare function formatBalance(value: bigint, decimals: number, displayDecimals?: number): string;
/**
 * Parse amount string to bigint
 */
export declare function parseAmount(value: string, decimals: number): bigint;
/**
 * Format USD value
 */
export declare function formatUSD(value: number): string;
/**
 * Check if address is valid
 */
export declare function isValidAddress(address: string): address is Address;
/**
 * Calculate price impact
 */
export declare function calculatePriceImpact(inputAmount: bigint, outputAmount: bigint, marketRate: bigint, decimalsIn: number, decimalsOut: number): number;
//# sourceMappingURL=index.d.ts.map