/**
 * Private Teleport Types
 *
 * Types for cross-chain private teleportation using Z-Chain privacy layer
 * Flow: XVM UTXO → Warp → ZNote (shielded) → Z-Chain AMM (private swap) → C-Chain/XVM
 */
// ═══════════════════════════════════════════════════════════════════════════
// TELEPORT STATE
// ═══════════════════════════════════════════════════════════════════════════
/** Teleport state enum (matches contract) */
export var TeleportState;
(function (TeleportState) {
    TeleportState[TeleportState["INITIATED"] = 0] = "INITIATED";
    TeleportState[TeleportState["SHIELDED"] = 1] = "SHIELDED";
    TeleportState[TeleportState["SWAP_COMPLETE"] = 2] = "SWAP_COMPLETE";
    TeleportState[TeleportState["EXPORTED"] = 3] = "EXPORTED";
    TeleportState[TeleportState["COMPLETED"] = 4] = "COMPLETED";
    TeleportState[TeleportState["CANCELLED"] = 5] = "CANCELLED";
    TeleportState[TeleportState["EXPIRED"] = 6] = "EXPIRED";
})(TeleportState || (TeleportState = {}));
export const DEFAULT_PRIVATE_TELEPORT_CONFIG = {
    networkId: 1,
    teleportContract: '0x0000000000000000000000000000000000000420',
    zNoteContract: '0x0000000000000000000000000000000000000421',
    zChainAMMContract: '0x0000000000000000000000000000000000000422',
    privateBridgeContract: '0x0000000000000000000000000000000000000423',
    warpPrecompile: '0x0200000000000000000000000000000000000005',
    defaultDeadline: 3600,
    minShieldBlocks: 5,
};
export const LUX_CHAINS = {
    xChain: {
        chainId: '0x0000000000000000000000000000000000000000000000000000000000000000',
        name: 'X-Chain (XVM)',
        type: 'xvm',
    },
    cChain: {
        chainId: '0x0000000000000000000000000000000000000000000000000000000000000001',
        name: 'C-Chain (EVM)',
        type: 'cchain',
    },
    zChain: {
        chainId: '0x0000000000000000000000000000000000000000000000000000000000000002',
        name: 'Z-Chain (Privacy)',
        type: 'zchain',
    },
};
// ═══════════════════════════════════════════════════════════════════════════
// CONTRACT ABIS (PARTIAL)
// ═══════════════════════════════════════════════════════════════════════════
export const PRIVATE_TELEPORT_ABI = [
    // ═══════════════════════════════════════════════════════════════════════════
    // INITIATE & SWAP
    // ═══════════════════════════════════════════════════════════════════════════
    {
        name: 'initiateTeleport',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'warpMessage', type: 'bytes' },
            { name: 'commitment', type: 'bytes32' },
            { name: 'encryptedAmount', type: 'bytes32' },
            { name: 'recipient', type: 'address' },
            { name: 'destChain', type: 'bytes32' },
            { name: 'destAsset', type: 'bytes32' },
            { name: 'privateSwap', type: 'bool' },
        ],
        outputs: [{ name: 'teleportId', type: 'bytes32' }],
    },
    {
        name: 'executePrivateSwap',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'teleportId', type: 'bytes32' },
            { name: 'poolId', type: 'bytes32' },
            { name: 'minOutput', type: 'bytes32' },
            { name: 'proof', type: 'bytes' },
        ],
        outputs: [],
    },
    // ═══════════════════════════════════════════════════════════════════════════
    // EXPORT (UNSHIELD)
    // ═══════════════════════════════════════════════════════════════════════════
    {
        name: 'exportToDestination',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'teleportId', type: 'bytes32' },
            { name: 'rangeProof', type: 'bytes' },
            { name: 'nullifier', type: 'bytes32' },
            { name: 'merkleProof', type: 'bytes32[]' },
        ],
        outputs: [],
    },
    {
        name: 'unshieldToXChain',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'teleportId', type: 'bytes32' },
            { name: 'destinationAddress', type: 'bytes' },
            { name: 'amount', type: 'uint64' },
            { name: 'nullifier', type: 'bytes32' },
            { name: 'merkleProof', type: 'bytes32[]' },
            { name: 'rangeProof', type: 'bytes' },
        ],
        outputs: [{ name: 'exportTxId', type: 'bytes32' }],
    },
    // ═══════════════════════════════════════════════════════════════════════════
    // PRIVATE TRANSFERS (STAY SHIELDED)
    // ═══════════════════════════════════════════════════════════════════════════
    {
        name: 'privateTransferToRecipient',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'teleportId', type: 'bytes32' },
            { name: 'recipientCommitment', type: 'bytes32' },
            { name: 'encryptedNote', type: 'bytes' },
            { name: 'nullifier', type: 'bytes32' },
            { name: 'merkleProof', type: 'bytes32[]' },
            { name: 'transferProof', type: 'bytes' },
        ],
        outputs: [{ name: 'newNoteIndex', type: 'uint256' }],
    },
    {
        name: 'splitAndTransfer',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'teleportId', type: 'bytes32' },
            { name: 'outputs', type: 'tuple[]', components: [
                    { name: 'commitment', type: 'bytes32' },
                    { name: 'encryptedNote', type: 'bytes' },
                    { name: 'encryptedMemo', type: 'bytes' },
                ] },
            { name: 'nullifier', type: 'bytes32' },
            { name: 'merkleProof', type: 'bytes32[]' },
            { name: 'splitProof', type: 'bytes' },
        ],
        outputs: [{ name: 'noteIndices', type: 'uint256[]' }],
    },
    // ═══════════════════════════════════════════════════════════════════════════
    // COMPLETE & CANCEL
    // ═══════════════════════════════════════════════════════════════════════════
    {
        name: 'completeTeleport',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'teleportId', type: 'bytes32' },
            { name: 'warpConfirmation', type: 'bytes' },
        ],
        outputs: [],
    },
    {
        name: 'cancelTeleport',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [{ name: 'teleportId', type: 'bytes32' }],
        outputs: [],
    },
    {
        name: 'getTeleport',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'teleportId', type: 'bytes32' }],
        outputs: [
            {
                name: '',
                type: 'tuple',
                components: [
                    { name: 'teleportId', type: 'bytes32' },
                    { name: 'state', type: 'uint8' },
                    { name: 'sourceChain', type: 'bytes32' },
                    { name: 'destChain', type: 'bytes32' },
                    { name: 'sourceAsset', type: 'bytes32' },
                    { name: 'destAsset', type: 'bytes32' },
                    { name: 'noteCommitment', type: 'bytes32' },
                    { name: 'encryptedAmount', type: 'bytes32' },
                    { name: 'nullifierHash', type: 'bytes32' },
                    { name: 'sender', type: 'address' },
                    { name: 'recipient', type: 'address' },
                    { name: 'deadline', type: 'uint256' },
                    { name: 'createdBlock', type: 'uint256' },
                    { name: 'privateSwap', type: 'bool' },
                ],
            },
        ],
    },
    {
        name: 'isComplete',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'teleportId', type: 'bytes32' }],
        outputs: [{ name: '', type: 'bool' }],
    },
    {
        name: 'isExpired',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'teleportId', type: 'bytes32' }],
        outputs: [{ name: '', type: 'bool' }],
    },
];
export const ZNOTE_ABI = [
    {
        name: 'importFromXChain',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'commitment', type: 'bytes32' },
            { name: 'encryptedAmount', type: 'bytes32' },
            { name: 'assetId', type: 'bytes32' },
            { name: 'recipient', type: 'address' },
        ],
        outputs: [{ name: 'noteIndex', type: 'uint256' }],
    },
    {
        name: 'verifyMerkleProof',
        type: 'function',
        stateMutability: 'view',
        inputs: [
            { name: 'proof', type: 'bytes32[]' },
            { name: 'commitment', type: 'bytes32' },
        ],
        outputs: [{ name: '', type: 'bool' }],
    },
    {
        name: 'getMerkleProof',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'noteIndex', type: 'uint256' }],
        outputs: [{ name: 'proof', type: 'bytes32[]' }],
    },
    {
        name: 'getNoteRoot',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [{ name: '', type: 'bytes32' }],
    },
    {
        name: 'getNote',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'commitment', type: 'bytes32' }],
        outputs: [
            {
                name: '',
                type: 'tuple',
                components: [
                    { name: 'commitment', type: 'bytes32' },
                    { name: 'encryptedOwner', type: 'bytes' },
                    { name: 'encryptedValue', type: 'bytes' },
                    { name: 'assetId', type: 'bytes32' },
                    { name: 'createdAt', type: 'uint64' },
                ],
            },
        ],
    },
];
export const ZCHAIN_AMM_ABI = [
    {
        name: 'swapEncrypted',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'poolId', type: 'bytes32' },
            { name: 'encryptedAmount', type: 'bytes32' },
            { name: 'encryptedMinOutput', type: 'bytes32' },
            { name: 'recipient', type: 'address' },
        ],
        outputs: [{ name: 'outputCommitment', type: 'bytes32' }],
    },
    {
        name: 'verifySwapProof',
        type: 'function',
        stateMutability: 'view',
        inputs: [
            { name: 'proof', type: 'bytes' },
            { name: 'commitment', type: 'bytes32' },
            { name: 'poolId', type: 'bytes32' },
        ],
        outputs: [{ name: '', type: 'bool' }],
    },
    {
        name: 'getPool',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'poolId', type: 'bytes32' }],
        outputs: [
            {
                name: '',
                type: 'tuple',
                components: [
                    { name: 'poolId', type: 'bytes32' },
                    { name: 'assetA', type: 'bytes32' },
                    { name: 'assetB', type: 'bytes32' },
                    { name: 'feeRate', type: 'uint16' },
                    { name: 'active', type: 'bool' },
                ],
            },
        ],
    },
];
