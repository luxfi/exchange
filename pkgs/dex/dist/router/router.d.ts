/**
 * Omnichain Router
 * Routes orders between CLOB and AMM for best execution
 */
import type { PublicClient } from 'viem';
import type { ICLOBClient } from '../client/types';
import type { RouterConfig, QuoteRequest, Quote, SwapRequest, SwapResult } from './types';
/**
 * Omnichain Router
 * Best execution routing between CLOB and AMM
 */
export declare class OmnichainRouter {
    private config;
    private publicClient;
    private clobClient;
    constructor(config?: Partial<RouterConfig>);
    /**
     * Set the public client for AMM interactions
     */
    setPublicClient(client: PublicClient): void;
    /**
     * Set the CLOB client
     */
    setCLOBClient(client: ICLOBClient): void;
    /**
     * Get a quote for a swap
     */
    getQuote(request: QuoteRequest): Promise<Quote>;
    /**
     * Get AMM quote using precompiles
     */
    private getAMMQuote;
    /**
     * Get CLOB quote
     */
    private getCLOBQuote;
    /**
     * Convert token addresses to trading symbol
     */
    private getSymbol;
    /**
     * Execute a swap
     */
    executeSwap(request: SwapRequest): Promise<SwapResult>;
    /**
     * Execute AMM swap via precompile
     */
    private executeAMMSwap;
    /**
     * Execute CLOB swap
     */
    private executeCLOBSwap;
}
/**
 * Create an omnichain router instance
 */
export declare function createRouter(config?: Partial<RouterConfig>): OmnichainRouter;
//# sourceMappingURL=router.d.ts.map