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
export enum TeleportState {
  INITIATED = 0,      // Waiting for Warp message
  SHIELDED = 1,       // ZNote created, amount hidden
  SWAP_COMPLETE = 2,  // Private swap completed on Z-Chain AMM
  EXPORTED = 3,       // Sending to destination chain
  COMPLETED = 4,      // Fully settled
  CANCELLED = 5,      // User or timeout cancelled
  EXPIRED = 6,        // Deadline passed
}

/** String state type for backward compatibility */
export type TeleportStateString =
  | 'pending'       // Waiting for Warp message
  | 'shielded'      // ZNote created, amount hidden
  | 'swapped'       // Private swap completed on Z-Chain AMM
  | 'exporting'     // Sending to destination chain
  | 'complete'      // Fully settled
  | 'cancelled'     // User or timeout cancelled
  | 'expired'       // Deadline passed

// ═══════════════════════════════════════════════════════════════════════════
// TELEPORT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════

export interface PrivateTeleportConfig {
  /** Network ID */
  networkId: number
  /** PrivateTeleport contract address */
  teleportContract: `0x${string}`
  /** ZNote contract address */
  zNoteContract: `0x${string}`
  /** ZChainAMM contract address */
  zChainAMMContract: `0x${string}`
  /** PrivateBridge contract address */
  privateBridgeContract: `0x${string}`
  /** Warp precompile address */
  warpPrecompile: `0x${string}`
  /** Default deadline in seconds */
  defaultDeadline: number
  /** Minimum blocks for shield protection */
  minShieldBlocks: number
}

export const DEFAULT_PRIVATE_TELEPORT_CONFIG: PrivateTeleportConfig = {
  networkId: 1,
  teleportContract: '0x0000000000000000000000000000000000000420',
  zNoteContract: '0x0000000000000000000000000000000000000421',
  zChainAMMContract: '0x0000000000000000000000000000000000000422',
  privateBridgeContract: '0x0000000000000000000000000000000000000423',
  warpPrecompile: '0x0200000000000000000000000000000000000005',
  defaultDeadline: 3600,
  minShieldBlocks: 5,
}

// ═══════════════════════════════════════════════════════════════════════════
// CHAIN IDENTIFIERS
// ═══════════════════════════════════════════════════════════════════════════

export interface ChainInfo {
  chainId: `0x${string}`
  name: string
  type: 'xvm' | 'cchain' | 'zchain'
}

export const LUX_CHAINS: Record<string, ChainInfo> = {
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
}

// ═══════════════════════════════════════════════════════════════════════════
// PRIVACY PRIMITIVES
// ═══════════════════════════════════════════════════════════════════════════

/** Pedersen commitment to an amount */
export interface PedersenCommitment {
  commitment: `0x${string}`
  /** Blinding factor (only known to owner) */
  blindingFactor?: `0x${string}`
}

/** FHE-encrypted value */
export interface EncryptedValue {
  ciphertext: `0x${string}`
  /** FHE public key used for encryption */
  publicKey: `0x${string}`
}

/** Nullifier for spending a note */
export interface Nullifier {
  nullifier: `0x${string}`
  /** Hash of nullifier for on-chain tracking */
  nullifierHash: `0x${string}`
}

/** Bulletproof range proof */
export interface RangeProof {
  proof: `0x${string}`
  /** Commitment being proved */
  commitment: `0x${string}`
  /** Range in bits (typically 64) */
  rangeBits: number
}

/** Merkle proof for note membership */
export interface MerkleProof {
  path: `0x${string}`[]
  indices: number[]
  root: `0x${string}`
}

// ═══════════════════════════════════════════════════════════════════════════
// ZNOTE TYPES
// ═══════════════════════════════════════════════════════════════════════════

/** ZNote - UTXO-style shielded note */
export interface ZNote {
  /** Pedersen commitment */
  commitment: `0x${string}`
  /** FHE-encrypted owner viewing key */
  encryptedOwner: `0x${string}`
  /** FHE-encrypted value */
  encryptedValue: `0x${string}`
  /** Asset identifier */
  assetId: `0x${string}`
  /** Creation timestamp */
  createdAt: bigint
  /** Note index in Merkle tree */
  noteIndex: number
}

/** Spend proof for a ZNote */
export interface SpendProof {
  nullifier: `0x${string}`
  merkleRoot: `0x${string}`
  merkleProof: `0x${string}`[]
  zkProof: `0x${string}`
}

// ═══════════════════════════════════════════════════════════════════════════
// TELEPORT REQUEST/RECORD
// ═══════════════════════════════════════════════════════════════════════════

/** Request to initiate private teleport */
export interface PrivateTeleportRequest {
  /** Source chain (typically X-Chain) */
  sourceChain: `0x${string}`
  /** Destination chain */
  destChain: `0x${string}`
  /** Source asset ID */
  sourceAsset: `0x${string}`
  /** Destination asset (if swapping) */
  destAsset?: `0x${string}`
  /** Amount to teleport (plaintext - will be encrypted) */
  amount: bigint
  /** Recipient address */
  recipient: `0x${string}`
  /** Deadline timestamp */
  deadline: number
  /** Whether to perform private swap on Z-Chain */
  privateSwap: boolean
  /** Minimum output for swap (if privateSwap) */
  minReceive?: bigint
  /** Pool ID for swap (if privateSwap) */
  poolId?: `0x${string}`
}

/** Full teleport record with privacy metadata */
export interface TeleportRecord {
  /** Unique teleport ID */
  teleportId: `0x${string}`
  /** Current state */
  state: TeleportState
  /** Source chain */
  sourceChain: `0x${string}`
  /** Destination chain */
  destChain: `0x${string}`
  /** Source asset */
  sourceAsset: `0x${string}`
  /** Destination asset */
  destAsset: `0x${string}`
  /** Pedersen commitment to amount */
  noteCommitment: `0x${string}`
  /** FHE-encrypted amount */
  encryptedAmount: `0x${string}`
  /** Nullifier hash (when spent) */
  nullifierHash?: `0x${string}`
  /** Sender address */
  sender: `0x${string}`
  /** Recipient address */
  recipient: `0x${string}`
  /** Deadline timestamp */
  deadline: number
  /** Block when teleport was created */
  createdBlock: number
  /** Whether private swap is enabled */
  privateSwap: boolean
  /** ZNote if created */
  note?: ZNote
  /** Merkle proof for export */
  merkleProof?: MerkleProof
  /** Range proof for withdrawal */
  rangeProof?: RangeProof
}

// ═══════════════════════════════════════════════════════════════════════════
// Z-CHAIN AMM TYPES
// ═══════════════════════════════════════════════════════════════════════════

/** Private pool on Z-Chain AMM */
export interface PrivatePool {
  poolId: `0x${string}`
  assetA: `0x${string}`
  assetB: `0x${string}`
  /** FHE-encrypted reserve A */
  encryptedReserveA: `0x${string}`
  /** FHE-encrypted reserve B */
  encryptedReserveB: `0x${string}`
  /** Fee rate in basis points */
  feeRate: number
  active: boolean
}

/** Private swap request */
export interface PrivateSwapRequest {
  poolId: `0x${string}`
  /** FHE-encrypted input amount */
  encryptedInput: `0x${string}`
  /** FHE-encrypted minimum output */
  encryptedMinOutput: `0x${string}`
  /** Input note nullifier */
  inputNullifier: `0x${string}`
  /** Output note commitment */
  outputCommitment: `0x${string}`
  /** ZK proof of valid swap */
  swapProof: `0x${string}`
}

// ═══════════════════════════════════════════════════════════════════════════
// WARP MESSAGE TYPES
// ═══════════════════════════════════════════════════════════════════════════

/** Warp message for teleport */
export interface TeleportWarpMessage {
  /** Source chain ID */
  sourceChainId: `0x${string}`
  /** Source asset */
  sourceAsset: `0x${string}`
  /** Sender address (X-Chain format) */
  sender: string
  /** Deadline timestamp */
  deadline: number
  /** Pedersen commitment */
  commitment: `0x${string}`
  /** FHE-encrypted amount */
  encryptedAmount: `0x${string}`
  /** BLS aggregated signature */
  signature: `0x${string}`
  /** Signing validators */
  signers: `0x${string}`[]
}

// ═══════════════════════════════════════════════════════════════════════════
// PROOF GENERATION
// ═══════════════════════════════════════════════════════════════════════════

/** Input for generating Pedersen commitment */
export interface CommitmentInput {
  amount: bigint
  blindingFactor?: `0x${string}`
  asset: `0x${string}`
  nonce?: `0x${string}`
}

/** Input for generating nullifier */
export interface NullifierInput {
  commitment: `0x${string}`
  /** Secret spending key */
  spendingKey: `0x${string}`
  noteIndex: number
}

/** Input for generating range proof */
export interface RangeProofInput {
  amount: bigint
  commitment: `0x${string}`
  blindingFactor: `0x${string}`
  rangeBits?: number // Default 64
}

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
      ]},
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
] as const

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
] as const

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
] as const
