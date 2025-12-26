import type { Address } from 'viem';
export interface TokenPrice {
    address: Address;
    priceUSD: number;
    change24h: number;
}
/**
 * Fetch token price in USD
 */
export declare function useTokenPrice(address: Address | undefined, chainId: number): import("@tanstack/react-query").UseQueryResult<TokenPrice | null, Error>;
/**
 * Fetch multiple token prices
 */
export declare function useTokenPrices(addresses: Address[], chainId: number): import("@tanstack/react-query").UseQueryResult<Map<`0x${string}`, TokenPrice>, Error>;
//# sourceMappingURL=use-token-price.d.ts.map