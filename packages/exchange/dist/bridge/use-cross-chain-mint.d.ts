/**
 * React hook for one-click cross-chain minting
 *
 * Enables users to mint wrapped tokens on C-Chain from X-Chain assets
 * with a single transaction using Warp atomic swaps.
 */
import { type CrossChainStore } from './cross-chain-store';
import type { CrossChainMintRequest, CrossChainMintState, AtomicSwapConfig } from './types';
export interface UseCrossChainMintOptions {
    /** Configuration overrides */
    config?: Partial<AtomicSwapConfig>;
    /** Poll interval for status updates (ms) */
    pollInterval?: number;
}
export interface UseCrossChainMintReturn {
    /** Initiate a cross-chain mint */
    mint: (request: Omit<CrossChainMintRequest, 'deadline'> & {
        deadline?: number;
    }) => Promise<string>;
    /** Cancel a pending mint after deadline */
    cancel: (swapId: string) => Promise<void>;
    /** Current state of a mint by swap ID */
    getMintState: (swapId: string) => CrossChainMintState | undefined;
    /** All active mints */
    activeMints: CrossChainStore['pendingMints'];
    /** Recent completed mints */
    recentMints: CrossChainStore['recentMints'];
    /** Loading state */
    isLoading: boolean;
    /** Error message */
    error: string | null;
}
export declare function useCrossChainMint(options?: UseCrossChainMintOptions): UseCrossChainMintReturn;
//# sourceMappingURL=use-cross-chain-mint.d.ts.map