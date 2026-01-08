/**
 * Private Teleport Types
 *
 * Types for cross-chain private teleportation using Z-Chain privacy layer
 * Flow: XVM UTXO → Warp → ZNote (shielded) → Z-Chain AMM (private swap) → C-Chain/XVM
 */
/** Teleport state enum (matches contract) */
export declare enum TeleportState {
    INITIATED = 0,// Waiting for Warp message
    SHIELDED = 1,// ZNote created, amount hidden
    SWAP_COMPLETE = 2,// Private swap completed on Z-Chain AMM
    EXPORTED = 3,// Sending to destination chain
    COMPLETED = 4,// Fully settled
    CANCELLED = 5,// User or timeout cancelled
    EXPIRED = 6
}
/** String state type for backward compatibility */
export type TeleportStateString = 'pending' | 'shielded' | 'swapped' | 'exporting' | 'complete' | 'cancelled' | 'expired';
export interface PrivateTeleportConfig {
    /** Network ID */
    networkId: number;
    /** PrivateTeleport contract address */
    teleportContract: `0x${string}`;
    /** ZNote contract address */
    zNoteContract: `0x${string}`;
    /** ZChainAMM contract address */
    zChainAMMContract: `0x${string}`;
    /** PrivateBridge contract address */
    privateBridgeContract: `0x${string}`;
    /** Warp precompile address */
    warpPrecompile: `0x${string}`;
    /** Default deadline in seconds */
    defaultDeadline: number;
    /** Minimum blocks for shield protection */
    minShieldBlocks: number;
}
export declare const DEFAULT_PRIVATE_TELEPORT_CONFIG: PrivateTeleportConfig;
export interface ChainInfo {
    chainId: `0x${string}`;
    name: string;
    type: 'xvm' | 'cchain' | 'zchain';
}
export declare const LUX_CHAINS: Record<string, ChainInfo>;
/** Pedersen commitment to an amount */
export interface PedersenCommitment {
    commitment: `0x${string}`;
    /** Blinding factor (only known to owner) */
    blindingFactor?: `0x${string}`;
}
/** FHE-encrypted value */
export interface EncryptedValue {
    ciphertext: `0x${string}`;
    /** FHE public key used for encryption */
    publicKey: `0x${string}`;
}
/** Nullifier for spending a note */
export interface Nullifier {
    nullifier: `0x${string}`;
    /** Hash of nullifier for on-chain tracking */
    nullifierHash: `0x${string}`;
}
/** Bulletproof range proof */
export interface RangeProof {
    proof: `0x${string}`;
    /** Commitment being proved */
    commitment: `0x${string}`;
    /** Range in bits (typically 64) */
    rangeBits: number;
}
/** Merkle proof for note membership */
export interface MerkleProof {
    path: `0x${string}`[];
    indices: number[];
    root: `0x${string}`;
}
/** ZNote - UTXO-style shielded note */
export interface ZNote {
    /** Pedersen commitment */
    commitment: `0x${string}`;
    /** FHE-encrypted owner viewing key */
    encryptedOwner: `0x${string}`;
    /** FHE-encrypted value */
    encryptedValue: `0x${string}`;
    /** Asset identifier */
    assetId: `0x${string}`;
    /** Creation timestamp */
    createdAt: bigint;
    /** Note index in Merkle tree */
    noteIndex: number;
}
/** Spend proof for a ZNote */
export interface SpendProof {
    nullifier: `0x${string}`;
    merkleRoot: `0x${string}`;
    merkleProof: `0x${string}`[];
    zkProof: `0x${string}`;
}
/** Request to initiate private teleport */
export interface PrivateTeleportRequest {
    /** Source chain (typically X-Chain) */
    sourceChain: `0x${string}`;
    /** Destination chain */
    destChain: `0x${string}`;
    /** Source asset ID */
    sourceAsset: `0x${string}`;
    /** Destination asset (if swapping) */
    destAsset?: `0x${string}`;
    /** Amount to teleport (plaintext - will be encrypted) */
    amount: bigint;
    /** Recipient address */
    recipient: `0x${string}`;
    /** Deadline timestamp */
    deadline: number;
    /** Whether to perform private swap on Z-Chain */
    privateSwap: boolean;
    /** Minimum output for swap (if privateSwap) */
    minReceive?: bigint;
    /** Pool ID for swap (if privateSwap) */
    poolId?: `0x${string}`;
}
/** Full teleport record with privacy metadata */
export interface TeleportRecord {
    /** Unique teleport ID */
    teleportId: `0x${string}`;
    /** Current state */
    state: TeleportState;
    /** Source chain */
    sourceChain: `0x${string}`;
    /** Destination chain */
    destChain: `0x${string}`;
    /** Source asset */
    sourceAsset: `0x${string}`;
    /** Destination asset */
    destAsset: `0x${string}`;
    /** Pedersen commitment to amount */
    noteCommitment: `0x${string}`;
    /** FHE-encrypted amount */
    encryptedAmount: `0x${string}`;
    /** Nullifier hash (when spent) */
    nullifierHash?: `0x${string}`;
    /** Sender address */
    sender: `0x${string}`;
    /** Recipient address */
    recipient: `0x${string}`;
    /** Deadline timestamp */
    deadline: number;
    /** Block when teleport was created */
    createdBlock: number;
    /** Whether private swap is enabled */
    privateSwap: boolean;
    /** ZNote if created */
    note?: ZNote;
    /** Merkle proof for export */
    merkleProof?: MerkleProof;
    /** Range proof for withdrawal */
    rangeProof?: RangeProof;
}
/** Private pool on Z-Chain AMM */
export interface PrivatePool {
    poolId: `0x${string}`;
    assetA: `0x${string}`;
    assetB: `0x${string}`;
    /** FHE-encrypted reserve A */
    encryptedReserveA: `0x${string}`;
    /** FHE-encrypted reserve B */
    encryptedReserveB: `0x${string}`;
    /** Fee rate in basis points */
    feeRate: number;
    active: boolean;
}
/** Private swap request */
export interface PrivateSwapRequest {
    poolId: `0x${string}`;
    /** FHE-encrypted input amount */
    encryptedInput: `0x${string}`;
    /** FHE-encrypted minimum output */
    encryptedMinOutput: `0x${string}`;
    /** Input note nullifier */
    inputNullifier: `0x${string}`;
    /** Output note commitment */
    outputCommitment: `0x${string}`;
    /** ZK proof of valid swap */
    swapProof: `0x${string}`;
}
/** Warp message for teleport */
export interface TeleportWarpMessage {
    /** Source chain ID */
    sourceChainId: `0x${string}`;
    /** Source asset */
    sourceAsset: `0x${string}`;
    /** Sender address (X-Chain format) */
    sender: string;
    /** Deadline timestamp */
    deadline: number;
    /** Pedersen commitment */
    commitment: `0x${string}`;
    /** FHE-encrypted amount */
    encryptedAmount: `0x${string}`;
    /** BLS aggregated signature */
    signature: `0x${string}`;
    /** Signing validators */
    signers: `0x${string}`[];
}
/** Input for generating Pedersen commitment */
export interface CommitmentInput {
    amount: bigint;
    blindingFactor?: `0x${string}`;
    asset: `0x${string}`;
    nonce?: `0x${string}`;
}
/** Input for generating nullifier */
export interface NullifierInput {
    commitment: `0x${string}`;
    /** Secret spending key */
    spendingKey: `0x${string}`;
    noteIndex: number;
}
/** Input for generating range proof */
export interface RangeProofInput {
    amount: bigint;
    commitment: `0x${string}`;
    blindingFactor: `0x${string}`;
    rangeBits?: number;
}
export declare const PRIVATE_TELEPORT_ABI: readonly [{
    readonly name: "initiateTeleport";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly name: "warpMessage";
        readonly type: "bytes";
    }, {
        readonly name: "commitment";
        readonly type: "bytes32";
    }, {
        readonly name: "encryptedAmount";
        readonly type: "bytes32";
    }, {
        readonly name: "recipient";
        readonly type: "address";
    }, {
        readonly name: "destChain";
        readonly type: "bytes32";
    }, {
        readonly name: "destAsset";
        readonly type: "bytes32";
    }, {
        readonly name: "privateSwap";
        readonly type: "bool";
    }];
    readonly outputs: readonly [{
        readonly name: "teleportId";
        readonly type: "bytes32";
    }];
}, {
    readonly name: "executePrivateSwap";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly name: "teleportId";
        readonly type: "bytes32";
    }, {
        readonly name: "poolId";
        readonly type: "bytes32";
    }, {
        readonly name: "minOutput";
        readonly type: "bytes32";
    }, {
        readonly name: "proof";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "exportToDestination";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly name: "teleportId";
        readonly type: "bytes32";
    }, {
        readonly name: "rangeProof";
        readonly type: "bytes";
    }, {
        readonly name: "nullifier";
        readonly type: "bytes32";
    }, {
        readonly name: "merkleProof";
        readonly type: "bytes32[]";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "unshieldToXChain";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly name: "teleportId";
        readonly type: "bytes32";
    }, {
        readonly name: "destinationAddress";
        readonly type: "bytes";
    }, {
        readonly name: "amount";
        readonly type: "uint64";
    }, {
        readonly name: "nullifier";
        readonly type: "bytes32";
    }, {
        readonly name: "merkleProof";
        readonly type: "bytes32[]";
    }, {
        readonly name: "rangeProof";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "exportTxId";
        readonly type: "bytes32";
    }];
}, {
    readonly name: "privateTransferToRecipient";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly name: "teleportId";
        readonly type: "bytes32";
    }, {
        readonly name: "recipientCommitment";
        readonly type: "bytes32";
    }, {
        readonly name: "encryptedNote";
        readonly type: "bytes";
    }, {
        readonly name: "nullifier";
        readonly type: "bytes32";
    }, {
        readonly name: "merkleProof";
        readonly type: "bytes32[]";
    }, {
        readonly name: "transferProof";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "newNoteIndex";
        readonly type: "uint256";
    }];
}, {
    readonly name: "splitAndTransfer";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly name: "teleportId";
        readonly type: "bytes32";
    }, {
        readonly name: "outputs";
        readonly type: "tuple[]";
        readonly components: readonly [{
            readonly name: "commitment";
            readonly type: "bytes32";
        }, {
            readonly name: "encryptedNote";
            readonly type: "bytes";
        }, {
            readonly name: "encryptedMemo";
            readonly type: "bytes";
        }];
    }, {
        readonly name: "nullifier";
        readonly type: "bytes32";
    }, {
        readonly name: "merkleProof";
        readonly type: "bytes32[]";
    }, {
        readonly name: "splitProof";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [{
        readonly name: "noteIndices";
        readonly type: "uint256[]";
    }];
}, {
    readonly name: "completeTeleport";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly name: "teleportId";
        readonly type: "bytes32";
    }, {
        readonly name: "warpConfirmation";
        readonly type: "bytes";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "cancelTeleport";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly name: "teleportId";
        readonly type: "bytes32";
    }];
    readonly outputs: readonly [];
}, {
    readonly name: "getTeleport";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "teleportId";
        readonly type: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "teleportId";
            readonly type: "bytes32";
        }, {
            readonly name: "state";
            readonly type: "uint8";
        }, {
            readonly name: "sourceChain";
            readonly type: "bytes32";
        }, {
            readonly name: "destChain";
            readonly type: "bytes32";
        }, {
            readonly name: "sourceAsset";
            readonly type: "bytes32";
        }, {
            readonly name: "destAsset";
            readonly type: "bytes32";
        }, {
            readonly name: "noteCommitment";
            readonly type: "bytes32";
        }, {
            readonly name: "encryptedAmount";
            readonly type: "bytes32";
        }, {
            readonly name: "nullifierHash";
            readonly type: "bytes32";
        }, {
            readonly name: "sender";
            readonly type: "address";
        }, {
            readonly name: "recipient";
            readonly type: "address";
        }, {
            readonly name: "deadline";
            readonly type: "uint256";
        }, {
            readonly name: "createdBlock";
            readonly type: "uint256";
        }, {
            readonly name: "privateSwap";
            readonly type: "bool";
        }];
    }];
}, {
    readonly name: "isComplete";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "teleportId";
        readonly type: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
    }];
}, {
    readonly name: "isExpired";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "teleportId";
        readonly type: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
    }];
}];
export declare const ZNOTE_ABI: readonly [{
    readonly name: "importFromXChain";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }, {
        readonly name: "encryptedAmount";
        readonly type: "bytes32";
    }, {
        readonly name: "assetId";
        readonly type: "bytes32";
    }, {
        readonly name: "recipient";
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "noteIndex";
        readonly type: "uint256";
    }];
}, {
    readonly name: "verifyMerkleProof";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "proof";
        readonly type: "bytes32[]";
    }, {
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
    }];
}, {
    readonly name: "getMerkleProof";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "noteIndex";
        readonly type: "uint256";
    }];
    readonly outputs: readonly [{
        readonly name: "proof";
        readonly type: "bytes32[]";
    }];
}, {
    readonly name: "getNoteRoot";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bytes32";
    }];
}, {
    readonly name: "getNote";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "commitment";
        readonly type: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "commitment";
            readonly type: "bytes32";
        }, {
            readonly name: "encryptedOwner";
            readonly type: "bytes";
        }, {
            readonly name: "encryptedValue";
            readonly type: "bytes";
        }, {
            readonly name: "assetId";
            readonly type: "bytes32";
        }, {
            readonly name: "createdAt";
            readonly type: "uint64";
        }];
    }];
}];
export declare const ZCHAIN_AMM_ABI: readonly [{
    readonly name: "swapEncrypted";
    readonly type: "function";
    readonly stateMutability: "nonpayable";
    readonly inputs: readonly [{
        readonly name: "poolId";
        readonly type: "bytes32";
    }, {
        readonly name: "encryptedAmount";
        readonly type: "bytes32";
    }, {
        readonly name: "encryptedMinOutput";
        readonly type: "bytes32";
    }, {
        readonly name: "recipient";
        readonly type: "address";
    }];
    readonly outputs: readonly [{
        readonly name: "outputCommitment";
        readonly type: "bytes32";
    }];
}, {
    readonly name: "verifySwapProof";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "proof";
        readonly type: "bytes";
    }, {
        readonly name: "commitment";
        readonly type: "bytes32";
    }, {
        readonly name: "poolId";
        readonly type: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "bool";
    }];
}, {
    readonly name: "getPool";
    readonly type: "function";
    readonly stateMutability: "view";
    readonly inputs: readonly [{
        readonly name: "poolId";
        readonly type: "bytes32";
    }];
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "tuple";
        readonly components: readonly [{
            readonly name: "poolId";
            readonly type: "bytes32";
        }, {
            readonly name: "assetA";
            readonly type: "bytes32";
        }, {
            readonly name: "assetB";
            readonly type: "bytes32";
        }, {
            readonly name: "feeRate";
            readonly type: "uint16";
        }, {
            readonly name: "active";
            readonly type: "bool";
        }];
    }];
}];
//# sourceMappingURL=private-teleport-types.d.ts.map