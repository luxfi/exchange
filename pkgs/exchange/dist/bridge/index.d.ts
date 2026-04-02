/**
 * Cross-chain bridge module for XVM ↔ C-Chain atomic swaps
 *
 * Enables one-click minting of wrapped tokens on C-Chain from X-Chain assets
 * using Warp cross-chain messaging and HTLC atomic swaps.
 *
 * Includes Z-Chain privacy layer for fully shielded cross-chain teleportation:
 * XVM UTXO → ZNote (shielded) → Z-Chain AMM (private swap) → destination
 *
 * @example
 * ```tsx
 * // Standard cross-chain mint
 * import { useCrossChainMint } from '@luxfi/exchange/bridge'
 *
 * function MintButton() {
 *   const { mint, isLoading } = useCrossChainMint()
 *
 *   const handleMint = async () => {
 *     const swapId = await mint({
 *       sourceAsset: '0x...', // XVM asset ID
 *       amount: 1000000n,     // 1 token (6 decimals)
 *       recipient: '0x...',   // C-Chain recipient
 *       targetToken: '0x...', // Optional: swap to this token
 *       minReceive: 990000n,  // Slippage protection
 *     })
 *     console.log('Mint initiated:', swapId)
 *   }
 *
 *   return (
 *     <button onClick={handleMint} disabled={isLoading}>
 *       {isLoading ? 'Minting...' : 'Mint on C-Chain'}
 *     </button>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Private teleport with Z-Chain
 * import { usePrivateTeleport } from '@luxfi/exchange/bridge'
 *
 * function PrivateTeleportButton() {
 *   const { teleport, executeSwap, exportToDestination, isLoading } = usePrivateTeleport()
 *
 *   const handlePrivateTeleport = async () => {
 *     // 1. Initiate shielded teleport (creates ZNote)
 *     const teleportId = await teleport({
 *       sourceChain: '0x...', // X-Chain ID
 *       destChain: '0x...',   // C-Chain ID
 *       sourceAsset: '0x...', // Asset to teleport
 *       destAsset: '0x...',   // Asset to receive (if swapping)
 *       amount: 1000000n,     // Amount (will be encrypted)
 *       recipient: '0x...',   // Destination address
 *       deadline: Math.floor(Date.now() / 1000) + 3600,
 *       privateSwap: true,    // Use Z-Chain AMM for private swap
 *     })
 *
 *     // 2. Execute private swap on Z-Chain (optional)
 *     await executeSwap(teleportId, '0x...poolId', 990000n)
 *
 *     // 3. Export to destination chain with range proof
 *     await exportToDestination(teleportId)
 *   }
 *
 *   return (
 *     <button onClick={handlePrivateTeleport} disabled={isLoading}>
 *       Private Teleport
 *     </button>
 *   )
 * }
 * ```
 */
export * from './types';
export * from './cross-chain-store';
export * from './use-cross-chain-mint';
export * from './private-teleport-types';
export * from './use-private-teleport';
//# sourceMappingURL=index.d.ts.map