/**
 * Cross-chain bridge types for XVM ↔ C-Chain atomic swaps
 */

export type CrossChainMintStatus =
  | 'idle'
  | 'initiating'
  | 'locking'
  | 'waiting_confirmation'
  | 'minting'
  | 'swapping'
  | 'complete'
  | 'failed'
  | 'cancelled'

export interface CrossChainMintRequest {
  /** Source chain (XVM) asset ID */
  sourceAsset: `0x${string}`
  /** Amount to bridge (in source chain decimals) */
  amount: bigint
  /** Recipient address on C-Chain */
  recipient: `0x${string}`
  /** Optional: target token on C-Chain (if swap desired) */
  targetToken?: `0x${string}`
  /** Minimum amount to receive (slippage protection) */
  minReceive?: bigint
  /** Deadline timestamp in seconds */
  deadline: number
}

export interface CrossChainMintState {
  /** Unique swap ID from bridge */
  swapId: `0x${string}` | null
  /** Current status of the mint operation */
  status: CrossChainMintStatus
  /** Source transaction hash on X-Chain */
  sourceTxHash: string | null
  /** Mint transaction hash on C-Chain */
  mintTxHash: string | null
  /** Swap transaction hash (if target token specified) */
  swapTxHash: string | null
  /** Error message if failed */
  error: string | null
  /** Timestamp when operation started */
  startedAt: number | null
  /** Timestamp when operation completed */
  completedAt: number | null
}

export interface SwapRoute {
  tokenIn: `0x${string}`
  tokenOut: `0x${string}`
  poolFee: number
  tickSpacing: number
  hooks?: `0x${string}`
}

export interface AtomicSwapConfig {
  /** Network ID for Warp messages */
  networkId: number
  /** XVM chain ID */
  xvmChainId: `0x${string}`
  /** C-Chain ID */
  cChainId: `0x${string}`
  /** Warp precompile address */
  warpPrecompile: `0x${string}`
  /** Atomic swap bridge contract on C-Chain */
  bridgeContract: `0x${string}`
  /** Default deadline in seconds */
  defaultDeadline: number
}

export const DEFAULT_SWAP_CONFIG: AtomicSwapConfig = {
  networkId: 1,
  xvmChainId: '0x0000000000000000000000000000000000000000000000000000000000000000',
  cChainId: '0x0000000000000000000000000000000000000000000000000000000000000000',
  warpPrecompile: '0x0200000000000000000000000000000000000005',
  bridgeContract: '0x0000000000000000000000000000000000000410',
  defaultDeadline: 3600, // 1 hour
}

/**
 * XVM asset mapping to C-Chain wrapped tokens
 */
export interface AssetMapping {
  /** XVM asset ID */
  xvmAssetId: `0x${string}`
  /** C-Chain wrapped token address */
  wrappedToken: `0x${string}`
  /** Token symbol */
  symbol: string
  /** Token decimals (always 6 for XVM) */
  decimals: number
}

/**
 * Well-known asset mappings for Lux mainnet
 */
export const ASSET_MAPPINGS: AssetMapping[] = [
  {
    xvmAssetId: '0x0000000000000000000000000000000000000000000000000000000000000001',
    wrappedToken: '0x0000000000000000000000000000000000000001', // WLUX
    symbol: 'WLUX',
    decimals: 6,
  },
  // Add more mappings as tokens are registered
]

/**
 * Get wrapped token address for an XVM asset
 */
export function getWrappedToken(xvmAssetId: `0x${string}`): `0x${string}` | null {
  const mapping = ASSET_MAPPINGS.find((m) => m.xvmAssetId === xvmAssetId)
  return mapping?.wrappedToken ?? null
}

/**
 * Get XVM asset ID for a wrapped token
 */
export function getXvmAsset(wrappedToken: `0x${string}`): `0x${string}` | null {
  const mapping = ASSET_MAPPINGS.find(
    (m) => m.wrappedToken.toLowerCase() === wrappedToken.toLowerCase()
  )
  return mapping?.xvmAssetId ?? null
}
