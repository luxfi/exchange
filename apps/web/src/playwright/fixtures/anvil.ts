// biome-ignore lint/style/noRestrictedImports: Anvil test fixtures need direct ethers imports
import { test as base } from '@playwright/test'
import { MaxUint160, MaxUint256, permit2Address } from '@luxdex/permit2-sdk'
import { WETH_ADDRESS } from '@luxdex/universal-router-sdk'
import type { AnvilClient as BaseAnvilClient } from 'playwright/anvil/anvil-manager'
import { getAnvilManager, getTestChain, isLuxdMode } from 'playwright/anvil/anvil-manager'
import { deployDevNetworkTokens, setErc20BalanceWithMultipleSlots } from 'playwright/anvil/utils'
import { TEST_WALLET_ADDRESS } from 'playwright/fixtures/wallets'
import PERMIT2_ABI from 'lx/src/abis/permit2'
import { ZERO_ADDRESS } from 'lx/src/constants/misc'
import { DAI, LBTC_LUXDEV, LETH_LUXDEV, LUSD_LUXDEV, USDT, WRAPPED_NATIVE_CURRENCY } from 'lx/src/constants/tokens'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { sleep } from 'utilities/src/time/timing'
import { assume0xAddress } from 'utils/wagmi'
import { type Address, erc20Abi } from 'viem'
import { mainnet } from 'viem/chains'

const SNAPSHOTS_ENABLED = process.env.ENABLE_ANVIL_SNAPSHOTS === 'true'

class WalletError extends Error {
  code?: number
}

// Get allowed ERC20 addresses based on test mode (Lux or Ethereum)
const getAllowedErc20BalanceAddresses = (): string[] => {
  if (isLuxdMode()) {
    // luxd dev mode uses chain ID 1337 (LuxDev) - single-node K=1 consensus
    const wlux = WRAPPED_NATIVE_CURRENCY[UniverseChainId.LuxDev]?.address
    // Include WLUX address for dev mode wrapping tests
    const wluxAddress = wlux || '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    return [wluxAddress, LETH_LUXDEV.address, LBTC_LUXDEV.address, LUSD_LUXDEV.address]
  }
  return [USDT.address, DAI.address, WETH_ADDRESS(UniverseChainId.Mainnet)]
}

// Get wrapped native token addresses for each chain
const getWrappedNativeAddresses = (): string[] => {
  if (isLuxdMode()) {
    const wlux = WRAPPED_NATIVE_CURRENCY[UniverseChainId.LuxDev]?.address
    return wlux ? [wlux.toLowerCase()] : []
  }
  return [WETH_ADDRESS(UniverseChainId.Mainnet).toLowerCase()]
}

// Check if address is a wrapped native token (WETH/WLUX)
const isWrappedNativeToken = (address: string): boolean => {
  return getWrappedNativeAddresses().includes(address.toLowerCase())
}

// Helper to check if error is a timeout
const isTimeoutError = (error: any): boolean => {
  return (
    error?.message?.includes('timeout') ||
    error?.message?.includes('took too long') ||
    error?.details?.includes('timed out')
  )
}

// Helper to mine blocks or wait for auto-mining
// On luxd mode, blocks are auto-mined so we just wait briefly
const mineOrWait = async (client: BaseAnvilClient, blocks: number): Promise<void> => {
  if (isLuxdMode()) {
    await sleep(500 * blocks)
  } else {
    await client.mine({ blocks })
  }
}

// Create anvil client with restart capability
const createAnvilClient = () => {
  const client: BaseAnvilClient = getAnvilManager().getClient()
  const helpers = {
    async getWalletAddress() {
      return TEST_WALLET_ADDRESS
    },
    async setErc20Balance({
      address,
      balance,
      walletAddress = TEST_WALLET_ADDRESS,
    }: {
      address: Address
      balance: bigint
      walletAddress?: Address
    }) {
      const allowedAddresses = getAllowedErc20BalanceAddresses()
      if (!allowedAddresses.includes(address)) {
        throw new Error(`Token ${address} is not allowed. Allowed tokens: ${allowedAddresses.join(', ')}`)
      }
      await setErc20BalanceWithMultipleSlots({
        client,
        erc20Address: address,
        user: walletAddress,
        newBalance: balance,
      })

      // For wrapped native tokens (WETH/WLUX), also fund the contract with ETH
      // This is required because withdraw() sends ETH back to the user, and the contract
      // must hold that ETH. When we manipulate storage slots to set user balances,
      // the contract might not have enough actual ETH to cover withdrawals.
      // On mainnet fork, even though WETH has ETH, the total balance we've artificially
      // added via storage manipulation may exceed what the contract can pay out.
      if (isWrappedNativeToken(address)) {
        // Get current ETH balance of the WETH contract
        const currentContractBalance = await client.getBalance({ address })
        // Always add enough ETH to cover the user's new balance on top of existing balance
        // This ensures the contract has enough ETH even when we manipulate multiple user balances
        const additionalRequired = balance + (balance / 10n) // Add 10% buffer
        const newContractBalance = currentContractBalance + additionalRequired
        await client.setBalance({ address, value: newContractBalance })
        await mineOrWait(client, 1)
      }
    },
    async getErc20Balance(address: Address, owner?: Address) {
      return await client.readContract({
        address,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [owner ?? TEST_WALLET_ADDRESS],
      })
    },
    async getErc20Allowance({ address, spender, owner }: { address: Address; spender: Address; owner?: Address }) {
      return await client.readContract({
        address,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [owner ?? TEST_WALLET_ADDRESS, spender],
      })
    },
    async setErc20Allowance({
      address,
      spender,
      owner,
      amount = MaxUint256.toBigInt(),
    }: {
      address: Address
      spender: Address
      owner?: Address
      amount?: bigint
    }) {
      // In luxd mode, use the client's account for local signing
      // In Anvil mode, we can use the address directly (Anvil auto-unlocks accounts)
      const accountToUse =
        isLuxdMode() || !owner || owner === TEST_WALLET_ADDRESS ? client.account : (owner as Address)
      await client.writeContract({
        address,
        abi: erc20Abi,
        functionName: 'approve',
        args: [spender, amount],
        account: accountToUse ?? null,
        chain: getTestChain(),
      })
    },
    async getPermit2Allowance({ owner, token, spender }: { owner?: Address; token: Address; spender: Address }) {
      // luxd dev mode uses chain ID 1337 (LuxDev), Anvil uses mainnet fork
      const chainId = isLuxdMode() ? UniverseChainId.LuxDev : UniverseChainId.Mainnet
      const data = await client.readContract({
        address: assume0xAddress(permit2Address(chainId)),
        abi: PERMIT2_ABI,
        functionName: 'allowance',
        args: [owner ?? TEST_WALLET_ADDRESS, token, spender],
      })

      const [amount, expiration, nonce] = data
      return { amount, expiration, nonce }
    },
    async setPermit2Allowance({
      owner,
      token,
      spender,
      amount = MaxUint160.toBigInt(), // MaxUint160
      expiration = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
    }: {
      owner?: Address
      token: Address
      spender: Address
      amount?: bigint
      expiration?: number
    }) {
      // luxd dev mode uses chain ID 1337 (LuxDev), Anvil uses mainnet fork
      const chainId = isLuxdMode() ? UniverseChainId.LuxDev : UniverseChainId.Mainnet
      // In luxd mode, use the client's account for local signing
      // In Anvil mode, we can use the address directly (Anvil auto-unlocks accounts)
      const accountToUse =
        isLuxdMode() || !owner || owner === TEST_WALLET_ADDRESS ? client.account : (owner as Address)
      await client.writeContract({
        address: assume0xAddress(permit2Address(chainId)),
        abi: PERMIT2_ABI,
        functionName: 'approve',
        args: [token, spender, amount, expiration],
        account: accountToUse ?? null,
        chain: getTestChain(),
      })
    },
    async setV2PoolReserves({
      pairAddress,
      reserve0,
      reserve1,
    }: {
      pairAddress: Address
      reserve0: bigint
      reserve1: bigint
    }) {
      // Both Anvil and luxd dev mode support setStorageAt and mine
      const blockTimestampLast = Math.floor(Date.now() / 1000)
      // V2 pairs store reserves in slot 8: reserve0 (112 bits) | reserve1 (112 bits) | blockTimestampLast (32 bits)
      const maxUint112 = (1n << 112n) - 1n

      // V2 pairs store blockTimestampLast in slot 8: blockTimestampLast (32 bits)
      const maxUint32 = (1n << 32n) - 1n

      if (blockTimestampLast > maxUint32) {
        throw new Error('Block timestamp must fit in uint32')
      }

      if (reserve0 > maxUint112 || reserve1 > maxUint112) {
        throw new Error('Reserve amounts must fit in uint112')
      }

      // V2 pairs pack three values into a single storage slot:
      // - reserve0: uint112 (bits 0-111)
      // - reserve1: uint112 (bits 112-223)
      // - blockTimestampLast: uint32 (bits 224-255)
      const packedValue =
        (BigInt(blockTimestampLast) << 224n) | // 32 bits for timestamp at the top
        (reserve1 << 112n) | // 112 bits for reserve1 in the middle
        reserve0 // 112 bits for reserve0 at the bottom

      // Set the packed reserves at storage slot 8
      await client.setStorageAt({
        address: pairAddress,
        index: '0x8', // Storage slot 8 where reserves are stored
        value: `0x${packedValue.toString(16).padStart(64, '0')}`,
      })

      await mineOrWait(client, 1)
    },
    /**
     * @deprecated
     * Wagmi submits transactions to Anvil via the RPC interface so this function no longer intercepts
     * the requests. Use createRejectableMockConnector instead.
     */
    async setTransactionRejection() {
      // Override the wallet actions to reject transactions
      const originalRequest = client.request
      client.request = async function (this: typeof client, ...args) {
        const [{ method }] = args
        if (method === 'eth_sendTransaction' || method === 'eth_sendRawTransaction') {
          const error = new WalletError('User rejected the transaction')
          error.code = 4001
          throw error
        }
        return (originalRequest as any).apply(this, args) as ReturnType<typeof originalRequest>
      } as typeof originalRequest
    },
    /**
     * Take a snapshot of the current blockchain state and return the snapshot ID
     * This is useful for test isolation - take snapshot at beginning of test, revert at end
     * Supported by both Anvil and luxd dev mode
     */
    async takeSnapshot() {
      return await client.snapshot()
    },
    /**
     * Revert to a previously taken snapshot
     * @param snapshotId - The ID returned from takeSnapshot()
     * Supported by both Anvil and luxd dev mode
     */
    async revertToSnapshot(snapshotId: `0x${string}`) {
      await client.revert({ id: snapshotId })
    },
    /**
     * Advanced state management: take snapshot, run function, then revert
     * This ensures the function runs in isolation without affecting the blockchain state
     * @param fn - Function to run in isolation
     * Supported by both Anvil and luxd dev mode
     */
    async withSnapshot<T>(fn: () => Promise<T>): Promise<T> {
      const snapshotId = await client.snapshot()
      try {
        return await fn()
      } finally {
        await client.revert({ id: snapshotId })
      }
    },
  }
  return Object.assign(client, helpers)
}

export const test = base.extend<{ anvil: AnvilClient; delegateToZeroAddress?: void; page: import('@playwright/test').Page }>({
  // Override page fixture to add chainId for luxd mode
  async page({ page }, use) {
    if (isLuxdMode()) {
      const chain = getTestChain()

      // Enable testnet mode and set AppKit chain for luxd dev mode
      // LuxDev (chain 1337) is a testnet, so we need to enable testnet mode
      // to make it appear in the enabled chains list
      await page.addInitScript((chainId: number) => {
        // Set AppKit's active chain to the correct chainId
        const appKitKey = '@appkit/active_caip_network_id'
        const correctValue = `eip155:${chainId}`
        localStorage.setItem(appKitKey, correctValue)

        // Enable testnet mode in Redux persisted state
        // This is required because LuxDev (1337) is marked as a testnet chain
        // Without testnet mode, it's filtered out and the token selector uses mainnet tokens
        const reduxKey = 'redux/interface'
        const existingState = localStorage.getItem(reduxKey)
        let state: Record<string, unknown>
        try {
          state = existingState ? JSON.parse(existingState) : {}
        } catch {
          state = {}
        }
        // Ensure userSettings exists and isTestnetModeEnabled is true
        if (!state.userSettings || typeof state.userSettings !== 'object') {
          state.userSettings = {}
        }
        ;(state.userSettings as Record<string, unknown>).isTestnetModeEnabled = true
        localStorage.setItem(reduxKey, JSON.stringify(state))
      }, chain.id)

      // Wrap goto to add chainId parameter for luxd mode
      const originalGoto = page.goto.bind(page)
      page.goto = async (url: string, options?: Parameters<typeof page.goto>[1]) => {
        // Parse URL and add chainId if not already present
        // Handle both absolute URLs and relative paths
        let parsedUrl: URL
        try {
          // Try parsing as absolute URL first
          parsedUrl = new URL(url)
        } catch {
          // If that fails, it's a relative path - use configured BASE_URL or default
          const baseUrl = process.env.BASE_URL || 'http://localhost:9000'
          parsedUrl = new URL(url, baseUrl)
        }
        if (!parsedUrl.searchParams.has('chainId')) {
          parsedUrl.searchParams.set('chainId', String(chain.id))
        }
        return originalGoto(parsedUrl.toString(), options)
      }
    } else {
      // Anvil mode - set chain to Ethereum mainnet (chain ID 1)
      // The app defaults to Lux mainnet (96369), so we need to:
      // 1. Set AppKit localStorage before page load
      // 2. Add chainId to URLs so wagmiAutoConnect picks it up
      const mainnetChainId = 1
      await page.addInitScript((chainId: number) => {
        // Set AppKit's active chain to Ethereum mainnet
        const appKitKey = '@appkit/active_caip_network_id'
        const correctValue = `eip155:${chainId}`
        localStorage.setItem(appKitKey, correctValue)
      }, mainnetChainId)

      // Wrap goto to add chainId parameter for Anvil mode
      // This ensures wagmiAutoConnect switches to the correct chain
      const originalGoto = page.goto.bind(page)
      page.goto = async (url: string, options?: Parameters<typeof page.goto>[1]) => {
        // Parse URL and add chainId if not already present
        let parsedUrl: URL
        try {
          parsedUrl = new URL(url)
        } catch {
          const baseUrl = process.env.BASE_URL || 'http://localhost:9000'
          parsedUrl = new URL(url, baseUrl)
        }
        // Only add chainId if neither chainId nor chain is present
        if (!parsedUrl.searchParams.has('chainId') && !parsedUrl.searchParams.has('chain')) {
          parsedUrl.searchParams.set('chainId', String(mainnetChainId))
        }
        return originalGoto(parsedUrl.toString(), options)
      }
    }
    await use(page)
  },
  // biome-ignore lint/correctness/noEmptyPattern: it's ok here
  async anvil({}, use) {
    // Ensure Anvil is running and healthy
    if (!(await getAnvilManager().ensureHealthy())) {
      throw new Error('Failed to ensure Anvil is healthy for test')
    }

    // Get fresh client for this test
    const testAnvil = createAnvilClient()

    // Deploy test tokens for luxd dev mode (WLUX, LUSD, LETH)
    // This is needed because luxd dev mode starts with a fresh chain
    await deployDevNetworkTokens(testAnvil)

    // Take snapshot for test isolation (supported by both Anvil and luxd dev mode)
    let snapshotId: `0x${string}` | undefined
    try {
      if (SNAPSHOTS_ENABLED) {
        snapshotId = await testAnvil.snapshot()
      }
    } catch (error) {
      if (isTimeoutError(error)) {
        // Node timed out during snapshot, restart and retry
        const nodeName = isLuxdMode() ? 'luxd' : 'Anvil'
        console.error(`Snapshot timeout, restarting ${nodeName}...`)
        await getAnvilManager().restart()
        await sleep(2000)
        snapshotId = await testAnvil.snapshot()
      } else {
        throw error
      }
    }

    // Run the test
    await use(testAnvil)

    // Check anvil health status
    const isHealthy = await getAnvilManager().isHealthy()
    if (!isHealthy) {
      console.error('Anvil is not healthy after test, stopping...')
      // Don't restart here - let the next test handle it
      // This avoids race conditions between parallel tests
      await getAnvilManager().stop()
      return
    }

    // Cleanup with auto-recovery (supported by both Anvil and luxd dev mode)
    try {
      if (snapshotId) {
        await testAnvil.revert({ id: snapshotId })
      } else if (!isLuxdMode()) {
        // reset() is Anvil-specific, luxd uses revert with snapshot
        await testAnvil.reset()
      }
    } catch (error) {
      console.error('Cleanup failed:', error)
      const nodeName = isLuxdMode() ? 'luxd' : 'Anvil'
      if (isTimeoutError(error)) {
        console.error(`Cleanup timeout, marking ${nodeName} for restart...`)
        // Don't restart here - let the next test handle it
        // This avoids race conditions between parallel tests
      } else if (snapshotId && !isLuxdMode()) {
        try {
          await testAnvil.reset()
        } catch (resetError) {
          console.error('Reset also failed:', resetError)
        }
      }
    }
  },
  // Delegate the test wallet to the zero address to avoid any smart wallet conflicts
  // Note: This uses setBalance which is supported by both Anvil and luxd dev mode
  delegateToZeroAddress: [
    async ({ anvil }, use) => {

      try {
        const originalBalance = await anvil.getBalance({ address: TEST_WALLET_ADDRESS })
        const nonce = await anvil.getTransactionCount({
          address: TEST_WALLET_ADDRESS,
        })
        const auth = await anvil.signAuthorization({
          account: TEST_WALLET_ADDRESS,
          contractAddress: ZERO_ADDRESS,
          chainId: anvil.chain?.id,
          nonce: nonce + 1,
        })
        await anvil.sendTransaction({
          authorizationList: [auth],
          to: TEST_WALLET_ADDRESS,
          account: TEST_WALLET_ADDRESS,
          chain: getTestChain(),
        })
        // Reset the wallet to the original balance because tests might rely on that
        await anvil.setBalance({ address: TEST_WALLET_ADDRESS, value: originalBalance })
        await use(undefined)
      } catch {
        await use(undefined)
      }
    },
    { auto: true },
  ],
})

export type AnvilClient = BaseAnvilClient & ReturnType<typeof createAnvilClient>
