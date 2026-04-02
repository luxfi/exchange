/**
 * E2E Swap Health Check — Lux Mainnet
 *
 * Read-only smoke test that verifies V2, V3, V4, and OmnichainRouter
 * are alive on mainnet. No transactions are sent.
 *
 * Usage:
 *   npx tsx scripts/test-swap-e2e.ts
 */
import { createPublicClient, http, formatEther, type Address } from 'viem'

import { POOL_MANAGER_ABI } from '../pkgs/dex/src/precompile/abis'
import { LX } from '../pkgs/dex/src/precompile/addresses'
import { createPoolKey } from '../pkgs/dex/src/precompile/types'
import { OmnichainRouter } from '../pkgs/dex/src/router/router'

// ---------------------------------------------------------------------------
// Chain
// ---------------------------------------------------------------------------

const RPC_URL = 'https://api.lux.network/ext/bc/C/rpc'
const CHAIN_ID = 96369

const lux = {
  id: CHAIN_ID,
  name: 'Lux',
  nativeCurrency: { name: 'LUX', symbol: 'LUX', decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
}

// ---------------------------------------------------------------------------
// Contract addresses (Lux Mainnet)
// ---------------------------------------------------------------------------

const V2_FACTORY = '0xD173926A10A0C4eCd3A51B1422270b65Df0551c1' as Address
const V2_ROUTER  = '0xAe2cf1E403aAFE6C05A5b8Ef63EB19ba591d8511' as Address
const V3_FACTORY = '0x80bBc7C4C7a59C899D1B37BC14539A22D5830a84' as Address
const V3_SWAP_ROUTER_02 = '0x939bC0Bca6F9B9c52E6e3AD8A3C590b5d9B9D10E' as Address
const LX_POOL = LX.LX_POOL // 0x...9010

const TOKENS = {
  WLUX: '0x4888E4a2Ee0F03051c72D2BD3ACf755eD3498B3E' as Address,
  LBTC: '0x1E48D32a4F5e9f08DB9aE4959163300FaF8A6C8e' as Address,
  LETH: '0x60E0a8167FC13dE89348978860466C9ceC24B9ba' as Address,
  LUSD: '0x848Cff46eb323f323b6Bbe1Df274E40793d7f2c2' as Address,
} as const

// ---------------------------------------------------------------------------
// Minimal ABIs (V2 + V3 — only view functions we need)
// ---------------------------------------------------------------------------

const V2_FACTORY_ABI = [
  {
    type: 'function',
    name: 'allPairsLength',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'allPairs',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPair',
    inputs: [
      { name: 'tokenA', type: 'address' },
      { name: 'tokenB', type: 'address' },
    ],
    outputs: [{ name: 'pair', type: 'address' }],
    stateMutability: 'view',
  },
] as const

const V2_PAIR_ABI = [
  {
    type: 'function',
    name: 'getReserves',
    inputs: [],
    outputs: [
      { name: 'reserve0', type: 'uint112' },
      { name: 'reserve1', type: 'uint112' },
      { name: 'blockTimestampLast', type: 'uint32' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'token0',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'token1',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
] as const

const V2_ROUTER_ABI = [
  {
    type: 'function',
    name: 'getAmountsOut',
    inputs: [
      { name: 'amountIn', type: 'uint256' },
      { name: 'path', type: 'address[]' },
    ],
    outputs: [{ name: 'amounts', type: 'uint256[]' }],
    stateMutability: 'view',
  },
] as const

const V3_FACTORY_ABI = [
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPool',
    inputs: [
      { name: 'tokenA', type: 'address' },
      { name: 'tokenB', type: 'address' },
      { name: 'fee', type: 'uint24' },
    ],
    outputs: [{ name: 'pool', type: 'address' }],
    stateMutability: 'view',
  },
] as const

const V3_POOL_ABI = [
  {
    type: 'function',
    name: 'slot0',
    inputs: [],
    outputs: [
      { name: 'sqrtPriceX96', type: 'uint160' },
      { name: 'tick', type: 'int24' },
      { name: 'observationIndex', type: 'uint16' },
      { name: 'observationCardinality', type: 'uint16' },
      { name: 'observationCardinalityNext', type: 'uint16' },
      { name: 'feeProtocol', type: 'uint8' },
      { name: 'unlocked', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'liquidity',
    inputs: [],
    outputs: [{ name: '', type: 'uint128' }],
    stateMutability: 'view',
  },
] as const

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as Address

let passed = 0
let failed = 0

function report(label: string, ok: boolean, detail: string): void {
  const tag = ok ? 'PASS' : 'FAIL'
  console.log(`  [${tag}] ${label}: ${detail}`)
  if (ok) passed++
  else failed++
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

async function testV2(client: ReturnType<typeof createPublicClient>): Promise<void> {
  console.log('\n=== V2 (UniswapV2-style AMM) ===')

  // 1. allPairsLength
  let pairCount = 0n
  try {
    pairCount = await client.readContract({
      address: V2_FACTORY,
      abi: V2_FACTORY_ABI,
      functionName: 'allPairsLength',
    })
    report('Factory allPairsLength()', true, `${pairCount} pairs`)
  } catch (err: any) {
    report('Factory allPairsLength()', false, err.message?.slice(0, 120))
    return
  }

  // 2. If pairs exist, query the first pair for reserves
  if (pairCount > 0n) {
    try {
      const firstPair = await client.readContract({
        address: V2_FACTORY,
        abi: V2_FACTORY_ABI,
        functionName: 'allPairs',
        args: [0n],
      })
      const [reserve0, reserve1] = await client.readContract({
        address: firstPair as Address,
        abi: V2_PAIR_ABI,
        functionName: 'getReserves',
      })
      report(
        'First pair getReserves()',
        reserve0 > 0n || reserve1 > 0n,
        `reserve0=${reserve0}, reserve1=${reserve1}`,
      )
    } catch (err: any) {
      report('First pair getReserves()', false, err.message?.slice(0, 120))
    }
  } else {
    report('First pair getReserves()', false, 'no pairs deployed')
  }

  // 3. getAmountsOut through WLUX -> LETH (if that pair exists)
  try {
    const pairAddr = await client.readContract({
      address: V2_FACTORY,
      abi: V2_FACTORY_ABI,
      functionName: 'getPair',
      args: [TOKENS.WLUX, TOKENS.LETH],
    })

    if (pairAddr !== ZERO_ADDRESS) {
      const amounts = await client.readContract({
        address: V2_ROUTER,
        abi: V2_ROUTER_ABI,
        functionName: 'getAmountsOut',
        args: [10n ** 18n, [TOKENS.WLUX, TOKENS.LETH]], // 1 WLUX
      })
      report(
        'Router getAmountsOut(1 WLUX -> LETH)',
        amounts[1] > 0n,
        `out=${formatEther(amounts[1])} LETH`,
      )
    } else {
      report('Router getAmountsOut(WLUX->LETH)', false, 'WLUX/LETH pair not created on V2')
    }
  } catch (err: any) {
    report('Router getAmountsOut()', false, err.message?.slice(0, 120))
  }

  console.log(`  V2 summary: ${pairCount} pairs`)
}

async function testV3(client: ReturnType<typeof createPublicClient>): Promise<void> {
  console.log('\n=== V3 (Concentrated Liquidity AMM) ===')

  // 1. Factory owner()
  let owner: Address | null = null
  try {
    owner = await client.readContract({
      address: V3_FACTORY,
      abi: V3_FACTORY_ABI,
      functionName: 'owner',
    }) as Address
    report('Factory owner()', true, owner)
  } catch (err: any) {
    report('Factory owner()', false, err.message?.slice(0, 120))
    return
  }

  // 2. Check for WLUX/LBTC pool at fee=3000
  const FEE_3000 = 3000
  try {
    const poolAddr = await client.readContract({
      address: V3_FACTORY,
      abi: V3_FACTORY_ABI,
      functionName: 'getPool',
      args: [TOKENS.WLUX, TOKENS.LBTC, FEE_3000],
    }) as Address

    const poolExists = poolAddr !== ZERO_ADDRESS
    report('WLUX/LBTC pool (fee=3000)', poolExists, poolExists ? poolAddr : 'not created')

    if (poolExists) {
      // 3. Query slot0 for current price
      const [sqrtPriceX96, tick] = await client.readContract({
        address: poolAddr,
        abi: V3_POOL_ABI,
        functionName: 'slot0',
      })
      const liquidity = await client.readContract({
        address: poolAddr,
        abi: V3_POOL_ABI,
        functionName: 'liquidity',
      })
      const priceInitialized = sqrtPriceX96 > 0n
      report(
        'Pool slot0()',
        priceInitialized,
        `sqrtPriceX96=${sqrtPriceX96}, tick=${tick}, liquidity=${liquidity}`,
      )
    }
  } catch (err: any) {
    report('WLUX/LBTC pool query', false, err.message?.slice(0, 120))
  }

  // Also check WLUX/LETH pool
  try {
    const poolAddr = await client.readContract({
      address: V3_FACTORY,
      abi: V3_FACTORY_ABI,
      functionName: 'getPool',
      args: [TOKENS.WLUX, TOKENS.LETH, FEE_3000],
    }) as Address

    const poolExists = poolAddr !== ZERO_ADDRESS
    report('WLUX/LETH pool (fee=3000)', poolExists, poolExists ? poolAddr : 'not created')

    if (poolExists) {
      const [sqrtPriceX96, tick] = await client.readContract({
        address: poolAddr,
        abi: V3_POOL_ABI,
        functionName: 'slot0',
      })
      const liquidity = await client.readContract({
        address: poolAddr,
        abi: V3_POOL_ABI,
        functionName: 'liquidity',
      })
      report(
        'Pool slot0()',
        sqrtPriceX96 > 0n,
        `sqrtPriceX96=${sqrtPriceX96}, tick=${tick}, liquidity=${liquidity}`,
      )
    }
  } catch (err: any) {
    report('WLUX/LETH pool query', false, err.message?.slice(0, 120))
  }

  // Verify SwapRouter02 has code
  try {
    const code = await client.getCode({ address: V3_SWAP_ROUTER_02 })
    const hasCode = !!code && code.length > 2
    report('SwapRouter02 deployed', hasCode, hasCode ? `${code.length} bytes bytecode` : 'no code')
  } catch (err: any) {
    report('SwapRouter02 deployed', false, err.message?.slice(0, 120))
  }
}

async function testV4(client: ReturnType<typeof createPublicClient>): Promise<void> {
  console.log('\n=== V4 (LXPool Precompile LP-9010) ===')

  // 1. Check if precompile responds (getCode returns empty for native precompiles,
  //    so we test with an actual view call instead)
  let precompileActive = false

  // First check if there is bytecode at the precompile address
  let hasCode = false
  try {
    const code = await client.getCode({ address: LX_POOL })
    hasCode = !!code && code.length > 2
    report('LXPool has bytecode', hasCode, hasCode ? `${code!.length} bytes` : 'no code (native precompile or not deployed)')
  } catch (err: any) {
    report('LXPool has bytecode', false, err.message?.slice(0, 120))
  }

  // Try a view call to see if the precompile is functional
  try {
    const poolKey = createPoolKey(TOKENS.WLUX, TOKENS.LBTC)
    const [sqrtPriceX96, tick, protocolFee, lpFee] = await client.readContract({
      address: LX_POOL,
      abi: POOL_MANAGER_ABI,
      functionName: 'getSlot0',
      args: [poolKey],
    })
    precompileActive = true
    const initialized = sqrtPriceX96 > 0n
    report('LXPool precompile responds', true, 'call succeeded')
    report(
      'WLUX/LBTC pool state',
      initialized,
      initialized
        ? `sqrtPriceX96=${sqrtPriceX96}, tick=${tick}, protocolFee=${protocolFee}, lpFee=${lpFee}`
        : 'pool not initialized (sqrtPriceX96=0)',
    )
  } catch (err: any) {
    const msg = err.details ?? err.shortMessage ?? err.message ?? ''
    // A contract revert still means the precompile answered
    if (msg.includes('revert') || msg.includes('execution reverted')) {
      precompileActive = true
      report('LXPool precompile responds', true, 'reverted (precompile active, pool may not exist)')
    } else if (msg.includes('unknown method selector')) {
      // Precompile address exists but doesn't recognize this ABI yet
      report('LXPool precompile responds', false, 'unknown method selector (precompile not yet activated on this network)')
    } else {
      report('LXPool precompile responds', false, msg.slice(0, 150))
    }
  }

  if (!precompileActive) {
    console.log('  (skipping pool-level checks — precompile not active)')
    return
  }

  // 2. Check additional pools
  const v4Pools = [
    { a: TOKENS.WLUX, b: TOKENS.LETH, label: 'WLUX/LETH' },
    { a: TOKENS.WLUX, b: TOKENS.LUSD, label: 'WLUX/LUSD' },
  ]

  for (const { a, b, label } of v4Pools) {
    try {
      const poolKey = createPoolKey(a, b)
      const [sqrtPriceX96] = await client.readContract({
        address: LX_POOL,
        abi: POOL_MANAGER_ABI,
        functionName: 'getSlot0',
        args: [poolKey],
      })
      const initialized = sqrtPriceX96 > 0n
      report(`${label} pool state`, initialized, initialized ? `sqrtPriceX96=${sqrtPriceX96}` : 'not initialized')
    } catch (err: any) {
      report(`${label} pool state`, false, (err.details ?? err.message)?.slice(0, 120))
    }
  }

  // 3. Read liquidity for WLUX/LBTC
  try {
    const poolKey = createPoolKey(TOKENS.WLUX, TOKENS.LBTC)
    const liquidity = await client.readContract({
      address: LX_POOL,
      abi: POOL_MANAGER_ABI,
      functionName: 'getLiquidity',
      args: [poolKey],
    })
    report('WLUX/LBTC liquidity', true, `${liquidity}`)
  } catch (err: any) {
    report('WLUX/LBTC liquidity', false, (err.details ?? err.message)?.slice(0, 120))
  }
}

async function testOmnichainRouter(client: ReturnType<typeof createPublicClient>): Promise<void> {
  console.log('\n=== OmnichainRouter ===')
  console.log('  Note: OmnichainRouter routes via V4 LXPool precompile (AMM mode).')
  console.log('  If V4 precompile is inactive, quotes will fail — this is expected.')

  const router = new OmnichainRouter({ ammEnabled: true, clobEnabled: false })
  router.setPublicClient(client)

  // Suppress OmnichainRouter's internal console.error/warn — we report results ourselves
  const origError = console.error
  const origWarn = console.warn
  console.error = () => {}
  console.warn = () => {}

  const pairs = [
    { tokenIn: TOKENS.WLUX, tokenOut: TOKENS.LBTC, label: 'WLUX -> LBTC' },
    { tokenIn: TOKENS.WLUX, tokenOut: TOKENS.LETH, label: 'WLUX -> LETH' },
  ]

  for (const { tokenIn, tokenOut, label } of pairs) {
    try {
      const quote = await router.getQuote({
        tokenIn,
        tokenOut,
        amountIn: 10n ** 18n, // 1 WLUX
        preferredSource: 'amm',
      })

      const source = quote.route[0]?.source ?? 'unknown'
      report(
        `Quote ${label} (1 WLUX)`,
        quote.amountOut > 0n,
        `source=${source}, amountOut=${quote.amountOut}, impact=${quote.priceImpact}bps, gas=${quote.estimatedGas}`,
      )
    } catch (err: any) {
      const msg = err.message ?? ''
      if (msg.includes('No quotes available') || msg.includes('unknown method selector')) {
        report(`Quote ${label}`, false, 'no quotes (V4 precompile not active on mainnet)')
      } else {
        report(`Quote ${label}`, false, msg.slice(0, 120))
      }
    }
  }

  // Restore console
  console.error = origError
  console.warn = origWarn
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('Lux Mainnet Swap E2E Health Check')
  console.log(`RPC:      ${RPC_URL}`)
  console.log(`Chain ID: ${CHAIN_ID}`)
  console.log(`Time:     ${new Date().toISOString()}`)

  const client = createPublicClient({
    chain: lux as any,
    transport: http(RPC_URL),
  })

  // Verify RPC is alive
  try {
    const blockNumber = await client.getBlockNumber()
    console.log(`Block:    ${blockNumber}`)
  } catch (err: any) {
    console.error(`FATAL: RPC unreachable - ${err.message}`)
    process.exit(1)
  }

  await testV2(client)
  await testV3(client)
  await testV4(client)
  await testOmnichainRouter(client)

  // Summary
  console.log('\n=== Summary ===')
  console.log(`  Passed: ${passed}`)
  console.log(`  Failed: ${failed}`)
  console.log(`  Total:  ${passed + failed}`)

  if (failed > 0) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
