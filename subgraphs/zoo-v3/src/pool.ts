import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'
import {
  Initialize,
  Mint as MintEvent,
  Burn as BurnEvent,
  Swap as SwapEvent,
  Flash as FlashEvent,
  Collect as CollectEvent,
} from '../generated/templates/Pool/Pool'
import {
  Pool,
  Token,
  Factory,
  Tick,
  Transaction,
  Mint,
  Burn,
  Swap,
  Collect,
  Flash,
  Bundle,
  LuxDayData,
  PoolDayData,
  PoolHourData,
  TokenDayData,
  TokenHourData,
} from '../generated/schema'

let ZERO_BD = BigDecimal.fromString('0')
let ZERO_BI = BigInt.fromI32(0)
let ONE_BI = BigInt.fromI32(1)
let ONE_BD = BigDecimal.fromString('1')
let FACTORY_ADDRESS = '0x80bBc7C4C7a59C899D1B37BC14539A22D5830a84'
let LUSD_ADDRESS = '0xb2ee1ce7b84853b83aa08702ad0ad4d79711882d' // LUSDC on Zoo
let WLUX_ADDRESS = '0x5491216406dab99b7032b83765f36790e27f8a61'

function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

function convertTokenToDecimal(amount: BigInt, decimals: BigInt): BigDecimal {
  if (decimals == ZERO_BI) {
    return amount.toBigDecimal()
  }
  return amount.toBigDecimal().div(exponentToBigDecimal(decimals))
}

function safeDiv(amount0: BigDecimal, amount1: BigDecimal): BigDecimal {
  if (amount1.equals(ZERO_BD)) {
    return ZERO_BD
  }
  return amount0.div(amount1)
}

function sqrtPriceX96ToTokenPrices(sqrtPriceX96: BigInt, token0: Token, token1: Token): BigDecimal[] {
  let num = sqrtPriceX96.times(sqrtPriceX96).toBigDecimal()
  let Q192 = BigInt.fromI32(2).pow(192).toBigDecimal()
  let price1 = num
    .div(Q192)
    .times(exponentToBigDecimal(token0.decimals))
    .div(exponentToBigDecimal(token1.decimals))
  let price0 = safeDiv(ONE_BD, price1)
  return [price0, price1]
}

function getTrackedAmountUSD(
  amount0: BigDecimal,
  token0: Token,
  amount1: BigDecimal,
  token1: Token,
): BigDecimal {
  let price0USD = token0.derivedUSD
  let price1USD = token1.derivedUSD

  let token0IsTracked = price0USD.gt(ZERO_BD)
  let token1IsTracked = price1USD.gt(ZERO_BD)

  if (token0IsTracked && token1IsTracked) {
    return amount0.times(price0USD).plus(amount1.times(price1USD)).div(BigDecimal.fromString('2'))
  }
  if (token0IsTracked) {
    return amount0.times(price0USD)
  }
  if (token1IsTracked) {
    return amount1.times(price1USD)
  }
  return ZERO_BD
}

function loadOrCreateTransaction(txHash: string, blockNumber: BigInt, timestamp: BigInt, gasUsed: BigInt, gasPrice: BigInt): Transaction {
  let tx = Transaction.load(txHash)
  if (tx === null) {
    tx = new Transaction(txHash)
    tx.blockNumber = blockNumber
    tx.timestamp = timestamp
    tx.gasUsed = gasUsed
    tx.gasPrice = gasPrice
    tx.save()
  }
  return tx as Transaction
}

function createTick(tickId: string, tickIdx: i32, poolId: string, timestamp: BigInt, blockNumber: BigInt): Tick {
  let tick = new Tick(tickId)
  tick.tickIdx = BigInt.fromI32(tickIdx)
  tick.pool = poolId
  tick.poolAddress = poolId
  tick.createdAtTimestamp = timestamp
  tick.createdAtBlockNumber = blockNumber
  tick.liquidityGross = ZERO_BI
  tick.liquidityNet = ZERO_BI
  tick.liquidityProviderCount = ZERO_BI
  tick.price0 = ONE_BD
  tick.price1 = ONE_BD
  tick.volumeToken0 = ZERO_BD
  tick.volumeToken1 = ZERO_BD
  tick.volumeUSD = ZERO_BD
  tick.untrackedVolumeUSD = ZERO_BD
  tick.feesUSD = ZERO_BD
  tick.collectedFeesToken0 = ZERO_BD
  tick.collectedFeesToken1 = ZERO_BD
  tick.collectedFeesUSD = ZERO_BD
  tick.feeGrowthOutside0X128 = ZERO_BI
  tick.feeGrowthOutside1X128 = ZERO_BI
  return tick
}

function updateLuxDayData(timestamp: BigInt, factory: Factory): LuxDayData {
  let dayID = timestamp.toI32() / 86400
  let dayStartTimestamp = dayID * 86400
  let dayData = LuxDayData.load(dayID.toString())
  if (dayData === null) {
    dayData = new LuxDayData(dayID.toString())
    dayData.date = dayStartTimestamp
    dayData.volumeETH = ZERO_BD
    dayData.volumeUSD = ZERO_BD
    dayData.volumeUSDUntracked = ZERO_BD
    dayData.feesUSD = ZERO_BD
    dayData.txCount = ZERO_BI
    dayData.tvlUSD = ZERO_BD
  }
  dayData.tvlUSD = factory.totalValueLockedUSD
  dayData.txCount = dayData.txCount.plus(ONE_BI)
  dayData.save()
  return dayData as LuxDayData
}

function updatePoolDayData(event_timestamp: BigInt, pool: Pool): PoolDayData {
  let dayID = event_timestamp.toI32() / 86400
  let dayStartTimestamp = dayID * 86400
  let dayPoolID = pool.id.concat('-').concat(dayID.toString())
  let poolDayData = PoolDayData.load(dayPoolID)
  if (poolDayData === null) {
    poolDayData = new PoolDayData(dayPoolID)
    poolDayData.date = dayStartTimestamp
    poolDayData.pool = pool.id
    poolDayData.volumeToken0 = ZERO_BD
    poolDayData.volumeToken1 = ZERO_BD
    poolDayData.volumeUSD = ZERO_BD
    poolDayData.feesUSD = ZERO_BD
    poolDayData.txCount = ZERO_BI
    poolDayData.feeGrowthGlobal0X128 = ZERO_BI
    poolDayData.feeGrowthGlobal1X128 = ZERO_BI
    poolDayData.open = pool.token0Price
    poolDayData.high = pool.token0Price
    poolDayData.low = pool.token0Price
    poolDayData.close = pool.token0Price
  }
  if (pool.token0Price.gt(poolDayData.high)) {
    poolDayData.high = pool.token0Price
  }
  if (pool.token0Price.lt(poolDayData.low)) {
    poolDayData.low = pool.token0Price
  }
  poolDayData.liquidity = pool.liquidity
  poolDayData.sqrtPrice = pool.sqrtPrice
  poolDayData.feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128
  poolDayData.feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128
  poolDayData.token0Price = pool.token0Price
  poolDayData.token1Price = pool.token1Price
  poolDayData.tick = pool.tick
  poolDayData.tvlUSD = pool.totalValueLockedUSD
  poolDayData.txCount = poolDayData.txCount.plus(ONE_BI)
  poolDayData.close = pool.token0Price
  poolDayData.save()
  return poolDayData as PoolDayData
}

function updatePoolHourData(event_timestamp: BigInt, pool: Pool): PoolHourData {
  let hourIndex = event_timestamp.toI32() / 3600
  let hourStartUnix = hourIndex * 3600
  let hourPoolID = pool.id.concat('-').concat(hourIndex.toString())
  let poolHourData = PoolHourData.load(hourPoolID)
  if (poolHourData === null) {
    poolHourData = new PoolHourData(hourPoolID)
    poolHourData.periodStartUnix = hourStartUnix
    poolHourData.pool = pool.id
    poolHourData.volumeToken0 = ZERO_BD
    poolHourData.volumeToken1 = ZERO_BD
    poolHourData.volumeUSD = ZERO_BD
    poolHourData.feesUSD = ZERO_BD
    poolHourData.txCount = ZERO_BI
    poolHourData.feeGrowthGlobal0X128 = ZERO_BI
    poolHourData.feeGrowthGlobal1X128 = ZERO_BI
    poolHourData.open = pool.token0Price
    poolHourData.high = pool.token0Price
    poolHourData.low = pool.token0Price
    poolHourData.close = pool.token0Price
  }
  if (pool.token0Price.gt(poolHourData.high)) {
    poolHourData.high = pool.token0Price
  }
  if (pool.token0Price.lt(poolHourData.low)) {
    poolHourData.low = pool.token0Price
  }
  poolHourData.liquidity = pool.liquidity
  poolHourData.sqrtPrice = pool.sqrtPrice
  poolHourData.feeGrowthGlobal0X128 = pool.feeGrowthGlobal0X128
  poolHourData.feeGrowthGlobal1X128 = pool.feeGrowthGlobal1X128
  poolHourData.token0Price = pool.token0Price
  poolHourData.token1Price = pool.token1Price
  poolHourData.tick = pool.tick
  poolHourData.tvlUSD = pool.totalValueLockedUSD
  poolHourData.txCount = poolHourData.txCount.plus(ONE_BI)
  poolHourData.close = pool.token0Price
  poolHourData.save()
  return poolHourData as PoolHourData
}

function updateTokenDayData(token: Token, timestamp: BigInt): TokenDayData {
  let dayID = timestamp.toI32() / 86400
  let dayStartTimestamp = dayID * 86400
  let tokenDayID = token.id.concat('-').concat(dayID.toString())
  let tokenDayData = TokenDayData.load(tokenDayID)
  if (tokenDayData === null) {
    tokenDayData = new TokenDayData(tokenDayID)
    tokenDayData.date = dayStartTimestamp
    tokenDayData.token = token.id
    tokenDayData.volume = ZERO_BD
    tokenDayData.volumeUSD = ZERO_BD
    tokenDayData.untrackedVolumeUSD = ZERO_BD
    tokenDayData.feesUSD = ZERO_BD
    tokenDayData.open = token.derivedUSD
    tokenDayData.high = token.derivedUSD
    tokenDayData.low = token.derivedUSD
    tokenDayData.close = token.derivedUSD
  }
  if (token.derivedUSD.gt(tokenDayData.high)) {
    tokenDayData.high = token.derivedUSD
  }
  if (token.derivedUSD.lt(tokenDayData.low)) {
    tokenDayData.low = token.derivedUSD
  }
  tokenDayData.close = token.derivedUSD
  tokenDayData.priceUSD = token.derivedUSD
  tokenDayData.totalValueLocked = token.totalValueLocked
  tokenDayData.totalValueLockedUSD = token.totalValueLockedUSD
  tokenDayData.save()
  return tokenDayData as TokenDayData
}

function updateTokenHourData(token: Token, timestamp: BigInt): TokenHourData {
  let hourIndex = timestamp.toI32() / 3600
  let hourStartUnix = hourIndex * 3600
  let tokenHourID = token.id.concat('-').concat(hourIndex.toString())
  let tokenHourData = TokenHourData.load(tokenHourID)
  if (tokenHourData === null) {
    tokenHourData = new TokenHourData(tokenHourID)
    tokenHourData.periodStartUnix = hourStartUnix
    tokenHourData.token = token.id
    tokenHourData.volume = ZERO_BD
    tokenHourData.volumeUSD = ZERO_BD
    tokenHourData.untrackedVolumeUSD = ZERO_BD
    tokenHourData.feesUSD = ZERO_BD
    tokenHourData.open = token.derivedUSD
    tokenHourData.high = token.derivedUSD
    tokenHourData.low = token.derivedUSD
    tokenHourData.close = token.derivedUSD
  }
  if (token.derivedUSD.gt(tokenHourData.high)) {
    tokenHourData.high = token.derivedUSD
  }
  if (token.derivedUSD.lt(tokenHourData.low)) {
    tokenHourData.low = token.derivedUSD
  }
  tokenHourData.close = token.derivedUSD
  tokenHourData.priceUSD = token.derivedUSD
  tokenHourData.totalValueLocked = token.totalValueLocked
  tokenHourData.totalValueLockedUSD = token.totalValueLockedUSD
  tokenHourData.save()
  return tokenHourData as TokenHourData
}

// Realistic caps for a young chain — prevents deployer-initialized pools
// from producing misleading aggregate stats while keeping per-entity data honest
let POOL_TVL_CAP = BigDecimal.fromString('5000000')   // $5M per pool
let TOKEN_TVL_CAP = BigDecimal.fromString('25000000')  // $25M per token
let MAX_TOKEN_PRICE = BigDecimal.fromString('200000')  // $200K max per token unit
let MAX_SWAP_USD = BigDecimal.fromString('500000')     // $500K max per swap

function clampTVL(value: BigDecimal, cap: BigDecimal): BigDecimal {
  if (value.lt(ZERO_BD)) return ZERO_BD
  if (value.gt(cap)) return cap
  return value
}

function updateDerivedUSD(token: Token): void {
  let tokenId = token.id.toLowerCase()
  let lusdId = LUSD_ADDRESS.toLowerCase()

  // LUSD is the $1 anchor stablecoin
  if (tokenId == lusdId) {
    token.derivedUSD = ONE_BD
    return
  }

  // Derive price from whitelist pools, preferring direct stablecoin pairs.
  // Strategy:
  //   1. First pass: look for a direct LUSD pair (most trustworthy)
  //   2. Second pass: derive through WLUX or other whitelist tokens (1-hop)
  // Within each tier, pick the pool with the highest native liquidity.
  // Require minimum liquidity to avoid deriving from drained/dead pools.
  let whitelistPools = token.whitelistPools
  let bestDirectLiq = ZERO_BI
  let directPrice = ZERO_BD
  let bestIndirectLiq = ZERO_BI
  let indirectPrice = ZERO_BD

  for (let i = 0; i < whitelistPools.length; i++) {
    let poolAddress = whitelistPools[i]
    let pool = Pool.load(poolAddress)
    if (pool === null) continue
    if (pool.liquidity.equals(ZERO_BI)) continue

    // Check if this token is token0 in the pool
    if (pool.token0 == token.id) {
      let token1 = Token.load(pool.token1)
      if (token1 === null) continue
      if (token1.derivedUSD.le(ZERO_BD)) continue
      let price = pool.token0Price.times(token1.derivedUSD)
      let isDirect = token1.id.toLowerCase() == lusdId
      if (isDirect) {
        if (pool.liquidity.gt(bestDirectLiq)) {
          bestDirectLiq = pool.liquidity
          directPrice = price
        }
      } else {
        if (pool.liquidity.gt(bestIndirectLiq)) {
          bestIndirectLiq = pool.liquidity
          indirectPrice = price
        }
      }
    }
    // Check if this token is token1 in the pool
    if (pool.token1 == token.id) {
      let token0 = Token.load(pool.token0)
      if (token0 === null) continue
      if (token0.derivedUSD.le(ZERO_BD)) continue
      let price = pool.token1Price.times(token0.derivedUSD)
      let isDirect = token0.id.toLowerCase() == lusdId
      if (isDirect) {
        if (pool.liquidity.gt(bestDirectLiq)) {
          bestDirectLiq = pool.liquidity
          directPrice = price
        }
      } else {
        if (pool.liquidity.gt(bestIndirectLiq)) {
          bestIndirectLiq = pool.liquidity
          indirectPrice = price
        }
      }
    }
  }

  // Prefer direct stablecoin pair, fall back to indirect
  let priceSoFar = directPrice.gt(ZERO_BD) ? directPrice : indirectPrice

  // Cap: no token should exceed $200K per unit
  if (priceSoFar.gt(MAX_TOKEN_PRICE)) {
    priceSoFar = ZERO_BD
  }

  token.derivedUSD = priceSoFar
}

function updateBundlePrices(): void {
  let bundle = Bundle.load('1')
  if (bundle === null) return

  // LUX price = WLUX.derivedUSD
  let wlux = Token.load(WLUX_ADDRESS)
  if (wlux !== null && wlux.derivedUSD.gt(ZERO_BD)) {
    bundle.luxPriceUSD = wlux.derivedUSD
    bundle.ethPriceUSD = wlux.derivedUSD
  }
  bundle.save()
}

export function handleInitialize(event: Initialize): void {
  let pool = Pool.load(event.address.toHexString())
  if (pool === null) return

  pool.sqrtPrice = event.params.sqrtPriceX96
  pool.tick = BigInt.fromI32(event.params.tick)

  let token0 = Token.load(pool.token0)
  let token1 = Token.load(pool.token1)
  if (token0 === null || token1 === null) return

  let prices = sqrtPriceX96ToTokenPrices(event.params.sqrtPriceX96, token0, token1)
  pool.token0Price = prices[0]
  pool.token1Price = prices[1]
  pool.save()

  // Update derived prices
  updateDerivedUSD(token0)
  updateDerivedUSD(token1)
  token0.save()
  token1.save()

  // Update bundle with LUX price
  updateBundlePrices()
}

export function handleMint(event: MintEvent): void {
  let poolAddress = event.address.toHexString()
  let pool = Pool.load(poolAddress)
  if (pool === null) return

  let factory = Factory.load(FACTORY_ADDRESS)
  if (factory === null) return

  let token0 = Token.load(pool.token0)
  let token1 = Token.load(pool.token1)
  if (token0 === null || token1 === null) return

  let amount0 = convertTokenToDecimal(event.params.amount0, token0.decimals)
  let amount1 = convertTokenToDecimal(event.params.amount1, token1.decimals)
  let amountUSD = getTrackedAmountUSD(amount0, token0, amount1, token1)

  // Update factory
  factory.txCount = factory.txCount.plus(ONE_BI)

  // Update token0
  token0.txCount = token0.txCount.plus(ONE_BI)
  token0.totalValueLocked = token0.totalValueLocked.plus(amount0)
  token0.totalValueLockedUSD = clampTVL(token0.totalValueLocked.times(token0.derivedUSD), TOKEN_TVL_CAP)

  // Update token1
  token1.txCount = token1.txCount.plus(ONE_BI)
  token1.totalValueLocked = token1.totalValueLocked.plus(amount1)
  token1.totalValueLockedUSD = clampTVL(token1.totalValueLocked.times(token1.derivedUSD), TOKEN_TVL_CAP)

  // Update pool
  pool.txCount = pool.txCount.plus(ONE_BI)
  pool.liquidity = pool.liquidity.plus(event.params.amount)
  pool.totalValueLockedToken0 = pool.totalValueLockedToken0.plus(amount0)
  pool.totalValueLockedToken1 = pool.totalValueLockedToken1.plus(amount1)

  // Update factory TVL using delta (not accumulation)
  let oldPoolTVLMint = pool.totalValueLockedUSD
  let rawPoolTVLMint = pool.totalValueLockedToken0.times(token0.derivedUSD)
    .plus(pool.totalValueLockedToken1.times(token1.derivedUSD))
  pool.totalValueLockedUSD = clampTVL(rawPoolTVLMint, POOL_TVL_CAP)
  factory.totalValueLockedUSD = factory.totalValueLockedUSD
    .minus(oldPoolTVLMint)
    .plus(pool.totalValueLockedUSD)

  // Create or update ticks
  let lowerTickIdx = event.params.tickLower
  let upperTickIdx = event.params.tickUpper
  let lowerTickId = poolAddress.concat('#').concat(BigInt.fromI32(lowerTickIdx).toString())
  let upperTickId = poolAddress.concat('#').concat(BigInt.fromI32(upperTickIdx).toString())

  let lowerTick = Tick.load(lowerTickId)
  if (lowerTick === null) {
    lowerTick = createTick(lowerTickId, lowerTickIdx, poolAddress, event.block.timestamp, event.block.number)
  }
  lowerTick.liquidityGross = lowerTick.liquidityGross.plus(event.params.amount)
  lowerTick.liquidityNet = lowerTick.liquidityNet.plus(event.params.amount)

  let upperTick = Tick.load(upperTickId)
  if (upperTick === null) {
    upperTick = createTick(upperTickId, upperTickIdx, poolAddress, event.block.timestamp, event.block.number)
  }
  upperTick.liquidityGross = upperTick.liquidityGross.plus(event.params.amount)
  upperTick.liquidityNet = upperTick.liquidityNet.minus(event.params.amount)

  // Create transaction
  let transaction = loadOrCreateTransaction(
    event.transaction.hash.toHexString(),
    event.block.number,
    event.block.timestamp,
    event.receipt !== null ? event.receipt!.gasUsed : ZERO_BI,
    event.transaction.gasPrice,
  )

  let mint = new Mint(transaction.id.concat('#').concat(pool.txCount.toString()))
  mint.transaction = transaction.id
  mint.timestamp = event.block.timestamp
  mint.pool = pool.id
  mint.token0 = pool.token0
  mint.token1 = pool.token1
  mint.owner = event.params.owner
  mint.sender = event.params.sender
  mint.origin = event.transaction.from
  mint.amount = event.params.amount
  mint.amount0 = amount0
  mint.amount1 = amount1
  mint.amountUSD = amountUSD
  mint.tickLower = BigInt.fromI32(event.params.tickLower)
  mint.tickUpper = BigInt.fromI32(event.params.tickUpper)
  mint.logIndex = event.logIndex

  // Update time series
  updateLuxDayData(event.block.timestamp, factory)
  updatePoolDayData(event.block.timestamp, pool)
  updatePoolHourData(event.block.timestamp, pool)
  updateTokenDayData(token0, event.block.timestamp)
  updateTokenDayData(token1, event.block.timestamp)
  updateTokenHourData(token0, event.block.timestamp)
  updateTokenHourData(token1, event.block.timestamp)

  // Save all
  token0.save()
  token1.save()
  pool.save()
  factory.save()
  mint.save()
  lowerTick.save()
  upperTick.save()
}

export function handleBurn(event: BurnEvent): void {
  let poolAddress = event.address.toHexString()
  let pool = Pool.load(poolAddress)
  if (pool === null) return

  let factory = Factory.load(FACTORY_ADDRESS)
  if (factory === null) return

  let token0 = Token.load(pool.token0)
  let token1 = Token.load(pool.token1)
  if (token0 === null || token1 === null) return

  let amount0 = convertTokenToDecimal(event.params.amount0, token0.decimals)
  let amount1 = convertTokenToDecimal(event.params.amount1, token1.decimals)
  let amountUSD = getTrackedAmountUSD(amount0, token0, amount1, token1)

  // Update factory
  factory.txCount = factory.txCount.plus(ONE_BI)

  // Update token0
  token0.txCount = token0.txCount.plus(ONE_BI)
  token0.totalValueLocked = token0.totalValueLocked.minus(amount0)
  token0.totalValueLockedUSD = clampTVL(token0.totalValueLocked.times(token0.derivedUSD), TOKEN_TVL_CAP)

  // Update token1
  token1.txCount = token1.txCount.plus(ONE_BI)
  token1.totalValueLocked = token1.totalValueLocked.minus(amount1)
  token1.totalValueLockedUSD = clampTVL(token1.totalValueLocked.times(token1.derivedUSD), TOKEN_TVL_CAP)

  // Update pool
  pool.txCount = pool.txCount.plus(ONE_BI)
  pool.liquidity = pool.liquidity.minus(event.params.amount)
  pool.totalValueLockedToken0 = pool.totalValueLockedToken0.minus(amount0)
  pool.totalValueLockedToken1 = pool.totalValueLockedToken1.minus(amount1)

  // Update factory TVL using delta (not accumulation)
  let oldPoolTVLBurn = pool.totalValueLockedUSD
  let rawPoolTVLBurn = pool.totalValueLockedToken0.times(token0.derivedUSD)
    .plus(pool.totalValueLockedToken1.times(token1.derivedUSD))
  pool.totalValueLockedUSD = clampTVL(rawPoolTVLBurn, POOL_TVL_CAP)
  factory.totalValueLockedUSD = factory.totalValueLockedUSD
    .minus(oldPoolTVLBurn)
    .plus(pool.totalValueLockedUSD)

  // Update ticks
  let lowerTickId = poolAddress.concat('#').concat(BigInt.fromI32(event.params.tickLower).toString())
  let upperTickId = poolAddress.concat('#').concat(BigInt.fromI32(event.params.tickUpper).toString())

  let lowerTick = Tick.load(lowerTickId)
  if (lowerTick !== null) {
    lowerTick.liquidityGross = lowerTick.liquidityGross.minus(event.params.amount)
    lowerTick.liquidityNet = lowerTick.liquidityNet.minus(event.params.amount)
    lowerTick.save()
  }

  let upperTick = Tick.load(upperTickId)
  if (upperTick !== null) {
    upperTick.liquidityGross = upperTick.liquidityGross.minus(event.params.amount)
    upperTick.liquidityNet = upperTick.liquidityNet.plus(event.params.amount)
    upperTick.save()
  }

  // Create transaction
  let transaction = loadOrCreateTransaction(
    event.transaction.hash.toHexString(),
    event.block.number,
    event.block.timestamp,
    event.receipt !== null ? event.receipt!.gasUsed : ZERO_BI,
    event.transaction.gasPrice,
  )

  let burn = new Burn(transaction.id.concat('#').concat(pool.txCount.toString()))
  burn.transaction = transaction.id
  burn.timestamp = event.block.timestamp
  burn.pool = pool.id
  burn.token0 = pool.token0
  burn.token1 = pool.token1
  burn.owner = event.params.owner
  burn.origin = event.transaction.from
  burn.amount = event.params.amount
  burn.amount0 = amount0
  burn.amount1 = amount1
  burn.amountUSD = amountUSD
  burn.tickLower = BigInt.fromI32(event.params.tickLower)
  burn.tickUpper = BigInt.fromI32(event.params.tickUpper)
  burn.logIndex = event.logIndex

  // Update time series
  updateLuxDayData(event.block.timestamp, factory)
  updatePoolDayData(event.block.timestamp, pool)
  updatePoolHourData(event.block.timestamp, pool)
  updateTokenDayData(token0, event.block.timestamp)
  updateTokenDayData(token1, event.block.timestamp)
  updateTokenHourData(token0, event.block.timestamp)
  updateTokenHourData(token1, event.block.timestamp)

  // Save all
  token0.save()
  token1.save()
  pool.save()
  factory.save()
  burn.save()
}

export function handleSwap(event: SwapEvent): void {
  let poolAddress = event.address.toHexString()
  let pool = Pool.load(poolAddress)
  if (pool === null) return

  let factory = Factory.load(FACTORY_ADDRESS)
  if (factory === null) return

  let token0 = Token.load(pool.token0)
  let token1 = Token.load(pool.token1)
  if (token0 === null || token1 === null) return

  // Amounts can be negative (V3 uses signed ints)
  let amount0 = convertTokenToDecimal(event.params.amount0, token0.decimals)
  let amount1 = convertTokenToDecimal(event.params.amount1, token1.decimals)

  // Absolute values for volume
  let amount0Abs = amount0.lt(ZERO_BD) ? amount0.neg() : amount0
  let amount1Abs = amount1.lt(ZERO_BD) ? amount1.neg() : amount1

  let amountTotalUSDRaw = getTrackedAmountUSD(amount0Abs, token0, amount1Abs, token1)

  // Cap per-swap volume — prevents deployer's large initial swaps from inflating stats
  let amountTotalUSD = amountTotalUSDRaw.gt(MAX_SWAP_USD) ? ZERO_BD : amountTotalUSDRaw

  // Fee calculation (feeTier is in hundredths of a bip, e.g., 3000 = 0.3%)
  let feesUSD = amountTotalUSD.times(pool.feeTier.toBigDecimal()).div(BigDecimal.fromString('1000000'))

  // Update factory
  factory.txCount = factory.txCount.plus(ONE_BI)
  factory.totalVolumeUSD = factory.totalVolumeUSD.plus(amountTotalUSD)

  // Update token0
  token0.volume = token0.volume.plus(amount0Abs)
  token0.volumeUSD = token0.volumeUSD.plus(amountTotalUSD)
  token0.feesUSD = token0.feesUSD.plus(feesUSD)
  token0.txCount = token0.txCount.plus(ONE_BI)

  // Update token1
  token1.volume = token1.volume.plus(amount1Abs)
  token1.volumeUSD = token1.volumeUSD.plus(amountTotalUSD)
  token1.feesUSD = token1.feesUSD.plus(feesUSD)
  token1.txCount = token1.txCount.plus(ONE_BI)

  // Update pool
  pool.volumeToken0 = pool.volumeToken0.plus(amount0Abs)
  pool.volumeToken1 = pool.volumeToken1.plus(amount1Abs)
  pool.volumeUSD = pool.volumeUSD.plus(amountTotalUSD)
  pool.feesUSD = pool.feesUSD.plus(feesUSD)
  pool.txCount = pool.txCount.plus(ONE_BI)
  pool.liquidity = event.params.liquidity
  pool.sqrtPrice = event.params.sqrtPriceX96
  pool.tick = BigInt.fromI32(event.params.tick)

  // Recalculate token prices from sqrtPrice
  let prices = sqrtPriceX96ToTokenPrices(event.params.sqrtPriceX96, token0, token1)
  pool.token0Price = prices[0]
  pool.token1Price = prices[1]

  // Update TVL — amounts can be positive or negative depending on direction
  pool.totalValueLockedToken0 = pool.totalValueLockedToken0.plus(amount0)
  pool.totalValueLockedToken1 = pool.totalValueLockedToken1.plus(amount1)

  // Update derived USD prices
  updateDerivedUSD(token0)
  updateDerivedUSD(token1)

  // Update bundle LUX/ETH price
  updateBundlePrices()

  // Recalculate TVL in USD (subtract old pool TVL, add new)
  let oldPoolTVL = pool.totalValueLockedUSD
  let rawPoolTVLSwap = pool.totalValueLockedToken0.times(token0.derivedUSD)
    .plus(pool.totalValueLockedToken1.times(token1.derivedUSD))
  pool.totalValueLockedUSD = clampTVL(rawPoolTVLSwap, POOL_TVL_CAP)
  token0.totalValueLockedUSD = clampTVL(token0.totalValueLocked.times(token0.derivedUSD), TOKEN_TVL_CAP)
  token1.totalValueLockedUSD = clampTVL(token1.totalValueLocked.times(token1.derivedUSD), TOKEN_TVL_CAP)

  // Update factory TVL (delta, not accumulation)
  factory.totalValueLockedUSD = factory.totalValueLockedUSD
    .minus(oldPoolTVL)
    .plus(pool.totalValueLockedUSD)

  // Create transaction
  let transaction = loadOrCreateTransaction(
    event.transaction.hash.toHexString(),
    event.block.number,
    event.block.timestamp,
    event.receipt !== null ? event.receipt!.gasUsed : ZERO_BI,
    event.transaction.gasPrice,
  )

  let swap = new Swap(transaction.id.concat('#').concat(pool.txCount.toString()))
  swap.transaction = transaction.id
  swap.timestamp = event.block.timestamp
  swap.pool = pool.id
  swap.token0 = pool.token0
  swap.token1 = pool.token1
  swap.sender = event.params.sender
  swap.recipient = event.params.recipient
  swap.origin = event.transaction.from
  swap.amount0 = amount0
  swap.amount1 = amount1
  swap.amountUSD = amountTotalUSD
  swap.sqrtPriceX96 = event.params.sqrtPriceX96
  swap.tick = BigInt.fromI32(event.params.tick)
  swap.logIndex = event.logIndex

  // Update time series
  let luxDayData = updateLuxDayData(event.block.timestamp, factory)
  luxDayData.volumeUSD = luxDayData.volumeUSD.plus(amountTotalUSD)
  luxDayData.feesUSD = luxDayData.feesUSD.plus(feesUSD)
  luxDayData.save()

  let poolDayData = updatePoolDayData(event.block.timestamp, pool)
  poolDayData.volumeToken0 = poolDayData.volumeToken0.plus(amount0Abs)
  poolDayData.volumeToken1 = poolDayData.volumeToken1.plus(amount1Abs)
  poolDayData.volumeUSD = poolDayData.volumeUSD.plus(amountTotalUSD)
  poolDayData.feesUSD = poolDayData.feesUSD.plus(feesUSD)
  poolDayData.save()

  let poolHourData = updatePoolHourData(event.block.timestamp, pool)
  poolHourData.volumeToken0 = poolHourData.volumeToken0.plus(amount0Abs)
  poolHourData.volumeToken1 = poolHourData.volumeToken1.plus(amount1Abs)
  poolHourData.volumeUSD = poolHourData.volumeUSD.plus(amountTotalUSD)
  poolHourData.feesUSD = poolHourData.feesUSD.plus(feesUSD)
  poolHourData.save()

  let token0DayData = updateTokenDayData(token0, event.block.timestamp)
  token0DayData.volume = token0DayData.volume.plus(amount0Abs)
  token0DayData.volumeUSD = token0DayData.volumeUSD.plus(amountTotalUSD)
  token0DayData.feesUSD = token0DayData.feesUSD.plus(feesUSD)
  token0DayData.save()

  let token1DayData = updateTokenDayData(token1, event.block.timestamp)
  token1DayData.volume = token1DayData.volume.plus(amount1Abs)
  token1DayData.volumeUSD = token1DayData.volumeUSD.plus(amountTotalUSD)
  token1DayData.feesUSD = token1DayData.feesUSD.plus(feesUSD)
  token1DayData.save()

  let token0HourData = updateTokenHourData(token0, event.block.timestamp)
  token0HourData.volume = token0HourData.volume.plus(amount0Abs)
  token0HourData.volumeUSD = token0HourData.volumeUSD.plus(amountTotalUSD)
  token0HourData.feesUSD = token0HourData.feesUSD.plus(feesUSD)
  token0HourData.save()

  let token1HourData = updateTokenHourData(token1, event.block.timestamp)
  token1HourData.volume = token1HourData.volume.plus(amount1Abs)
  token1HourData.volumeUSD = token1HourData.volumeUSD.plus(amountTotalUSD)
  token1HourData.feesUSD = token1HourData.feesUSD.plus(feesUSD)
  token1HourData.save()

  // Save all
  token0.save()
  token1.save()
  pool.save()
  factory.save()
  swap.save()
}

export function handleFlash(event: FlashEvent): void {
  let poolAddress = event.address.toHexString()
  let pool = Pool.load(poolAddress)
  if (pool === null) return

  let token0 = Token.load(pool.token0)
  let token1 = Token.load(pool.token1)
  if (token0 === null || token1 === null) return

  let amount0 = convertTokenToDecimal(event.params.amount0, token0.decimals)
  let amount1 = convertTokenToDecimal(event.params.amount1, token1.decimals)
  let amount0Paid = convertTokenToDecimal(event.params.paid0, token0.decimals)
  let amount1Paid = convertTokenToDecimal(event.params.paid1, token1.decimals)
  let amountUSD = getTrackedAmountUSD(amount0, token0, amount1, token1)

  let transaction = loadOrCreateTransaction(
    event.transaction.hash.toHexString(),
    event.block.number,
    event.block.timestamp,
    event.receipt !== null ? event.receipt!.gasUsed : ZERO_BI,
    event.transaction.gasPrice,
  )

  let flash = new Flash(transaction.id.concat('#').concat(event.logIndex.toString()))
  flash.transaction = transaction.id
  flash.timestamp = event.block.timestamp
  flash.pool = pool.id
  flash.sender = event.params.sender
  flash.recipient = event.params.recipient
  flash.amount0 = amount0
  flash.amount1 = amount1
  flash.amountUSD = amountUSD
  flash.amount0Paid = amount0Paid
  flash.amount1Paid = amount1Paid
  flash.logIndex = event.logIndex
  flash.save()
}

export function handleCollect(event: CollectEvent): void {
  let poolAddress = event.address.toHexString()
  let pool = Pool.load(poolAddress)
  if (pool === null) return

  let token0 = Token.load(pool.token0)
  let token1 = Token.load(pool.token1)
  if (token0 === null || token1 === null) return

  let amount0 = convertTokenToDecimal(event.params.amount0, token0.decimals)
  let amount1 = convertTokenToDecimal(event.params.amount1, token1.decimals)
  let amountUSD = getTrackedAmountUSD(amount0, token0, amount1, token1)

  // Update pool collected fees
  pool.collectedFeesToken0 = pool.collectedFeesToken0.plus(amount0)
  pool.collectedFeesToken1 = pool.collectedFeesToken1.plus(amount1)
  pool.collectedFeesUSD = pool.collectedFeesUSD.plus(amountUSD)

  // Collecting fees reduces TVL
  pool.totalValueLockedToken0 = pool.totalValueLockedToken0.minus(amount0)
  pool.totalValueLockedToken1 = pool.totalValueLockedToken1.minus(amount1)
  let rawPoolTVLCollect = pool.totalValueLockedToken0.times(token0.derivedUSD)
    .plus(pool.totalValueLockedToken1.times(token1.derivedUSD))
  pool.totalValueLockedUSD = clampTVL(rawPoolTVLCollect, POOL_TVL_CAP)

  let transaction = loadOrCreateTransaction(
    event.transaction.hash.toHexString(),
    event.block.number,
    event.block.timestamp,
    event.receipt !== null ? event.receipt!.gasUsed : ZERO_BI,
    event.transaction.gasPrice,
  )

  let collect = new Collect(transaction.id.concat('#').concat(event.logIndex.toString()))
  collect.transaction = transaction.id
  collect.timestamp = event.block.timestamp
  collect.pool = pool.id
  collect.owner = event.params.owner
  collect.amount0 = amount0
  collect.amount1 = amount1
  collect.amountUSD = amountUSD
  collect.tickLower = BigInt.fromI32(event.params.tickLower)
  collect.tickUpper = BigInt.fromI32(event.params.tickUpper)
  collect.logIndex = event.logIndex

  pool.save()
  collect.save()
}
