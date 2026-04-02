/**
 * Test LuxDev swap - verify pools exist and execute swap
 */
import { createWalletClient, createPublicClient, http, parseEther, encodeFunctionData } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

const TEST_WALLET_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const RPC_URL = 'http://127.0.0.1:8545/ext/bc/C/rpc'

const luxDev = {
  id: 1337,
  name: 'Lux Dev',
  nativeCurrency: { name: 'LUX', symbol: 'LUX', decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
}

// Token addresses
const TOKENS = {
  WLUX: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  LETH: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
  LBTC: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
  LUSD: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853',
}

// DEX Precompile addresses (LP-aligned format: 0x0000...LPNUM)
const POOL_MANAGER = '0x0000000000000000000000000000000000009010' // LP-9010
const SWAP_ROUTER = '0x0000000000000000000000000000000000009012'  // LP-9012

// Pool parameters (must match deployment)
const FEE = 3000
const TICK_SPACING = 60
const NO_HOOKS = '0x0000000000000000000000000000000000000000'

// Sort tokens for pool key (currency0 < currency1)
function sortTokens(tokenA: string, tokenB: string): [string, string] {
  return tokenA.toLowerCase() < tokenB.toLowerCase()
    ? [tokenA, tokenB]
    : [tokenB, tokenA]
}

// Pool Manager ABI
const POOL_MANAGER_ABI = [
  {
    type: 'function',
    name: 'getSlot0',
    inputs: [{
      name: 'key',
      type: 'tuple',
      components: [
        { name: 'currency0', type: 'address' },
        { name: 'currency1', type: 'address' },
        { name: 'fee', type: 'uint24' },
        { name: 'tickSpacing', type: 'int24' },
        { name: 'hooks', type: 'address' },
      ],
    }],
    outputs: [
      { name: 'sqrtPriceX96', type: 'uint160' },
      { name: 'tick', type: 'int24' },
      { name: 'protocolFee', type: 'uint24' },
      { name: 'lpFee', type: 'uint24' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getLiquidity',
    inputs: [{
      name: 'key',
      type: 'tuple',
      components: [
        { name: 'currency0', type: 'address' },
        { name: 'currency1', type: 'address' },
        { name: 'fee', type: 'uint24' },
        { name: 'tickSpacing', type: 'int24' },
        { name: 'hooks', type: 'address' },
      ],
    }],
    outputs: [{ name: 'liquidity', type: 'uint128' }],
    stateMutability: 'view',
  },
] as const

// SwapRouter ABI
const SWAP_ROUTER_ABI = [
  {
    type: 'function',
    name: 'exactInputSingle',
    inputs: [{
      name: 'params',
      type: 'tuple',
      components: [
        {
          name: 'poolKey',
          type: 'tuple',
          components: [
            { name: 'currency0', type: 'address' },
            { name: 'currency1', type: 'address' },
            { name: 'fee', type: 'uint24' },
            { name: 'tickSpacing', type: 'int24' },
            { name: 'hooks', type: 'address' },
          ],
        },
        { name: 'zeroForOne', type: 'bool' },
        { name: 'amountIn', type: 'uint256' },
        { name: 'amountOutMinimum', type: 'uint256' },
        { name: 'sqrtPriceLimitX96', type: 'uint160' },
        { name: 'hookData', type: 'bytes' },
      ],
    }],
    outputs: [{ name: 'amountOut', type: 'uint256' }],
    stateMutability: 'payable',
  },
] as const

// ERC20 ABI
const ERC20_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
] as const

async function main() {
  const account = privateKeyToAccount(TEST_WALLET_PRIVATE_KEY)
  
  const publicClient = createPublicClient({
    chain: luxDev as any,
    transport: http(RPC_URL),
  })
  
  const walletClient = createWalletClient({
    account,
    chain: luxDev as any,
    transport: http(RPC_URL),
  })

  console.log('=== Testing LuxDev DEX Precompiles ===\n')
  console.log('Account:', account.address)

  // 1. Check if POOL_MANAGER precompile exists (check code at address)
  console.log('\n--- Checking precompile existence ---')
  const poolManagerCode = await publicClient.getCode({ address: POOL_MANAGER as `0x${string}` })
  const swapRouterCode = await publicClient.getCode({ address: SWAP_ROUTER as `0x${string}` })
  console.log(`PoolManager (0x0400) code: ${poolManagerCode ? poolManagerCode.slice(0, 20) + '...' : 'NONE'}`)
  console.log(`SwapRouter (0x0401) code: ${swapRouterCode ? swapRouterCode.slice(0, 20) + '...' : 'NONE'}`)

  // 2. Try to get pool state
  console.log('\n--- Checking pool state ---')
  const pools = [
    { name: 'WLUX/LETH', token0: TOKENS.WLUX, token1: TOKENS.LETH },
    { name: 'WLUX/LUSD', token0: TOKENS.WLUX, token1: TOKENS.LUSD },
    { name: 'WLUX/LBTC', token0: TOKENS.WLUX, token1: TOKENS.LBTC },
  ]

  for (const pool of pools) {
    const [currency0, currency1] = sortTokens(pool.token0, pool.token1)
    const poolKey = {
      currency0: currency0 as `0x${string}`,
      currency1: currency1 as `0x${string}`,
      fee: FEE,
      tickSpacing: TICK_SPACING,
      hooks: NO_HOOKS as `0x${string}`,
    }

    try {
      const [sqrtPriceX96, tick, protocolFee, lpFee] = await publicClient.readContract({
        address: POOL_MANAGER as `0x${string}`,
        abi: POOL_MANAGER_ABI,
        functionName: 'getSlot0',
        args: [poolKey],
      })
      console.log(`${pool.name}: sqrtPriceX96=${sqrtPriceX96}, tick=${tick}`)
      
      const liquidity = await publicClient.readContract({
        address: POOL_MANAGER as `0x${string}`,
        abi: POOL_MANAGER_ABI,
        functionName: 'getLiquidity',
        args: [poolKey],
      })
      console.log(`${pool.name}: liquidity=${liquidity}`)
    } catch (error: any) {
      console.log(`${pool.name}: ERROR - ${error.message?.slice(0, 100)}`)
    }
  }

  // 3. Check token balances
  console.log('\n--- Token balances ---')
  for (const [symbol, address] of Object.entries(TOKENS)) {
    try {
      const balance = await publicClient.readContract({
        address: address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [account.address],
      })
      console.log(`${symbol}: ${balance}`)
    } catch (error: any) {
      console.log(`${symbol}: ERROR - ${error.message?.slice(0, 50)}`)
    }
  }

  // 4. Try a swap (WLUX -> LETH)
  console.log('\n--- Attempting swap: WLUX -> LETH ---')
  const [currency0, currency1] = sortTokens(TOKENS.WLUX, TOKENS.LETH)
  const zeroForOne = TOKENS.WLUX.toLowerCase() < TOKENS.LETH.toLowerCase()
  
  console.log(`Pool key: currency0=${currency0}, currency1=${currency1}`)
  console.log(`zeroForOne: ${zeroForOne} (WLUX is ${zeroForOne ? 'currency0' : 'currency1'})`)

  // Approve WLUX to SwapRouter
  console.log('\nApproving WLUX...')
  const approveHash = await walletClient.writeContract({
    address: TOKENS.WLUX as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'approve',
    args: [SWAP_ROUTER as `0x${string}`, parseEther('1000')],
  })
  await publicClient.waitForTransactionReceipt({ hash: approveHash })
  console.log('Approved')

  // Get balances before
  const wluxBefore = await publicClient.readContract({
    address: TOKENS.WLUX as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [account.address],
  }) as bigint
  const lethBefore = await publicClient.readContract({
    address: TOKENS.LETH as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [account.address],
  }) as bigint

  console.log(`Before: WLUX=${wluxBefore}, LETH=${lethBefore}`)

  // Execute swap
  const poolKey = {
    currency0: currency0 as `0x${string}`,
    currency1: currency1 as `0x${string}`,
    fee: FEE,
    tickSpacing: TICK_SPACING,
    hooks: NO_HOOKS as `0x${string}`,
  }

  const swapParams = {
    poolKey,
    zeroForOne,
    amountIn: parseEther('0.1'),
    amountOutMinimum: BigInt(0),
    sqrtPriceLimitX96: BigInt(0), // 0 means no price limit
    hookData: '0x' as `0x${string}`,
  }

  console.log('\nExecuting swap...')
  console.log('Swap params:', JSON.stringify(swapParams, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2))

  try {
    const swapHash = await walletClient.writeContract({
      address: SWAP_ROUTER as `0x${string}`,
      abi: SWAP_ROUTER_ABI,
      functionName: 'exactInputSingle',
      args: [swapParams],
    })
    console.log(`Swap tx hash: ${swapHash}`)
    
    const receipt = await publicClient.waitForTransactionReceipt({ hash: swapHash })
    console.log(`Swap status: ${receipt.status}`)
    console.log(`Gas used: ${receipt.gasUsed}`)

    // Get balances after
    const wluxAfter = await publicClient.readContract({
      address: TOKENS.WLUX as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [account.address],
    }) as bigint
    const lethAfter = await publicClient.readContract({
      address: TOKENS.LETH as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [account.address],
    }) as bigint

    console.log(`\nAfter: WLUX=${wluxAfter}, LETH=${lethAfter}`)
    console.log(`WLUX diff: ${wluxBefore - wluxAfter}`)
    console.log(`LETH diff: ${lethAfter - lethBefore}`)

    if (wluxAfter < wluxBefore && lethAfter > lethBefore) {
      console.log('\n✅ SWAP SUCCESSFUL - Balances changed correctly!')
    } else {
      console.log('\n❌ SWAP FAILED - Balances did not change as expected')
    }
  } catch (error: any) {
    console.log(`Swap failed: ${error.message}`)
    console.log(error)
  }
}

main().catch(console.error)
