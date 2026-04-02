/**
 * Initialize V4 pools on the LXPool precompile (LP-9010)
 *
 * Creates core trading pairs on Lux mainnet with fee=3000 (0.30%), tickSpacing=60.
 * Dry-run by default -- pass --execute to send transactions.
 *
 * Usage:
 *   bun scripts/init-v4-pools.ts            # dry-run (logs what it would do)
 *   bun scripts/init-v4-pools.ts --execute  # send transactions
 *
 * Requires DEPLOYER_KEY env var when executing:
 *   DEPLOYER_KEY=0x... bun scripts/init-v4-pools.ts --execute
 */
import { createPublicClient, createWalletClient, http, type Address } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

import { POOL_MANAGER_ABI } from '../pkgs/dex/src/precompile/abis'
import { LX } from '../pkgs/dex/src/precompile/addresses'
import { createPoolKey, sortCurrencies } from '../pkgs/dex/src/precompile/types'

// ---------------------------------------------------------------------------
// Chain
// ---------------------------------------------------------------------------

const RPC_URL = 'https://api.lux.network/ext/bc/C/rpc'

const lux = {
  id: 96369,
  name: 'Lux',
  nativeCurrency: { name: 'LUX', symbol: 'LUX', decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
}

// ---------------------------------------------------------------------------
// Canonical mainnet token addresses
// ---------------------------------------------------------------------------

const TOKENS = {
  WLUX: '0x4888E4a2Ee0F03051c72D2BD3ACf755eD3498B3E' as Address,
  LBTC: '0x1E48D32a4F5e9f08DB9aE4959163300FaF8A6C8e' as Address,
  LETH: '0x60E0a8167FC13dE89348978860466C9ceC24B9ba' as Address,
  LSOL: '0x26B40f650156C7EbF9e087Dd0dca181Fe87625B7' as Address,
  LPOL: '0x28BfC5DD4B7E15659e41190983e5fE3df1132bB9' as Address,
  LUSD: '0x848Cff46eb323f323b6Bbe1Df274E40793d7f2c2' as Address,
} as const

// ---------------------------------------------------------------------------
// Pool parameters
// ---------------------------------------------------------------------------

const FEE = 3000 // 0.30%
const TICK_SPACING = 60

// sqrtPriceX96 for 1:1 price ratio (same decimals) = 2^96
const SQRT_PRICE_1_1 = BigInt('79228162514264337593543950336') // 2n ** 96n

// Pools to create: [tokenA, tokenB, label]
const POOLS: ReadonlyArray<readonly [Address, Address, string]> = [
  [TOKENS.WLUX, TOKENS.LBTC, 'WLUX/LBTC'],
  [TOKENS.WLUX, TOKENS.LETH, 'WLUX/LETH'],
  [TOKENS.WLUX, TOKENS.LSOL, 'WLUX/LSOL'],
  [TOKENS.WLUX, TOKENS.LUSD, 'WLUX/LUSD'],
  [TOKENS.LBTC, TOKENS.LETH, 'LBTC/LETH'],
]

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const execute = process.argv.includes('--execute')

  console.log(`Mode: ${execute ? 'EXECUTE (transactions will be sent)' : 'DRY-RUN (no transactions)'}`)
  console.log(`RPC:  ${RPC_URL}`)
  console.log(`LXPool precompile: ${LX.LX_POOL}\n`)

  const publicClient = createPublicClient({
    chain: lux as any,
    transport: http(RPC_URL),
  })

  // Build wallet client only when executing
  let walletClient: ReturnType<typeof createWalletClient> | undefined
  if (execute) {
    const deployerKey = process.env.DEPLOYER_KEY
    if (!deployerKey) {
      console.error('Error: DEPLOYER_KEY env var is required when using --execute')
      process.exit(1)
    }
    const account = privateKeyToAccount(deployerKey as `0x${string}`)
    walletClient = createWalletClient({
      account,
      chain: lux as any,
      transport: http(RPC_URL),
    })
    console.log(`Deployer: ${account.address}\n`)
  }

  // Process each pool
  for (const [tokenA, tokenB, label] of POOLS) {
    const [currency0, currency1] = sortCurrencies(tokenA, tokenB)
    const poolKey = createPoolKey(tokenA, tokenB, FEE, TICK_SPACING)

    console.log(`--- ${label} ---`)
    console.log(`  currency0: ${currency0}`)
    console.log(`  currency1: ${currency1}`)
    console.log(`  fee:       ${FEE}`)
    console.log(`  tickSpacing: ${TICK_SPACING}`)
    console.log(`  hooks:     ${poolKey.hooks}`)
    console.log(`  sqrtPriceX96: ${SQRT_PRICE_1_1}`)

    // Check if pool already exists
    try {
      const [sqrtPriceX96] = await publicClient.readContract({
        address: LX.LX_POOL,
        abi: POOL_MANAGER_ABI,
        functionName: 'getSlot0',
        args: [poolKey],
      })
      if (sqrtPriceX96 !== 0n) {
        console.log(`  Status: ALREADY INITIALIZED (sqrtPriceX96=${sqrtPriceX96})\n`)
        continue
      }
    } catch {
      // getSlot0 reverted or RPC error -- proceed with initialization attempt
    }

    if (!execute) {
      console.log('  Action: would call initialize()\n')
      continue
    }

    // Send the initialize transaction
    try {
      const hash = await walletClient!.writeContract({
        address: LX.LX_POOL,
        abi: POOL_MANAGER_ABI,
        functionName: 'initialize',
        args: [poolKey, SQRT_PRICE_1_1],
      })
      console.log(`  Tx: ${hash}`)

      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      console.log(`  Status: ${receipt.status === 'success' ? 'SUCCESS' : 'REVERTED'}`)
      console.log(`  Gas used: ${receipt.gasUsed}\n`)
    } catch (error: any) {
      console.error(`  Error: ${error.message}\n`)
    }
  }

  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
