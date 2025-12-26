/**
 * DEX Precompile Addresses
 * Native Go implementation at EVM level
 */
import type { Address } from 'viem'

/**
 * DEX Precompile contract addresses
 * These are native precompiles, not deployed contracts
 */
export const DEX_PRECOMPILES = {
  /**
   * PoolManager (0x0400)
   * Singleton managing all liquidity pools
   * - Initialize pools
   * - Execute swaps
   * - Modify liquidity
   * - Flash accounting settlement
   */
  POOL_MANAGER: '0x0000000000000000000000000000000000000400' as Address,

  /**
   * SwapRouter (0x0401)
   * Optimized swap routing
   * - exactInputSingle / exactOutputSingle
   * - Multi-hop swaps
   * - Native LUX support
   */
  SWAP_ROUTER: '0x0000000000000000000000000000000000000401' as Address,

  /**
   * HooksRegistry (0x0402)
   * Hook contract registry
   * - Register hook contracts
   * - Query hook permissions
   */
  HOOKS_REGISTRY: '0x0000000000000000000000000000000000000402' as Address,

  /**
   * FlashLoan (0x0403)
   * Flash loan facility
   * - Borrow any token
   * - Repay in same transaction
   */
  FLASH_LOAN: '0x0000000000000000000000000000000000000403' as Address,
} as const

export type DexPrecompile = keyof typeof DEX_PRECOMPILES
