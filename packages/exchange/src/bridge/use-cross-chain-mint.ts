/**
 * React hook for one-click cross-chain minting
 *
 * Enables users to mint wrapped tokens on C-Chain from X-Chain assets
 * with a single transaction using Warp atomic swaps.
 */

import { useCallback, useEffect, useState } from 'react'
import { usePublicClient, useWalletClient } from 'wagmi'
import { encodeFunctionData, parseAbi } from 'viem'
import { useCrossChainStore, type CrossChainStore } from './cross-chain-store'
import type {
  CrossChainMintRequest,
  CrossChainMintState,
  CrossChainMintStatus,
  SwapRoute,
  AtomicSwapConfig,
} from './types'
import { DEFAULT_SWAP_CONFIG, getWrappedToken } from './types'

// AtomicSwapBridge contract ABI (minimal interface)
const BRIDGE_ABI = parseAbi([
  'function initiateMint(bytes32 swapId, address recipient, bytes32 asset, uint256 amount, uint256 minReceive, uint64 deadline, tuple(address tokenIn, address tokenOut, uint24 poolFee, int24 tickSpacing, address hooks)[] routes) external payable',
  'function processLockMessage(uint32 messageIndex) external',
  'function executeSwap(bytes32 swapId, tuple(address tokenIn, address tokenOut, uint24 poolFee, int24 tickSpacing, address hooks)[] routes) external',
  'function settleSwap(bytes32 swapId, bytes32 preimage) external',
  'function cancelSwap(bytes32 swapId) external',
  'function getSwapState(bytes32 swapId) external view returns (uint8 state, address sender, address recipient, bytes32 asset, uint256 amount, uint256 minReceive, uint64 deadline)',
  'event SwapInitiated(bytes32 indexed swapId, address indexed sender, address indexed recipient, bytes32 asset, uint256 amount)',
  'event SwapCompleted(bytes32 indexed swapId, uint256 amountReceived)',
  'event SwapCancelled(bytes32 indexed swapId)',
])

export interface UseCrossChainMintOptions {
  /** Configuration overrides */
  config?: Partial<AtomicSwapConfig>
  /** Poll interval for status updates (ms) */
  pollInterval?: number
}

export interface UseCrossChainMintReturn {
  /** Initiate a cross-chain mint */
  mint: (request: Omit<CrossChainMintRequest, 'deadline'> & { deadline?: number }) => Promise<string>
  /** Cancel a pending mint after deadline */
  cancel: (swapId: string) => Promise<void>
  /** Current state of a mint by swap ID */
  getMintState: (swapId: string) => CrossChainMintState | undefined
  /** All active mints */
  activeMints: CrossChainStore['pendingMints']
  /** Recent completed mints */
  recentMints: CrossChainStore['recentMints']
  /** Loading state */
  isLoading: boolean
  /** Error message */
  error: string | null
}

export function useCrossChainMint(options: UseCrossChainMintOptions = {}): UseCrossChainMintReturn {
  const { config: configOverrides, pollInterval = 5000 } = options
  const config = { ...DEFAULT_SWAP_CONFIG, ...configOverrides }

  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const store = useCrossChainStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * Initiate a one-click cross-chain mint
   */
  const mint = useCallback(
    async (
      request: Omit<CrossChainMintRequest, 'deadline'> & { deadline?: number }
    ): Promise<string> => {
      if (!walletClient) {
        throw new Error('Wallet not connected')
      }

      setIsLoading(true)
      setError(null)

      try {
        // Validate the asset has a wrapped token mapping
        const wrappedToken = getWrappedToken(request.sourceAsset)
        if (!wrappedToken) {
          throw new Error('Asset not supported for cross-chain mint')
        }

        // Create the full request with deadline
        const fullRequest: CrossChainMintRequest = {
          ...request,
          deadline: request.deadline ?? Math.floor(Date.now() / 1000) + config.defaultDeadline,
        }

        // Initialize in store
        const swapId = store.initiateMint(fullRequest)
        store.updateMintStatus(swapId, 'locking')

        // Build swap routes if target token specified
        const routes: SwapRoute[] = []
        if (request.targetToken && request.targetToken !== wrappedToken) {
          routes.push({
            tokenIn: wrappedToken,
            tokenOut: request.targetToken,
            poolFee: 3000, // 0.3% default
            tickSpacing: 60,
          })
        }

        // Prepare transaction data
        const txData = encodeFunctionData({
          abi: BRIDGE_ABI,
          functionName: 'initiateMint',
          args: [
            swapId as `0x${string}`,
            request.recipient,
            request.sourceAsset,
            request.amount,
            request.minReceive ?? BigInt(0),
            BigInt(fullRequest.deadline),
            routes.map((r) => ({
              tokenIn: r.tokenIn,
              tokenOut: r.tokenOut,
              poolFee: r.poolFee,
              tickSpacing: r.tickSpacing,
              hooks: r.hooks ?? '0x0000000000000000000000000000000000000000',
            })),
          ],
        })

        // Send transaction to bridge contract
        const hash = await walletClient.sendTransaction({
          to: config.bridgeContract,
          data: txData,
          value: BigInt(0), // Native assets locked via XVM, not ETH
        } as const)

        store.updateMintTxHash(swapId, 'sourceTxHash', hash)
        store.updateMintStatus(swapId, 'waiting_confirmation')

        // Wait for transaction confirmation
        if (publicClient) {
          const receipt = await publicClient.waitForTransactionReceipt({ hash })

          if (receipt.status === 'success') {
            // Transaction was included, now waiting for Warp message
            store.updateMintStatus(swapId, 'minting')

            // The bridge contract handles the rest:
            // 1. Warp message is sent to destination chain
            // 2. Validators sign the message
            // 3. Message is processed, wrapped tokens minted
            // 4. Optional DEX swap executed
            // 5. Tokens delivered to recipient
          } else {
            store.failMint(swapId, 'Transaction failed')
          }
        }

        return swapId
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error'
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [walletClient, publicClient, store, config]
  )

  /**
   * Cancel a pending mint after deadline
   */
  const cancel = useCallback(
    async (swapId: string): Promise<void> => {
      if (!walletClient) {
        throw new Error('Wallet not connected')
      }

      const pending = store.getPendingMint(swapId)
      if (!pending) {
        throw new Error('Mint not found')
      }

      // Check deadline
      if (pending.deadline > Date.now() / 1000) {
        throw new Error('Cannot cancel before deadline')
      }

      const txData = encodeFunctionData({
        abi: BRIDGE_ABI,
        functionName: 'cancelSwap',
        args: [swapId as `0x${string}`],
      })

      const hash = await walletClient.sendTransaction({
        to: config.bridgeContract,
        data: txData,
      } as const)

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash })
      }

      store.cancelMint(swapId)
    },
    [walletClient, publicClient, store, config]
  )

  /**
   * Get mint state by swap ID
   */
  const getMintState = useCallback(
    (swapId: string): CrossChainMintState | undefined => {
      return store.getPendingMint(swapId)?.state
    },
    [store]
  )

  /**
   * Poll for status updates on active mints
   */
  useEffect(() => {
    if (!publicClient) return

    const activeMints = store.getActiveMints()
    if (activeMints.length === 0) return

    const pollStatuses = async () => {
      for (const mint of activeMints) {
        if (!mint.state.swapId) continue

        try {
          // Query on-chain state
          const state = await publicClient.readContract({
            address: config.bridgeContract,
            abi: BRIDGE_ABI,
            functionName: 'getSwapState',
            args: [mint.state.swapId],
          })

          // Map on-chain state to our status
          const [onChainState] = state as [number, ...unknown[]]
          let newStatus: CrossChainMintStatus = mint.state.status

          switch (onChainState) {
            case 0: // Pending
              newStatus = 'waiting_confirmation'
              break
            case 1: // Locked
              newStatus = 'locking'
              break
            case 2: // Minted
              newStatus = 'minting'
              break
            case 3: // Swapped
              newStatus = 'swapping'
              break
            case 4: // Settled
              newStatus = 'complete'
              store.completeMint(mint.state.swapId)
              break
            case 5: // Cancelled
              newStatus = 'cancelled'
              store.cancelMint(mint.state.swapId)
              break
            case 6: // Expired
              newStatus = 'failed'
              store.failMint(mint.state.swapId, 'Swap expired')
              break
          }

          if (newStatus !== mint.state.status && onChainState < 4) {
            store.updateMintStatus(mint.state.swapId, newStatus)
          }
        } catch {
          // Ignore polling errors
        }
      }
    }

    pollStatuses()
    const interval = setInterval(pollStatuses, pollInterval)

    return () => clearInterval(interval)
  }, [publicClient, store, config, pollInterval])

  return {
    mint,
    cancel,
    getMintState,
    activeMints: store.pendingMints,
    recentMints: store.recentMints,
    isLoading,
    error,
  }
}
