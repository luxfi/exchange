import { QueryClient } from '@tanstack/react-query';
/**
 * Create a React Query client with Lux Exchange defaults
 */
export declare function createQueryClient(): QueryClient;
/**
 * API base URLs
 */
export declare const API_URLS: {
    readonly TOKEN_LIST: "https://tokens.lux.network";
    readonly PRICE_API: "https://api.lux.network/prices";
    readonly ANALYTICS_API: "https://api.lux.network/analytics";
    readonly V2_SUBGRAPH: "https://api.lux.network/subgraphs/exchange-v2";
    readonly V3_SUBGRAPH: "https://api.lux.network/subgraphs/exchange-v3";
};
/**
 * Fetch with timeout
 */
export declare function fetchWithTimeout(url: string, options?: RequestInit & {
    timeout?: number;
}): Promise<Response>;
//# sourceMappingURL=client.d.ts.map