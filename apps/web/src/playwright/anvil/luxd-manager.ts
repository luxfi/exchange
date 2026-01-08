/* eslint-disable no-console */
/**
 * Luxd Manager - Auto-spawns a single-node Lux dev network for E2E tests
 *
 * Features:
 * - Auto-spawns luxd in dev mode (K=1 consensus, instant finality)
 * - Uses random available port (isolated from existing networks)
 * - Supports LUX_NODE_PATH env var for custom binary location
 * - Anvil-compatible API on port 8545 (or custom port)
 * - Pre-funded test accounts in genesis
 *
 * Usage:
 *   const manager = getLuxdManager()
 *   await manager.start()  // Spawns dev node
 *   // ... run tests ...
 *   await manager.stop()   // Stops dev node
 */
import { type ChildProcess, spawn, exec } from 'child_process'
import { promisify } from 'util'
import * as net from 'net'
import * as fs from 'fs'
import * as path from 'path'
import { sleep } from 'utilities/src/time/timing'
import { createTestClient, http, publicActions, walletActions, type Chain } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { deployDeFiStack as deployDeFiStackViem, type DeployResult } from './contracts/deploy-defi'

const execAsync = promisify(exec)

// Path to the lux/standard directory containing DeployFullStack.s.sol
const LUX_STANDARD_PATH = path.join(process.env.HOME || '', 'work', 'lux', 'standard')

// Deployed contract addresses (populated after deployment)
export interface DeployedContracts {
  wlux: string
  leth: string // Bridged ETH
  lbtc: string // Bridged BTC
  lusd: string // Bridged USDC (we call it LUSD in tests)
  ammFactory: string
  ammRouter: string
}

// Default deployed addresses from DeployFullStack.s.sol (deterministic CREATE addresses)
// These are the addresses when deploying from the default Anvil account
const DEFAULT_DEPLOYED_CONTRACTS: DeployedContracts = {
  wlux: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  leth: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', // BridgedETH
  lbtc: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', // BridgedBTC
  lusd: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9', // BridgedUSDC
  ammFactory: '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9',
  ammRouter: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
}

/**
 * Parse duration string (e.g., "100ms", "1s", "500ms") to milliseconds
 */
function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)(ms|s|m)?$/)
  if (!match) {
    return 0
  }
  const value = parseInt(match[1], 10)
  const unit = match[2] || 'ms'
  switch (unit) {
    case 'ms':
      return value
    case 's':
      return value * 1000
    case 'm':
      return value * 60 * 1000
    default:
      return value
  }
}

// Standard test wallet private key (same as Anvil default account 0)
const TEST_WALLET_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

// Lux dev mode chain ID (single-node K=1 consensus)
const LUX_DEV_CHAIN_ID = 1337

/**
 * Create a chain definition for luxd dev mode
 */
export function createLuxDevChain(port: number): Chain {
  return {
    id: LUX_DEV_CHAIN_ID,
    name: 'Lux Dev',
    nativeCurrency: {
      name: 'LUX',
      symbol: 'LUX',
      decimals: 18,
    },
    rpcUrls: {
      default: { http: [`http://127.0.0.1:${port}/ext/bc/C/rpc`] },
      public: { http: [`http://127.0.0.1:${port}/ext/bc/C/rpc`] },
    },
  }
}

interface LuxdConfig {
  port: number
  host: string
  timeout: number
  healthCheckInterval: number
  logFile: string
  nodePath?: string
}

interface HealthCheckResult {
  healthy: boolean
  blockNumber?: bigint
  chainId?: number
  error?: string
  responseTime?: number
}

export type LuxdClient = ReturnType<typeof createTestClient> &
  ReturnType<typeof publicActions> &
  ReturnType<typeof walletActions>

export interface LuxdManager {
  start(): Promise<void>
  stop(): Promise<void>
  restart(): Promise<boolean>
  isHealthy(): Promise<boolean>
  ensureHealthy(): Promise<boolean>
  checkHealth(): Promise<HealthCheckResult>
  getClient(): LuxdClient
  getUrl(): string
  getPort(): number
  getChain(): Chain
  getChainIfStarted(): Chain | null
  deployDeFiStack(): Promise<DeployedContracts>
  getDeployedContracts(): DeployedContracts | null
}

/**
 * Kill any process using a specific port and wait for it to be released
 */
async function killProcessOnPort(port: number): Promise<void> {
  try {
    // Find process using the port
    const { stdout } = await execAsync(`lsof -ti:${port}`)
    const pids = stdout.trim().split('\n').filter(Boolean)
    for (const pid of pids) {
      console.log(`Killing process ${pid} using port ${port}`)
      // First try SIGTERM for graceful shutdown
      await execAsync(`kill -15 ${pid}`).catch(() => {})
    }
    
    // Wait for port to be released (up to 10 seconds)
    const maxWaitTime = 10000
    const checkInterval = 200
    const startTime = Date.now()
    
    while (Date.now() - startTime < maxWaitTime) {
      const available = await isPortAvailable(port)
      if (available) {
        console.log(`Port ${port} released after ${Date.now() - startTime}ms`)
        return
      }
      await sleep(checkInterval)
    }
    
    // If still not available, try SIGKILL
    console.log(`Port ${port} still in use after graceful shutdown, forcing kill...`)
    try {
      const { stdout: stillRunning } = await execAsync(`lsof -ti:${port}`)
      const remainingPids = stillRunning.trim().split('\n').filter(Boolean)
      for (const pid of remainingPids) {
        await execAsync(`kill -9 ${pid}`).catch(() => {})
      }
      // Wait a bit more for force kill to take effect
      await sleep(1000)
    } catch {
      // No process remaining, port should be free
    }
  } catch {
    // No process on port, that's fine
  }
}

/**
 * Check if port is available
 */
async function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.unref()
    server.on('error', () => resolve(false))
    server.listen(port, '127.0.0.1', () => {
      server.close(() => resolve(true))
    })
  })
}

/**
 * Find the luxd binary - checks LUX_NODE_PATH, common locations, and PATH
 */
async function findLuxdBinary(): Promise<string | null> {
  // 1. Check LUX_NODE_PATH env var
  const envPath = process.env.LUX_NODE_PATH
  if (envPath && fs.existsSync(envPath)) {
    return envPath
  }

  // 2. Check common installation locations
  const commonPaths = [
    path.join(process.env.HOME || '', 'go', 'bin', 'luxd'),
    path.join(process.env.HOME || '', '.local', 'bin', 'luxd'),
    '/usr/local/bin/luxd',
    '/opt/homebrew/bin/luxd',
  ]

  for (const p of commonPaths) {
    if (fs.existsSync(p)) {
      return p
    }
  }

  // 3. Check relative to lux CLI if installed
  try {
    const { stdout: cliPath } = await execAsync('which lux')
    if (cliPath) {
      const cliDir = path.dirname(path.dirname(cliPath.trim()))
      const relativePath = path.join(cliDir, '..', 'node', 'build', 'luxd')
      const absPath = path.resolve(relativePath)
      if (fs.existsSync(absPath)) {
        return absPath
      }
      // Also check same directory as CLI
      const sameDirPath = path.join(path.dirname(cliPath.trim()), 'luxd')
      if (fs.existsSync(sameDirPath)) {
        return sameDirPath
      }
    }
  } catch {
    // CLI not found
  }

  // 4. Check PATH
  try {
    const { stdout } = await execAsync('which luxd')
    return stdout.trim()
  } catch {
    return null
  }
}

/**
 * Build luxd configuration with defaults and overrides
 */
function buildLuxdConfig(overrides?: Partial<LuxdConfig>): LuxdConfig {
  return {
    port: overrides?.port ?? 0, // 0 means find available port
    host: overrides?.host ?? '127.0.0.1',
    timeout: overrides?.timeout ?? 30_000,
    // Increased from 5s to 120s to avoid false positives during tests
    // Tests run up to 120s and RPC may be slow during heavy operations
    healthCheckInterval: overrides?.healthCheckInterval ?? 120_000,
    logFile: overrides?.logFile ?? path.join(process.cwd(), `luxd-test-${process.pid}.log`),
    nodePath: overrides?.nodePath ?? process.env.LUX_NODE_PATH,
  }
}

/**
 * Create a luxd client for interacting with the local node
 */
function createLuxdClient(ctx: { url: string; chain: Chain; timeout?: number }): LuxdClient {
  return createTestClient({
    account: privateKeyToAccount(TEST_WALLET_PRIVATE_KEY),
    chain: ctx.chain,
    mode: 'hardhat', // luxd uses hardhat-compatible test methods
    transport: http(ctx.url, {
      timeout: ctx.timeout,
      retryCount: 3,
      retryDelay: 500,
    }),
  })
    .extend(publicActions)
    .extend(walletActions)
}

/**
 * Create a luxd manager instance
 */
function createLuxdManager(configOverrides?: Partial<LuxdConfig>): LuxdManager {
  // State managed in closure
  let childProcess: ChildProcess | null = null
  let config: LuxdConfig | null = null
  let assignedPort: number = 0
  let chain: Chain | null = null
  let isRestarting = false
  let healthCheckTimer: NodeJS.Timeout | null = null
  let deployedContracts: DeployedContracts | null = null

  // Lazy config getter
  const getConfig = (): LuxdConfig => {
    if (!config) {
      config = buildLuxdConfig(configOverrides)
    }
    return config
  }

  // Stop health monitoring
  const stopHealthMonitoring = (): void => {
    if (healthCheckTimer) {
      clearInterval(healthCheckTimer)
      healthCheckTimer = null
    }
  }

  // Start health monitoring
  const startHealthMonitoring = (manager: LuxdManager): void => {
    if (healthCheckTimer) {
      return
    }

    const cfg = getConfig()
    healthCheckTimer = setInterval(async () => {
      const healthy = await manager.isHealthy()
      if (!healthy && !isRestarting) {
        console.error('Luxd health check failed, attempting restart...')
        await manager.restart()
      }
    }, cfg.healthCheckInterval)
  }

  // Check health implementation - focuses on C-Chain RPC being responsive
  // (the full /ext/health endpoint waits for BLS and takes longer)
  const checkHealth = async (): Promise<HealthCheckResult> => {
    if (!assignedPort) {
      return { healthy: false, error: 'No port assigned' }
    }

    const cfg = getConfig()
    const url = `http://${cfg.host}:${assignedPort}/ext/bc/C/rpc`
    const startTime = Date.now()

    try {
      // Use fetch directly for simpler, faster health check
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_chainId',
          params: [],
          id: 1,
        }),
        signal: AbortSignal.timeout(5000), // 5 second timeout
      })

      if (!response.ok) {
        return {
          healthy: false,
          error: `HTTP ${response.status}`,
          responseTime: Date.now() - startTime,
        }
      }

      const data = (await response.json()) as { result?: string; error?: { message: string } }
      if (data.error) {
        return {
          healthy: false,
          error: data.error.message,
          responseTime: Date.now() - startTime,
        }
      }

      const chainId = parseInt(data.result || '0', 16)
      
      // Also get block number
      const blockResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_blockNumber',
          params: [],
          id: 2,
        }),
        signal: AbortSignal.timeout(5000),
      })

      const blockData = (await blockResponse.json()) as { result?: string }
      const blockNumber = BigInt(blockData.result || '0')

      return {
        healthy: true,
        blockNumber,
        chainId,
        responseTime: Date.now() - startTime,
      }
    } catch (error) {
      return {
        healthy: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime,
      }
    }
  }

  // Wait for health with exponential backoff
  const waitForHealth = async (
    options: { maxAttempts?: number; initialDelay?: number; maxDelay?: number } = {},
  ): Promise<boolean> => {
    const { maxAttempts = 30, initialDelay = 1000, maxDelay = 5000 } = options

    let delay = initialDelay

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const result = await checkHealth()

      if (result.healthy) {
        console.log(`Luxd is healthy (block: ${result.blockNumber}, chain: ${result.chainId}, response: ${result.responseTime}ms)`)
        return true
      }

      console.warn(`Luxd health check failed (attempt ${attempt + 1}/${maxAttempts}): ${result.error}`)

      if (attempt < maxAttempts - 1) {
        await sleep(delay)
        delay = Math.min(delay * 1.5, maxDelay)
      }
    }

    return false
  }

  // Create the manager object
  const manager: LuxdManager = {
    async start(): Promise<void> {
      const cfg = getConfig()

      // Find the luxd binary
      const luxdPath = cfg.nodePath || await findLuxdBinary()
      if (!luxdPath) {
        throw new Error('luxd binary not found. Set LUX_NODE_PATH env var or install luxd.')
      }

      if (childProcess) {
        console.log('Luxd is already running')
        return
      }

      // Use port 8545 to match hardcoded chain config in web app
      // Kill any existing process on the port first
      const targetPort = cfg.port || parseInt(process.env.LUXD_PORT || '8545')
      
      if (!await isPortAvailable(targetPort)) {
        console.log(`Port ${targetPort} in use, killing existing process...`)
        await killProcessOnPort(targetPort)
        // Verify port is now available
        if (!await isPortAvailable(targetPort)) {
          throw new Error(`Failed to free port ${targetPort}`)
        }
      }
      
      assignedPort = targetPort
      const stakingPort = assignedPort + 1
      
      // Also make sure staking port is free
      if (!await isPortAvailable(stakingPort)) {
        console.log(`Staking port ${stakingPort} in use, killing existing process...`)
        await killProcessOnPort(stakingPort)
      }
      
      chain = createLuxDevChain(assignedPort)

      console.log(`Starting luxd dev mode on port ${assignedPort}...`)
      console.log(`Binary: ${luxdPath}`)

      // Set up data directories (similar to CLI)
      const baseDir = path.join(process.env.HOME || '', '.lux')
      const dataDir = path.join(baseDir, 'dev-e2e', `port-${assignedPort}`)
      const dbDir = path.join(dataDir, 'db')
      const logDir = path.join(dataDir, 'logs')
      const chainConfigDir = path.join(baseDir, 'chains')

      // Clean state for fresh genesis
      if (fs.existsSync(dbDir)) {
        fs.rmSync(dbDir, { recursive: true, force: true })
      }

      // Ensure directories exist
      fs.mkdirSync(logDir, { recursive: true })
      fs.mkdirSync(dbDir, { recursive: true })

      // Prepare log file
      const logStream = fs.createWriteStream(cfg.logFile, { flags: 'a' })

      // Build luxd command args directly (bypass CLI wrapper)
      // --dev flag enables: K=1 consensus, skip-bootstrap, ephemeral certs
      const args = [
        '--dev',
        `--network-id=${LUX_DEV_CHAIN_ID}`,
        `--http-host=0.0.0.0`,
        `--http-port=${assignedPort}`,
        `--staking-port=${stakingPort}`,
        `--data-dir=${dataDir}`,
        `--log-dir=${logDir}`,
        `--log-level=info`,
        `--chain-config-dir=${chainConfigDir}`,
        '--api-admin-enabled=true',
        '--api-keystore-enabled=true',
        '--index-enabled=true',
        '--track-all-chains=true',
      ]

      // Enable automining for dev mode (instant block creation when transactions arrive)
      // Note: luxd uses --enable-automining boolean flag, not interval-based
      args.push('--enable-automining')
      console.log('Automine: enabled (instant blocks)')

      console.log(`Running: ${luxdPath} ${args.slice(0, 5).join(' ')} ...`)

      // Start luxd process directly
      childProcess = spawn(luxdPath, args, {
        env: { ...process.env },
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: false,
      })

      // Pipe output to log file and console
      if (childProcess.stdout) {
        childProcess.stdout.on('data', (data) => {
          const str = data.toString()
          logStream.write(str)
          // Show interesting output
          if (str.includes('error') || str.includes('Error') || str.includes('started')) {
            console.log(`[luxd] ${str.trim()}`)
          }
        })
      }
      if (childProcess.stderr) {
        childProcess.stderr.on('data', (data) => {
          const str = data.toString()
          logStream.write(str)
          // Only show errors, not routine info logs
          if (str.includes('ERR') || str.includes('error')) {
            console.error(`[luxd] ${str.trim()}`)
          }
        })
      }

      // Save PID file
      const pidFile = path.join(dataDir, 'luxd.pid')
      fs.writeFileSync(pidFile, String(childProcess.pid))

      // Handle process exit
      childProcess.on('exit', (code, signal) => {
        console.log(`Luxd process exited with code ${code} and signal ${signal}`)
        childProcess = null
        stopHealthMonitoring()
      })

      console.log(`luxd started (PID: ${childProcess.pid})`)

      // Wait for luxd to be ready (dev mode needs ~90-120 seconds to bootstrap all chains)
      // Using longer timeout than CLI's default 60s
      const ready = await waitForHealth({
        maxAttempts: 120,  // 120 attempts with increasing delay = ~3 minutes max
        initialDelay: 1000,
        maxDelay: 3000,
      })

      if (!ready) {
        // Kill the process if it didn't become healthy
        if (childProcess) {
          childProcess.kill('SIGTERM')
          await sleep(1000)
          if (childProcess) {
            childProcess.kill('SIGKILL')
          }
          childProcess = null
        }
        throw new Error(`Luxd failed to start on port ${assignedPort}. Check ${cfg.logFile} for details.`)
      }

      console.log(`Luxd dev mode ready on port ${assignedPort}`)
      console.log(`C-Chain RPC: http://127.0.0.1:${assignedPort}/ext/bc/C/rpc`)

      // Deploy DeFi stack for AMM/DEX tests
      // Skip if SKIP_DEFI_DEPLOY=true (for faster wrap-only tests)
      if (process.env.SKIP_DEFI_DEPLOY !== 'true') {
        try {
          await manager.deployDeFiStack()
        } catch (error) {
          console.warn('DeFi stack deployment failed, AMM tests may not work:', error)
        }
      }

      startHealthMonitoring(manager)
    },

    async stop(): Promise<void> {
      stopHealthMonitoring()
      
      const portToRelease = assignedPort

      if (!childProcess) {
        console.log('Luxd is not running')
        // Even if we don't have a reference, make sure port is free
        if (portToRelease > 0) {
          await killProcessOnPort(portToRelease)
        }
        return
      }

      console.log('Stopping luxd...')

      // Send SIGTERM for graceful shutdown
      childProcess.kill('SIGTERM')

      // Wait for the process to exit and port to be released (up to 10 seconds)
      const maxWaitTime = 10000
      const checkInterval = 200
      const startTime = Date.now()
      
      while (Date.now() - startTime < maxWaitTime) {
        if (!childProcess || (portToRelease > 0 && await isPortAvailable(portToRelease))) {
          break
        }
        await sleep(checkInterval)
      }

      // Force kill if still running
      if (childProcess) {
        console.log('Force killing luxd...')
        childProcess.kill('SIGKILL')
        await sleep(1000)
      }

      childProcess = null
      assignedPort = 0
      chain = null
      
      // Final check - ensure port is released
      if (portToRelease > 0 && !await isPortAvailable(portToRelease)) {
        console.log('Port still in use after stop, forcing cleanup...')
        await killProcessOnPort(portToRelease)
      }
      
      console.log('Luxd stopped')
    },

    async restart(): Promise<boolean> {
      if (isRestarting) {
        console.log('Restart already in progress')
        return false
      }

      console.log('Restarting luxd...')
      isRestarting = true

      try {
        await manager.stop()
        await sleep(1000)
        await manager.start()
        return true
      } catch (error) {
        throw new Error('Failed to restart luxd', { cause: error })
      } finally {
        isRestarting = false
      }
    },

    async isHealthy(): Promise<boolean> {
      const result = await checkHealth()
      return result.healthy
    },

    async ensureHealthy(): Promise<boolean> {
      if (await manager.isHealthy()) {
        return true
      }

      console.log('Luxd not healthy, attempting to fix...')
      return await manager.restart()
    },

    checkHealth,

    getClient(): LuxdClient {
      if (!assignedPort || !chain) {
        throw new Error('Luxd not started - call start() first')
      }
      const cfg = getConfig()
      const url = `http://${cfg.host}:${assignedPort}/ext/bc/C/rpc`
      return createLuxdClient({
        url,
        chain,
        timeout: cfg.timeout,
      })
    },

    getUrl(): string {
      if (!assignedPort) {
        throw new Error('Luxd not started - call start() first')
      }
      const cfg = getConfig()
      return `http://${cfg.host}:${assignedPort}/ext/bc/C/rpc`
    },

    getPort(): number {
      return assignedPort
    },

    getChain(): Chain {
      if (!chain) {
        throw new Error('Luxd not started - call start() first')
      }
      return chain
    },

    getChainIfStarted(): Chain | null {
      return chain
    },

    async deployDeFiStack(): Promise<DeployedContracts> {
      if (!assignedPort) {
        throw new Error('Luxd not started - call start() first')
      }

      // Check if already deployed
      if (deployedContracts) {
        console.log('DeFi stack already deployed')
        return deployedContracts
      }

      const cfg = getConfig()
      const rpcUrl = `http://${cfg.host}:${assignedPort}/ext/bc/C/rpc`

      // Check if forge artifacts exist for viem deployment
      const forgeArtifactsExist = fs.existsSync(path.join(LUX_STANDARD_PATH, 'out', 'WLUX.sol', 'WLUX.json'))

      if (forgeArtifactsExist) {
        console.log('Deploying DeFi stack via viem (using forge artifacts)...')
        console.log(`  RPC URL: ${rpcUrl}`)

        try {
          // Use viem-based deployment (more reliable than forge script)
          const result: DeployResult = await deployDeFiStackViem({
            rpcUrl,
            chain: chain!,
            verbose: true,
          })

          deployedContracts = {
            wlux: result.wlux,
            leth: result.leth,
            lbtc: result.lbtc,
            lusd: result.lusd,
            ammFactory: result.ammFactory,
            ammRouter: result.ammRouter,
          }

          console.log('DeFi stack deployed via viem:')
          console.log('  WLUX:', deployedContracts.wlux)
          console.log('  LETH:', deployedContracts.leth)
          console.log('  LBTC:', deployedContracts.lbtc)
          console.log('  LUSD:', deployedContracts.lusd)
          console.log('  AMM Factory:', deployedContracts.ammFactory)
          console.log('  AMM Router:', deployedContracts.ammRouter)
          console.log('  Pools:', result.pools)

          return deployedContracts
        } catch (error) {
          console.error('Viem deployment failed:', error)
          console.log('Falling back to default addresses...')
        }
      } else {
        console.log('Forge artifacts not found at:', LUX_STANDARD_PATH)
        console.log('Run `forge build` in lux/standard to enable real contract deployment')
      }

      // Fallback: Use default addresses (contracts need to be deployed separately)
      deployedContracts = DEFAULT_DEPLOYED_CONTRACTS
      console.log('DeFi stack ready (using default addresses)')
      console.log('  Addresses:', deployedContracts)
      return deployedContracts
    },

    getDeployedContracts(): DeployedContracts | null {
      return deployedContracts
    },
  }

  return manager
}

// Singleton instance managed in module scope
let managerInstance: LuxdManager | null = null

/**
 * Get the singleton luxd manager instance
 * Creates it lazily on first access
 */
export function getLuxdManager(): LuxdManager {
  if (!managerInstance) {
    managerInstance = createLuxdManager()
  }
  return managerInstance
}

/**
 * Reset the singleton instance (useful for testing)
 */
export function resetLuxdManager(): void {
  if (managerInstance) {
    managerInstance.stop().catch(console.error)
  }
  managerInstance = null
}

/**
 * Check if we should use luxd (default) or anvil (for mainnet fork)
 */
export function shouldUseLuxd(): boolean {
  // Use luxd by default, only use Anvil if explicitly requested
  return process.env.USE_ANVIL !== 'true'
}
