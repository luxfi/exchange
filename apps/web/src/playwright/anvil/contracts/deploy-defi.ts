/**
 * Viem-based DeFi Stack Deployment
 *
 * Deploys real AMM contracts to luxd dev mode using viem.
 * More reliable than forge script for E2E testing.
 *
 * Deployment order (deterministic CREATE addresses from deployer nonce 0):
 * - WLUX: nonce 0 -> 0x5FbDB2315678afecb367f032d93F642f64180aa3
 * - LETH: nonce 1 -> 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
 * - LBTC: nonce 2 -> 0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0
 * - LUSD: nonce 3 -> 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
 * - Factory: nonce 4 -> 0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9
 * - Router: nonce 5 -> 0x5FC8d32690cc91D4c39d9d3abcBD16989F875707
 */

import { createWalletClient, createPublicClient, http, parseEther, parseUnits, formatEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import type { Hex, Address, Chain } from 'viem'
import * as fs from 'fs'
import * as path from 'path'

// Standard test wallet (Anvil account 0)
const TEST_WALLET_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as Hex
const TEST_WALLET_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address

// Expected deterministic addresses (from deployer nonce 0-5)
export const EXPECTED_ADDRESSES = {
  WLUX: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address,
  LETH: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' as Address,
  LBTC: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' as Address,
  LUSD: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9' as Address,
  Factory: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9' as Address,
  Router: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707' as Address,
}

// Path to forge artifacts
const STANDARD_PATH = path.join(process.env.HOME || '', 'work', 'lux', 'standard')

// Map of contract names to their actual artifact names (folder/file)
const ARTIFACT_NAMES: Record<string, { folder: string; file: string }> = {
  WLUX: { folder: 'WLUX.sol', file: 'WLUX.json' },
  LETH: { folder: 'LETH.sol', file: 'LuxETH.json' },
  LBTC: { folder: 'LBTC.sol', file: 'LuxBTC.json' },
  LUSD: { folder: 'LUSD.sol', file: 'LuxUSD.json' },
  AMMV2Factory: { folder: 'AMMV2Factory.sol', file: 'AMMV2Factory.json' },
  AMMV2Router: { folder: 'AMMV2Router.sol', file: 'AMMV2Router.json' },
}

// Load contract artifact from forge output
function loadArtifact(name: string): { abi: any[]; bytecode: Hex } {
  const mapping = ARTIFACT_NAMES[name]
  if (!mapping) {
    throw new Error(`Unknown contract: ${name}. Add mapping to ARTIFACT_NAMES.`)
  }
  const artifactPath = path.join(STANDARD_PATH, 'out', mapping.folder, mapping.file)
  if (!fs.existsSync(artifactPath)) {
    throw new Error(`Contract artifact not found: ${artifactPath}`)
  }
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf-8'))
  return {
    abi: artifact.abi,
    bytecode: artifact.bytecode.object as Hex,
  }
}

export interface DeployResult {
  wlux: Address
  leth: Address
  lbtc: Address
  lusd: Address
  ammFactory: Address
  ammRouter: Address
  pools: {
    wluxLeth: Address
    wluxLusd: Address
    wluxLbtc: Address
  }
}

export interface DeployOptions {
  rpcUrl: string
  chain: Chain
  verbose?: boolean
}

/**
 * Deploy the complete DeFi stack using viem
 */
export async function deployDeFiStack(options: DeployOptions): Promise<DeployResult> {
  const { rpcUrl, chain, verbose = true } = options

  const log = verbose ? console.log : () => {}

  log('=== Deploying DeFi Stack via Viem ===')
  log(`RPC URL: ${rpcUrl}`)
  log(`Chain ID: ${chain.id}`)

  // Create clients
  const account = privateKeyToAccount(TEST_WALLET_PRIVATE_KEY)
  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(rpcUrl, { timeout: 60_000 }),
  })
  const publicClient = createPublicClient({
    chain,
    transport: http(rpcUrl, { timeout: 60_000 }),
  })

  // Check balance
  const balance = await publicClient.getBalance({ address: account.address })
  log(`Deployer balance: ${formatEther(balance)} LUX`)

  if (balance < parseEther('100')) {
    throw new Error(`Insufficient balance: ${formatEther(balance)} LUX. Need at least 100 LUX.`)
  }

  // Check nonce - should be 0 for deterministic addresses
  const nonce = await publicClient.getTransactionCount({ address: account.address })
  if (nonce !== 0) {
    log(`WARNING: Deployer nonce is ${nonce}, expected 0. Addresses will not match expected values.`)
  }

  // Deploy contracts in order
  log('\n--- Deploying Core Tokens ---')

  // 1. WLUX (nonce 0)
  log('Deploying WLUX...')
  const wlux = await deployContract(walletClient, publicClient, loadArtifact('WLUX'), [])
  log(`  WLUX: ${wlux}`)
  if (wlux.toLowerCase() !== EXPECTED_ADDRESSES.WLUX.toLowerCase()) {
    log(`  WARNING: Expected ${EXPECTED_ADDRESSES.WLUX}`)
  }

  // 2. LETH (nonce 1)
  log('Deploying LETH...')
  const leth = await deployContract(walletClient, publicClient, loadArtifact('LETH'), [])
  log(`  LETH: ${leth}`)

  // 3. LBTC (nonce 2)
  log('Deploying LBTC...')
  const lbtc = await deployContract(walletClient, publicClient, loadArtifact('LBTC'), [])
  log(`  LBTC: ${lbtc}`)

  // 4. LUSD (nonce 3)
  log('Deploying LUSD...')
  const lusd = await deployContract(walletClient, publicClient, loadArtifact('LUSD'), [])
  log(`  LUSD: ${lusd}`)

  // 5. AMM Factory (nonce 4)
  log('\n--- Deploying AMM ---')
  log('Deploying AMMV2Factory...')
  const ammFactory = await deployContract(walletClient, publicClient, loadArtifact('AMMV2Factory'), [account.address])
  log(`  Factory: ${ammFactory}`)

  // 6. AMM Router (nonce 5)
  log('Deploying AMMV2Router...')
  const ammRouter = await deployContract(walletClient, publicClient, loadArtifact('AMMV2Router'), [ammFactory, wlux])
  log(`  Router: ${ammRouter}`)

  // Mint tokens for liquidity
  log('\n--- Minting Tokens ---')

  const { abi: erc20MintableAbi } = loadArtifact('LETH') // All bridged tokens have mint()

  // Helper to send transaction and wait for receipt
  async function sendAndWait(args: Parameters<typeof walletClient.writeContract>[0]): Promise<void> {
    const hash = await walletClient.writeContract(args)
    const receipt = await publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 })
    if (receipt.status !== 'success') {
      throw new Error(`Transaction failed: ${hash}`)
    }
  }

  // Mint LETH (100 ETH worth)
  log('Minting 100 LETH...')
  await sendAndWait({
    address: leth,
    abi: erc20MintableAbi,
    functionName: 'mint',
    args: [account.address, parseEther('100')],
  })

  // Mint LBTC (10 BTC, 8 decimals)
  log('Minting 10 LBTC...')
  await sendAndWait({
    address: lbtc,
    abi: erc20MintableAbi,
    functionName: 'mint',
    args: [account.address, parseUnits('10', 8)],
  })

  // Mint LUSD (100,000 USDC, 6 decimals)
  log('Minting 100,000 LUSD...')
  await sendAndWait({
    address: lusd,
    abi: erc20MintableAbi,
    functionName: 'mint',
    args: [account.address, parseUnits('100000', 6)],
  })

  // Wrap some LUX
  log('Wrapping 1000 LUX...')
  const { abi: wluxAbi } = loadArtifact('WLUX')
  await sendAndWait({
    address: wlux,
    abi: wluxAbi,
    functionName: 'deposit',
    value: parseEther('1000'),
  })

  // Create liquidity pools
  log('\n--- Creating Liquidity Pools ---')

  const { abi: routerAbi } = loadArtifact('AMMV2Router')
  const { abi: factoryAbi } = loadArtifact('AMMV2Factory')

  // Approve router for all tokens
  log('Approving router for tokens...')
  const maxApproval = parseEther('1000000000') // 1B tokens

  await sendAndWait({
    address: wlux,
    abi: wluxAbi,
    functionName: 'approve',
    args: [ammRouter, maxApproval],
  })
  await sendAndWait({
    address: leth,
    abi: erc20MintableAbi,
    functionName: 'approve',
    args: [ammRouter, maxApproval],
  })
  await sendAndWait({
    address: lbtc,
    abi: erc20MintableAbi,
    functionName: 'approve',
    args: [ammRouter, maxApproval],
  })
  await sendAndWait({
    address: lusd,
    abi: erc20MintableAbi,
    functionName: 'approve',
    args: [ammRouter, maxApproval],
  })

  const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600) // 1 hour

  // WLUX/LETH pool: 100 WLUX + 10 LETH (1 WLUX = 0.1 ETH)
  log('Creating WLUX/LETH pool (100 WLUX + 10 LETH)...')
  await sendAndWait({
    address: ammRouter,
    abi: routerAbi,
    functionName: 'addLiquidity',
    args: [wlux, leth, parseEther('100'), parseEther('10'), 0n, 0n, account.address, deadline],
  })

  // WLUX/LUSD pool: 500 WLUX + 10000 LUSD (1 WLUX = $20)
  log('Creating WLUX/LUSD pool (500 WLUX + 10,000 LUSD)...')
  await sendAndWait({
    address: ammRouter,
    abi: routerAbi,
    functionName: 'addLiquidity',
    args: [wlux, lusd, parseEther('500'), parseUnits('10000', 6), 0n, 0n, account.address, deadline],
  })

  // WLUX/LBTC pool: 200 WLUX + 0.5 LBTC (1 WLUX = 0.0025 BTC)
  log('Creating WLUX/LBTC pool (200 WLUX + 0.5 LBTC)...')
  await sendAndWait({
    address: ammRouter,
    abi: routerAbi,
    functionName: 'addLiquidity',
    args: [wlux, lbtc, parseEther('200'), parseUnits('0.5', 8), 0n, 0n, account.address, deadline],
  })

  // Get pool addresses
  const wluxLethPool = await publicClient.readContract({
    address: ammFactory,
    abi: factoryAbi,
    functionName: 'getPair',
    args: [wlux, leth],
  }) as Address

  const wluxLusdPool = await publicClient.readContract({
    address: ammFactory,
    abi: factoryAbi,
    functionName: 'getPair',
    args: [wlux, lusd],
  }) as Address

  const wluxLbtcPool = await publicClient.readContract({
    address: ammFactory,
    abi: factoryAbi,
    functionName: 'getPair',
    args: [wlux, lbtc],
  }) as Address

  log('\n=== Deployment Complete ===')
  log(`WLUX: ${wlux}`)
  log(`LETH: ${leth}`)
  log(`LBTC: ${lbtc}`)
  log(`LUSD: ${lusd}`)
  log(`AMM Factory: ${ammFactory}`)
  log(`AMM Router: ${ammRouter}`)
  log(`WLUX/LETH Pool: ${wluxLethPool}`)
  log(`WLUX/LUSD Pool: ${wluxLusdPool}`)
  log(`WLUX/LBTC Pool: ${wluxLbtcPool}`)

  return {
    wlux,
    leth,
    lbtc,
    lusd,
    ammFactory,
    ammRouter,
    pools: {
      wluxLeth: wluxLethPool,
      wluxLusd: wluxLusdPool,
      wluxLbtc: wluxLbtcPool,
    },
  }
}

/**
 * Deploy a single contract and wait for confirmation
 */
async function deployContract(
  walletClient: any,
  publicClient: any,
  artifact: { abi: any[]; bytecode: Hex },
  args: any[],
): Promise<Address> {
  const hash = await walletClient.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode,
    args,
  })

  const receipt = await publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 })

  if (receipt.status !== 'success') {
    throw new Error(`Contract deployment failed: ${hash}`)
  }

  if (!receipt.contractAddress) {
    throw new Error(`No contract address in receipt: ${hash}`)
  }

  return receipt.contractAddress
}
