/**
 * Private Teleport Hook
 *
 * React hook for cross-chain private teleportation
 * Enables: XVM UTXO → ZNote (shielded) → Z-Chain AMM → destination
 */
import { type PrivateTeleportConfig, type PrivateTeleportRequest, type TeleportRecord, TeleportState } from './private-teleport-types';
export interface UsePrivateTeleportOptions {
    /** Custom config */
    config?: Partial<PrivateTeleportConfig>;
    /** Enable auto-polling for teleport status */
    pollInterval?: number;
    /** Callback when teleport state changes */
    onStateChange?: (teleportId: string, state: TeleportState) => void;
}
/** Private transfer request to another recipient */
export interface PrivateTransferRequest {
    teleportId: string;
    /** Recipient's viewing public key (for note encryption) */
    recipientViewKey: `0x${string}`;
    /** Amount to send (will generate new commitment) */
    amount: bigint;
    /** Optional: change amount back to sender */
    changeAmount?: bigint;
}
/** Unshield request to X-Chain */
export interface UnshieldToXChainRequest {
    teleportId: string;
    /** X-Chain destination address (bech32 format) */
    destinationAddress: string;
    /** Amount to unshield (must match commitment) */
    amount: bigint;
}
export interface UsePrivateTeleportReturn {
    /** Initiate a private teleport */
    teleport: (request: PrivateTeleportRequest) => Promise<string>;
    /** Execute private swap on Z-Chain AMM */
    executeSwap: (teleportId: string, poolId: string, minOutput: bigint) => Promise<void>;
    /** Export to C-Chain (unshield) */
    exportToDestination: (teleportId: string) => Promise<void>;
    /** Unshield back to X-Chain UTXO */
    unshieldToXChain: (request: UnshieldToXChainRequest) => Promise<string>;
    /** Private transfer to another recipient (stays shielded) */
    privateTransfer: (request: PrivateTransferRequest) => Promise<number>;
    /** Split note into payment + change */
    splitAndTransfer: (teleportId: string, outputs: Array<{
        recipient: `0x${string}`;
        amount: bigint;
    }>) => Promise<number[]>;
    /** Complete teleport after confirmation */
    completeTeleport: (teleportId: string, warpConfirmation: `0x${string}`) => Promise<void>;
    /** Cancel teleport */
    cancelTeleport: (teleportId: string) => Promise<void>;
    /** Get teleport record */
    getTeleport: (teleportId: string) => Promise<TeleportRecord | null>;
    /** Check if teleport is complete */
    isComplete: (teleportId: string) => Promise<boolean>;
    /** Current teleport ID (if any) */
    currentTeleportId: string | null;
    /** Current teleport state */
    currentState: TeleportState | null;
    /** Loading state */
    isLoading: boolean;
    /** Error state */
    error: Error | null;
}
export declare function usePrivateTeleport(options?: UsePrivateTeleportOptions): UsePrivateTeleportReturn;
export type { PrivateTeleportRequest, TeleportRecord, TeleportState, PrivateTeleportConfig, } from './private-teleport-types';
//# sourceMappingURL=use-private-teleport.d.ts.map