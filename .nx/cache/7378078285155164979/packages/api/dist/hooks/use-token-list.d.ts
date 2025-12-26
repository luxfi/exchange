export interface TokenListToken {
    address: string;
    chainId: number;
    decimals: number;
    symbol: string;
    name: string;
    logoURI?: string;
}
export interface TokenList {
    name: string;
    tokens: TokenListToken[];
    version: {
        major: number;
        minor: number;
        patch: number;
    };
}
/**
 * Fetch and cache token list
 */
export declare function useTokenList(chainId: number): import("@tanstack/react-query").UseQueryResult<TokenListToken[], Error>;
//# sourceMappingURL=use-token-list.d.ts.map