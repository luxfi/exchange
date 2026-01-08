/**
 * Deploy LuxDev liquidity pools
 * Creates pools for WLUX/LETH, WLUX/LBTC, WLUX/LUSD and adds liquidity
 */
import { createWalletClient, createPublicClient, http, parseEther, parseUnits, encodeFunctionData } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

const TEST_WALLET_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const RPC_URL = 'http://127.0.0.1:8545/ext/bc/C/rpc'

// LuxDev chain definition
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

// Pool parameters
const FEE = 3000 // 0.3%
const TICK_SPACING = 60
const NO_HOOKS = '0x0000000000000000000000000000000000000000'

// sqrtPriceX96 for 1:1 price = 2^96
const SQRT_PRICE_1_1 = BigInt('79228162514264337593543950336')

// For LBTC (8 decimals) vs WLUX (18 decimals)
// If 1 LBTC = 100000 WLUX, price = 100000 * 10^10 = 10^15
// sqrtPriceX96 = sqrt(10^15) * 2^96
const SQRT_PRICE_LBTC = BigInt('2505414483750479311864222720000000000000')

// Pool Manager ABI subset
const POOL_MANAGER_ABI = [
  {
    type: 'function',
    name: 'initialize',
    inputs: [
      {
        name: 'key',
        type: 'tuple',
        components: [
          { name: 'currency0', type: 'address' },
          { name: 'currency1', type: 'address' },
          { name: 'fee', type: 'uint24' },
          { name: 'tickSpacing', type: 'int24' },
          { name: 'hooks', type: 'address' },
        ],
      },
      { name: 'sqrtPriceX96', type: 'uint160' },
    ],
    outputs: [{ name: 'tick', type: 'int24' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'modifyLiquidity',
    inputs: [
      {
        name: 'key',
        type: 'tuple',
        components: [
          { name: 'currency0', type: 'address' },
          { name: 'currency1', type: 'address' },
          { name: 'fee', type: 'uint24' },
          { name: 'tickSpacing', type: 'int24' },
          { name: 'hooks', type: 'address' },
        ],
      },
      {
        name: 'params',
        type: 'tuple',
        components: [
          { name: 'tickLower', type: 'int24' },
          { name: 'tickUpper', type: 'int24' },
          { name: 'liquidityDelta', type: 'int256' },
          { name: 'salt', type: 'bytes32' },
        ],
      },
      { name: 'hookData', type: 'bytes' },
    ],
    outputs: [
      { name: 'callerDelta', type: 'int256' },
      { name: 'feesAccrued', type: 'int256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'settle',
    inputs: [{ name: 'currency', type: 'address' }],
    outputs: [{ name: 'amount', type: 'uint256' }],
    stateMutability: 'payable',
  },
] as const

// ERC20 ABI for approve
const ERC20_ABI = [
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

// Sort addresses for pool key (currency0 < currency1)
function sortTokens(tokenA: string, tokenB: string): [string, string] {
  return tokenA.toLowerCase() < tokenB.toLowerCase()
    ? [tokenA, tokenB]
    : [tokenB, tokenA]
}

async function main() {
  const account = privateKeyToAccount(TEST_WALLET_PRIVATE_KEY)
  
  const walletClient = createWalletClient({
    account,
    chain: luxDev as any,
    transport: http(RPC_URL),
  })
  
  const publicClient = createPublicClient({
    chain: luxDev as any,
    transport: http(RPC_URL),
  })

  console.log('Deploying LuxDev liquidity pools...')
  console.log('Account:', account.address)

  // Pool configurations
  const pools = [
    { token0: TOKENS.WLUX, token1: TOKENS.LETH, sqrtPrice: SQRT_PRICE_1_1, name: 'WLUX/LETH' },
    { token0: TOKENS.WLUX, token1: TOKENS.LUSD, sqrtPrice: SQRT_PRICE_1_1, name: 'WLUX/LUSD' },
    { token0: TOKENS.WLUX, token1: TOKENS.LBTC, sqrtPrice: SQRT_PRICE_LBTC, name: 'WLUX/LBTC' },
  ]

  // First approve all tokens
  console.log('\n=== Approving tokens ===')
  for (const token of Object.values(TOKENS)) {
    const hash = await walletClient.writeContract({
      address: token as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [POOL_MANAGER as `0x${string}`, parseEther('1000000')],
    })
    console.log(`Approved ${token}: ${hash}`)
    await publicClient.waitForTransactionReceipt({ hash })
  }

  // Initialize pools and add liquidity
  console.log('\n=== Creating pools ===')
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
      // Initialize pool
      console.log(`\nInitializing ${pool.name}...`)
      const initHash = await walletClient.writeContract({
        address: POOL_MANAGER as `0x${string}`,
        abi: POOL_MANAGER_ABI,
        functionName: 'initialize',
        args: [poolKey, pool.sqrtPrice],
      })
      console.log(`Initialize tx: ${initHash}`)
      await publicClient.waitForTransactionReceipt({ hash: initHash })
      console.log(`Pool ${pool.name} initialized!`)

      // Add liquidity (full range)
      console.log(`Adding liquidity to ${pool.name}...`)
      const liquidityParams = {
        tickLower: -887220, // Min tick for 60 spacing
        tickUpper: 887220,  // Max tick for 60 spacing
        liquidityDelta: BigInt('1000000000000000000000'), // 1000 units
        salt: '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
      }

      const liqHash = await walletClient.writeContract({
        address: POOL_MANAGER as `0x${string}`,
        abi: POOL_MANAGER_ABI,
        functionName: 'modifyLiquidity',
        args: [poolKey, liquidityParams, '0x'],
      })
      console.log(`ModifyLiquidity tx: ${liqHash}`)
      await publicClient.waitForTransactionReceipt({ hash: liqHash })
      console.log(`Liquidity added to ${pool.name}!`)

    } catch (error: any) {
      console.error(`Error with ${pool.name}:`, error.message)
    }
  }

  console.log('\n=== Deployment complete ===')
}

main().catch(console.error)
