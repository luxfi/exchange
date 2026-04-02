/**
 * LX E2E Test Fixtures
 *
 * Comprehensive helpers for testing the full CLOB loop:
 * LXBook (LP-9020) ↔ LXVault (LP-9030) ↔ LXFeed (LP-9040)
 *
 * Usage:
 * 1. createMarket() - Initialize a trading market
 * 2. depositCollateral() - Fund accounts in LXVault
 * 3. placeMakerOrder() - Place resting limit order
 * 4. placeTakerOrder() - Execute against maker
 * 5. assertPositionDelta() - Verify position changes
 *
 * @see LP-9020 (LXBook) - CLOB Matching Engine
 * @see LP-9030 (LXVault) - Custody and Risk Engine
 * @see LP-9040 (LXFeed) - Price Feeds
 */
import {
  // Precompile addresses
  LX,
  // ABIs
  LX_BOOK_ABI,
  LX_VAULT_ABI,
  LX_FEED_ABI,
  LX_ORACLE_ABI,
  POOL_MANAGER_ABI,
  // Types and enums
  TIF,
  OrderKind,
  ActionType,
  GroupType,
  MarginMode,
  PositionSide,
  type LXOrder,
  type LXAction,
  type LXPosition,
  type LXMarginInfo,
  type LXL1,
  type LXMarkPrice,
} from '@luxfi/dex'
import { TEST_WALLET_ADDRESS } from 'playwright/fixtures/wallets'
import { parseUnits, encodeFunctionData, type Address, type PublicClient, type WalletClient } from 'viem'
import type { AnvilClient } from './anvil'

// ============================================================================
// Constants
// ============================================================================

/**
 * X18 scaling factor (10^18)
 * EVM standard - all prices and sizes use 18 decimal fixed-point
 * Used by LXBook, LXVault, LXFeed, LXPool precompiles
 */
export const X18 = 10n ** 18n

/**
 * X6 scaling factor (10^6)
 * UTXO chains use 6 decimals (matches USDC/USDT)
 */
export const X6 = 10n ** 6n

/**
 * Zero address for native currency / no hooks
 */
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as Address

/**
 * LuxDev deterministically deployed token addresses
 */
export const LUXDEV_TOKENS = {
  WLUX: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address,
  LUSD: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' as Address,
  LETH: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' as Address,
  LBTC: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9' as Address,
} as const

/**
 * Default market configuration
 * Note: EVM standard: 18 decimals (X18)
 */
export const DEFAULT_MARKET_CONFIG = {
  tickSizeX18: parseUnits('0.01', 18), // $0.01 tick (EVM 18 decimals)
  lotSizeX18: parseUnits('0.001', 18), // 0.001 lot (EVM 18 decimals)
  makerFeePpm: 0, // 0 bps maker fee (rebate)
  takerFeePpm: 500, // 5 bps taker fee
  initialStatus: 1, // Active
} as const

/**
 * Second test wallet for taker orders
 * This is Anvil/Hardhat default account index 1
 */
export const TAKER_WALLET_ADDRESS = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8' as Address
export const TAKER_PRIVATE_KEY = '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'

// ============================================================================
// Market Management
// ============================================================================

/**
 * Market configuration for createMarket
 * Note: EVM uses 18 decimals (X18), UTXO uses 6 decimals (X6)
 */
export interface MarketConfig {
  baseAsset: `0x${string}` // bytes32 encoded base asset name (e.g., "LUX")
  quoteAsset: `0x${string}` // bytes32 encoded quote asset name (e.g., "USD")
  tickSizeX18: bigint // Minimum price increment (EVM 18 decimals)
  lotSizeX18: bigint // Minimum size increment (EVM 18 decimals)
  makerFeePpm: number
  takerFeePpm: number
  feedId: `0x${string}` // Price feed identifier
  initialStatus: number // 0=paused, 1=active
}

/**
 * Encode a string as bytes32
 */
export function stringToBytes32(str: string): `0x${string}` {
  const hex = Buffer.from(str.padEnd(32, '\0')).toString('hex')
  return `0x${hex}` as `0x${string}`
}

/**
 * Create market configuration input (string names, optional overrides)
 */
export interface CreateMarketInput {
  baseAsset: string
  quoteAsset: string
  tickSizeX18?: bigint
  lotSizeX18?: bigint
  makerFeePpm?: number
  takerFeePpm?: number
  initialStatus?: number
}

/**
 * Create a new CLOB market on LXBook (LP-9020)
 *
 * @param client - Viem client with wallet capabilities
 * @param config - Market configuration
 * @returns Market ID
 */
export async function createMarket(
  client: AnvilClient,
  config: CreateMarketInput
): Promise<number> {
  const fullConfig: MarketConfig = {
    baseAsset: stringToBytes32(config.baseAsset),
    quoteAsset: stringToBytes32(config.quoteAsset),
    tickSizeX18: config.tickSizeX18 ?? DEFAULT_MARKET_CONFIG.tickSizeX18,
    lotSizeX18: config.lotSizeX18 ?? DEFAULT_MARKET_CONFIG.lotSizeX18,
    makerFeePpm: config.makerFeePpm ?? DEFAULT_MARKET_CONFIG.makerFeePpm,
    takerFeePpm: config.takerFeePpm ?? DEFAULT_MARKET_CONFIG.takerFeePpm,
    feedId: stringToBytes32(`${config.baseAsset}/${config.quoteAsset}`),
    initialStatus: config.initialStatus ?? DEFAULT_MARKET_CONFIG.initialStatus,
  }

  const hash = await client.writeContract({
    address: LX.LX_BOOK,
    abi: LX_BOOK_ABI,
    functionName: 'createMarket',
    args: [fullConfig],
    account: client.account ?? null,
    chain: client.chain ?? null,
  })

  // Wait for confirmation
  const receipt = await client.waitForTransactionReceipt({ hash })
  if (receipt.status !== 'success') {
    throw new Error(`createMarket failed: ${receipt.status}`)
  }

  // TODO: Parse marketId from logs when available
  // For now, assume sequential market IDs starting from 0
  return 0
}

/**
 * Get L1 (best bid/ask) data from LXBook
 */
export async function getL1(client: AnvilClient, marketId: number): Promise<LXL1> {
  const result = await client.readContract({
    address: LX.LX_BOOK,
    abi: LX_BOOK_ABI,
    functionName: 'getL1',
    args: [marketId],
  })
  return result as unknown as LXL1
}

/**
 * Get market status from LXBook
 */
export async function getMarketStatus(client: AnvilClient, marketId: number): Promise<number> {
  const result = await client.readContract({
    address: LX.LX_BOOK,
    abi: LX_BOOK_ABI,
    functionName: 'getMarketStatus',
    args: [marketId],
  })
  return result as number
}

// ============================================================================
// Vault Operations (LP-9030)
// ============================================================================

/**
 * Account identifier for LXVault
 */
export interface LXAccount {
  main: Address
  subaccountId: number
}

/**
 * Deposit collateral to LXVault
 *
 * @param client - Viem client
 * @param token - Collateral token address
 * @param amount - Amount to deposit (raw, not X18)
 * @param subaccountId - Subaccount ID (default 0)
 */
export async function depositCollateral(
  client: AnvilClient,
  token: Address,
  amount: bigint,
  subaccountId: number = 0
): Promise<void> {
  const hash = await client.writeContract({
    address: LX.LX_VAULT,
    abi: LX_VAULT_ABI,
    functionName: 'deposit',
    args: [token, amount, subaccountId],
    account: client.account ?? null,
    chain: client.chain ?? null,
  })

  const receipt = await client.waitForTransactionReceipt({ hash })
  if (receipt.status !== 'success') {
    throw new Error(`deposit failed: ${receipt.status}`)
  }
}

/**
 * Withdraw collateral from LXVault
 */
export async function withdrawCollateral(
  client: AnvilClient,
  token: Address,
  amount: bigint,
  subaccountId: number = 0
): Promise<void> {
  const hash = await client.writeContract({
    address: LX.LX_VAULT,
    abi: LX_VAULT_ABI,
    functionName: 'withdraw',
    args: [token, amount, subaccountId],
    account: client.account ?? null,
    chain: client.chain ?? null,
  })

  const receipt = await client.waitForTransactionReceipt({ hash })
  if (receipt.status !== 'success') {
    throw new Error(`withdraw failed: ${receipt.status}`)
  }
}

/**
 * Get vault balance for an account
 */
export async function getVaultBalance(
  client: AnvilClient,
  account: Address,
  token: Address,
  subaccountId: number = 0
): Promise<bigint> {
  const result = await client.readContract({
    address: LX.LX_VAULT,
    abi: LX_VAULT_ABI,
    functionName: 'getBalance',
    args: [{ main: account, subaccountId }, token],
  })
  return result as bigint
}

/**
 * Get position info from LXVault
 */
export async function getPosition(
  client: AnvilClient,
  account: Address,
  marketId: number,
  subaccountId: number = 0
): Promise<LXPosition> {
  const result = await client.readContract({
    address: LX.LX_VAULT,
    abi: LX_VAULT_ABI,
    functionName: 'getPosition',
    args: [{ main: account, subaccountId }, marketId],
  })
  return result as unknown as LXPosition
}

/**
 * Get margin info from LXVault
 */
export async function getMargin(
  client: AnvilClient,
  account: Address,
  subaccountId: number = 0
): Promise<LXMarginInfo> {
  const result = await client.readContract({
    address: LX.LX_VAULT,
    abi: LX_VAULT_ABI,
    functionName: 'getMargin',
    args: [{ main: account, subaccountId }],
  })
  return result as unknown as LXMarginInfo
}

/**
 * Check if account is liquidatable
 */
export async function isLiquidatable(
  client: AnvilClient,
  account: Address,
  subaccountId: number = 0
): Promise<{ liquidatable: boolean; shortfall: bigint }> {
  const result = await client.readContract({
    address: LX.LX_VAULT,
    abi: LX_VAULT_ABI,
    functionName: 'isLiquidatable',
    args: [{ main: account, subaccountId }],
  })
  const [liquidatable, shortfall] = result as [boolean, bigint]
  return { liquidatable, shortfall }
}

// ============================================================================
// Order Management (LP-9020)
// ============================================================================

/**
 * Order parameters for placing orders
 * Note: EVM standard: 18 decimals (X18) 
 */
export interface OrderParams {
  marketId: number
  isBuy: boolean
  kind?: OrderKind
  sizeX18: bigint // Order size (EVM 18 decimals)
  limitPxX18: bigint // Limit price (EVM 18 decimals)
  triggerPxX18?: bigint // Trigger price for stop orders (EVM 18 decimals)
  reduceOnly?: boolean
  tif?: TIF
  cloid?: `0x${string}`
  groupId?: `0x${string}`
  groupType?: GroupType
}

/**
 * Generate a unique client order ID
 */
export function generateCloid(): `0x${string}` {
  const timestamp = BigInt(Date.now())
  const random = BigInt(Math.floor(Math.random() * 1000000))
  const cloid = (timestamp << 32n) | random
  return `0x${cloid.toString(16).padStart(32, '0')}` as `0x${string}`
}

/**
 * Encode an order for the execute() endpoint
 * Note: EVM standard: 18 decimals (X18)
 */
export function encodeOrder(params: OrderParams): `0x${string}` {
  // Build order struct - EVM standard 18 decimals (X18)
  const order = {
    marketId: params.marketId,
    isBuy: params.isBuy,
    kind: params.kind ?? OrderKind.LIMIT,
    sizeX18: params.sizeX18,
    limitPxX18: params.limitPxX18,
    triggerPxX18: params.triggerPxX18 ?? 0n,
    reduceOnly: params.reduceOnly ?? false,
    tif: params.tif ?? TIF.GTC,
    cloid: params.cloid ?? generateCloid(),
    groupId: params.groupId ?? ('0x' + '00'.repeat(16)) as `0x${string}`,
    groupType: params.groupType ?? GroupType.NONE,
  }

  // ABI-encode the order struct
  // This matches the LXBook execute() payload format
  // Note: uint64 is sufficient for 6-decimal values (max ~18 quintillion)
  const encoded = encodeFunctionData({
    abi: [
      {
        type: 'function',
        name: 'encodeOrder',
        inputs: [
          {
            name: 'order',
            type: 'tuple',
            components: [
              { name: 'marketId', type: 'uint32' },
              { name: 'isBuy', type: 'bool' },
              { name: 'kind', type: 'uint8' },
              { name: 'sizeX18', type: 'uint64' },
              { name: 'limitPxX18', type: 'uint64' },
              { name: 'triggerPxX18', type: 'uint64' },
              { name: 'reduceOnly', type: 'bool' },
              { name: 'tif', type: 'uint8' },
              { name: 'cloid', type: 'bytes16' },
              { name: 'groupId', type: 'bytes16' },
              { name: 'groupType', type: 'uint8' },
            ],
          },
        ],
        outputs: [],
        stateMutability: 'pure',
      },
    ],
    functionName: 'encodeOrder',
    args: [order],
  })

  // Strip the function selector (first 4 bytes) to get just the data
  return `0x${encoded.slice(10)}` as `0x${string}`
}

/**
 * Create an LXAction for execute()
 */
export function createAction(
  actionType: ActionType,
  data: `0x${string}`,
  nonce?: bigint,
  expiresAfter?: bigint
): LXAction {
  return {
    actionType,
    nonce: nonce ?? BigInt(Date.now()),
    expiresAfter: expiresAfter ?? BigInt(Math.floor(Date.now() / 1000) + 3600), // 1 hour from now
    data,
  }
}

/**
 * Place a limit order via LXBook.execute()
 *
 * @param client - Viem client
 * @param params - Order parameters
 * @returns Transaction hash
 */
export async function placeLimitOrder(client: AnvilClient, params: OrderParams): Promise<`0x${string}`> {
  const orderData = encodeOrder(params)
  const action = createAction(ActionType.PLACE, orderData)

  const hash = await client.writeContract({
    address: LX.LX_BOOK,
    abi: LX_BOOK_ABI,
    functionName: 'execute',
    args: [action],
    account: client.account ?? null,
    chain: client.chain ?? null,
  })

  return hash
}

/**
 * Place a market order (IOC, crosses immediately)
 * Note: sizeX18 - EVM 18 decimals
 */
export async function placeMarketOrder(
  client: AnvilClient,
  marketId: number,
  isBuy: boolean,
  sizeX18: bigint
): Promise<`0x${string}`> {
  return placeLimitOrder(client, {
    marketId,
    isBuy,
    kind: OrderKind.MARKET,
    sizeX18,
    limitPxX18: 0n, // Market orders use 0 price (fill at best available)
    tif: TIF.IOC,
  })
}

/**
 * Cancel order by order ID
 */
export async function cancelOrder(client: AnvilClient, orderId: bigint): Promise<`0x${string}`> {
  // Encode the order ID for cancellation
  const data = `0x${orderId.toString(16).padStart(64, '0')}` as `0x${string}`
  const action = createAction(ActionType.CANCEL, data)

  const hash = await client.writeContract({
    address: LX.LX_BOOK,
    abi: LX_BOOK_ABI,
    functionName: 'execute',
    args: [action],
    account: client.account ?? null,
    chain: client.chain ?? null,
  })

  return hash
}

// ============================================================================
// Price Feed Operations (LP-9040)
// ============================================================================

/**
 * Get mark price from LXFeed
 */
export async function getMarkPrice(client: AnvilClient, marketId: number): Promise<LXMarkPrice> {
  const result = await client.readContract({
    address: LX.LX_FEED,
    abi: LX_FEED_ABI,
    functionName: 'getMarkPrice',
    args: [marketId],
  })
  return result as unknown as LXMarkPrice
}

/**
 * Get index price from LXFeed
 */
export async function getIndexPrice(
  client: AnvilClient,
  marketId: number
): Promise<{ priceX18: bigint; timestamp: bigint }> {
  const result = await client.readContract({
    address: LX.LX_FEED,
    abi: LX_FEED_ABI,
    functionName: 'getIndexPrice',
    args: [marketId],
  })
  const [priceX18, timestamp] = result as [bigint, bigint]
  return { priceX18, timestamp }
}

/**
 * Get funding rate from LXFeed
 */
export async function getFundingRate(
  client: AnvilClient,
  marketId: number
): Promise<{ rateX18: bigint; nextFundingTime: bigint }> {
  const result = await client.readContract({
    address: LX.LX_FEED,
    abi: LX_FEED_ABI,
    functionName: 'getFundingRate',
    args: [marketId],
  })
  const [rateX18, nextFundingTime] = result as [bigint, bigint]
  return { rateX18, nextFundingTime }
}

// ============================================================================
// Test Assertions
// ============================================================================

/**
 * Position delta for assertions
 * Note: EVM standard: 18 decimals (X18)
 */
export interface PositionDelta {
  sizeDeltaX18: bigint // EVM 18 decimals
  expectedSide?: PositionSide
}

/**
 * Assert position has changed by expected delta
 * Note: EVM standard: 18 decimals (X18)
 */
export async function assertPositionDelta(
  client: AnvilClient,
  account: Address,
  marketId: number,
  beforePosition: LXPosition,
  expectedDelta: PositionDelta,
  subaccountId: number = 0
): Promise<LXPosition> {
  const afterPosition = await getPosition(client, account, marketId, subaccountId)

  // Check size delta (EVM 18 decimals)
  const actualSizeDelta = afterPosition.sizeX18 - beforePosition.sizeX18
  if (actualSizeDelta !== expectedDelta.sizeDeltaX18) {
    throw new Error(
      `Position size delta mismatch: expected ${expectedDelta.sizeDeltaX18}, got ${actualSizeDelta}`
    )
  }

  // Check side if specified
  if (expectedDelta.expectedSide !== undefined && afterPosition.side !== expectedDelta.expectedSide) {
    throw new Error(
      `Position side mismatch: expected ${expectedDelta.expectedSide}, got ${afterPosition.side}`
    )
  }

  return afterPosition
}

/**
 * Assert vault balance has changed
 */
export async function assertBalanceDelta(
  client: AnvilClient,
  account: Address,
  token: Address,
  beforeBalance: bigint,
  expectedDelta: bigint,
  subaccountId: number = 0
): Promise<bigint> {
  const afterBalance = await getVaultBalance(client, account, token, subaccountId)
  const actualDelta = afterBalance - beforeBalance

  if (actualDelta !== expectedDelta) {
    throw new Error(`Balance delta mismatch: expected ${expectedDelta}, got ${actualDelta}`)
  }

  return afterBalance
}

/**
 * Assert L1 has orders at expected prices
 * Note: EVM standard: 18 decimals (X18)
 */
export async function assertL1(
  client: AnvilClient,
  marketId: number,
  expected: Partial<{
    hasBid: boolean
    hasAsk: boolean
    bidPriceX18: bigint // EVM 18 decimals
    askPriceX18: bigint // EVM 18 decimals
  }>
): Promise<LXL1> {
  const l1 = await getL1(client, marketId)

  if (expected.hasBid !== undefined) {
    const hasBid = l1.bestBidSzX18 > 0n
    if (hasBid !== expected.hasBid) {
      throw new Error(`L1 bid presence mismatch: expected ${expected.hasBid}, got ${hasBid}`)
    }
  }

  if (expected.hasAsk !== undefined) {
    const hasAsk = l1.bestAskSzX18 > 0n
    if (hasAsk !== expected.hasAsk) {
      throw new Error(`L1 ask presence mismatch: expected ${expected.hasAsk}, got ${hasAsk}`)
    }
  }

  if (expected.bidPriceX18 !== undefined && l1.bestBidPxX18 !== expected.bidPriceX18) {
    throw new Error(`L1 bid price mismatch: expected ${expected.bidPriceX18}, got ${l1.bestBidPxX18}`)
  }

  if (expected.askPriceX18 !== undefined && l1.bestAskPxX18 !== expected.askPriceX18) {
    throw new Error(`L1 ask price mismatch: expected ${expected.askPriceX18}, got ${l1.bestAskPxX18}`)
  }

  return l1
}

// ============================================================================
// Test Setup Helpers
// ============================================================================

/**
 * Setup a complete test market with liquidity
 *
 * @param client - Viem client
 * @param baseAsset - Base asset name (e.g., "LUX")
 * @param quoteAsset - Quote asset name (e.g., "USD")
 * @param collateralToken - Collateral token address
 * @param initialCollateral - Initial collateral amount per account
 * @returns Market ID and setup info
 */
export async function setupTestMarket(
  client: AnvilClient,
  baseAsset: string,
  quoteAsset: string,
  collateralToken: Address,
  initialCollateral: bigint
): Promise<{
  marketId: number
  makerAccount: Address
  takerAccount: Address
}> {
  // Create market
  const marketId = await createMarket(client, { baseAsset, quoteAsset })

  // Deposit collateral for maker (test wallet)
  await depositCollateral(client, collateralToken, initialCollateral)

  // TODO: Deposit collateral for taker (would need second wallet client)
  // For now, tests should use the same wallet for both maker and taker

  return {
    marketId,
    makerAccount: TEST_WALLET_ADDRESS as Address,
    takerAccount: TAKER_WALLET_ADDRESS,
  }
}

/**
 * Wait for transaction and check success
 */
export async function waitForTx(client: AnvilClient, hash: `0x${string}`): Promise<void> {
  const receipt = await client.waitForTransactionReceipt({ hash })
  if (receipt.status !== 'success') {
    throw new Error(`Transaction failed: ${hash}`)
  }
}

// ============================================================================
// Re-exports
// ============================================================================

// Note: isLiquidatable is exported above as a function, not a re-export
export {
  LX,
  LX_BOOK_ABI,
  LX_VAULT_ABI,
  LX_FEED_ABI,
  LX_ORACLE_ABI,
  TIF,
  OrderKind,
  ActionType,
  GroupType,
  MarginMode,
  PositionSide,
}
export type { LXOrder, LXAction, LXPosition, LXMarginInfo, LXL1, LXMarkPrice }
