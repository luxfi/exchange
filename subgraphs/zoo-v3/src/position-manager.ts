import { BigInt, BigDecimal, Address, store } from '@graphprotocol/graph-ts'
import {
  IncreaseLiquidity,
  DecreaseLiquidity,
  Collect,
  Transfer,
} from '../generated/NonfungiblePositionManager/NonfungiblePositionManager'
import { NonfungiblePositionManager as NonfungiblePositionManagerContract } from '../generated/NonfungiblePositionManager/NonfungiblePositionManager'
import { Pool as PoolContract } from '../generated/NonfungiblePositionManager/Pool'
import { Factory as FactoryContract } from '../generated/NonfungiblePositionManager/Factory'
import {
  Position,
  PositionSnapshot,
  Pool,
  Token,
  Tick,
  Transaction,
} from '../generated/schema'

let ZERO_BD = BigDecimal.fromString('0')
let ZERO_BI = BigInt.fromI32(0)
let ONE_BI = BigInt.fromI32(1)
let ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
let FACTORY_ADDRESS = '0x80bBc7C4C7a59C899D1B37BC14539A22D5830a84'
let NFT_MANAGER_ADDRESS = '0x7a4C48B9dae0b7c396569b34042fcA604150Ee28'

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

function getPosition(tokenId: BigInt): Position | null {
  let position = Position.load(tokenId.toString())
  if (position !== null) {
    return position
  }

  // Fetch position data from contract
  let nftManager = NonfungiblePositionManagerContract.bind(Address.fromString(NFT_MANAGER_ADDRESS))
  let positionResult = nftManager.try_positions(tokenId)
  if (positionResult.reverted) {
    return null
  }

  let positionCall = positionResult.value
  let token0Address = positionCall.getToken0()
  let token1Address = positionCall.getToken1()
  let fee = positionCall.getFee()
  let tickLower = positionCall.getTickLower()
  let tickUpper = positionCall.getTickUpper()

  // Get pool address from factory
  let factoryContract = FactoryContract.bind(Address.fromString(FACTORY_ADDRESS))
  let poolResult = factoryContract.try_getPool(token0Address, token1Address, fee)
  if (poolResult.reverted) {
    return null
  }
  let poolAddress = poolResult.value.toHexString()

  let pool = Pool.load(poolAddress)
  if (pool === null) {
    return null
  }

  let token0 = Token.load(pool.token0)
  let token1 = Token.load(pool.token1)
  if (token0 === null || token1 === null) {
    return null
  }

  // Create tick entities if they don't exist
  let lowerTickId = poolAddress.concat('#').concat(BigInt.fromI32(tickLower).toString())
  let upperTickId = poolAddress.concat('#').concat(BigInt.fromI32(tickUpper).toString())

  let lowerTick = Tick.load(lowerTickId)
  if (lowerTick === null) {
    lowerTick = new Tick(lowerTickId)
    lowerTick.tickIdx = BigInt.fromI32(tickLower)
    lowerTick.pool = poolAddress
    lowerTick.poolAddress = poolAddress
    lowerTick.createdAtTimestamp = ZERO_BI
    lowerTick.createdAtBlockNumber = ZERO_BI
    lowerTick.liquidityGross = ZERO_BI
    lowerTick.liquidityNet = ZERO_BI
    lowerTick.liquidityProviderCount = ZERO_BI
    lowerTick.price0 = BigDecimal.fromString('1')
    lowerTick.price1 = BigDecimal.fromString('1')
    lowerTick.volumeToken0 = ZERO_BD
    lowerTick.volumeToken1 = ZERO_BD
    lowerTick.volumeUSD = ZERO_BD
    lowerTick.untrackedVolumeUSD = ZERO_BD
    lowerTick.feesUSD = ZERO_BD
    lowerTick.collectedFeesToken0 = ZERO_BD
    lowerTick.collectedFeesToken1 = ZERO_BD
    lowerTick.collectedFeesUSD = ZERO_BD
    lowerTick.feeGrowthOutside0X128 = ZERO_BI
    lowerTick.feeGrowthOutside1X128 = ZERO_BI
    lowerTick.save()
  }

  let upperTick = Tick.load(upperTickId)
  if (upperTick === null) {
    upperTick = new Tick(upperTickId)
    upperTick.tickIdx = BigInt.fromI32(tickUpper)
    upperTick.pool = poolAddress
    upperTick.poolAddress = poolAddress
    upperTick.createdAtTimestamp = ZERO_BI
    upperTick.createdAtBlockNumber = ZERO_BI
    upperTick.liquidityGross = ZERO_BI
    upperTick.liquidityNet = ZERO_BI
    upperTick.liquidityProviderCount = ZERO_BI
    upperTick.price0 = BigDecimal.fromString('1')
    upperTick.price1 = BigDecimal.fromString('1')
    upperTick.volumeToken0 = ZERO_BD
    upperTick.volumeToken1 = ZERO_BD
    upperTick.volumeUSD = ZERO_BD
    upperTick.untrackedVolumeUSD = ZERO_BD
    upperTick.feesUSD = ZERO_BD
    upperTick.collectedFeesToken0 = ZERO_BD
    upperTick.collectedFeesToken1 = ZERO_BD
    upperTick.collectedFeesUSD = ZERO_BD
    upperTick.feeGrowthOutside0X128 = ZERO_BI
    upperTick.feeGrowthOutside1X128 = ZERO_BI
    upperTick.save()
  }

  position = new Position(tokenId.toString())
  position.owner = Address.fromString(ADDRESS_ZERO)
  position.pool = pool.id
  position.token0 = token0.id
  position.token1 = token1.id
  position.tickLower = lowerTick.id
  position.tickUpper = upperTick.id
  position.liquidity = ZERO_BI
  position.depositedToken0 = ZERO_BD
  position.depositedToken1 = ZERO_BD
  position.withdrawnToken0 = ZERO_BD
  position.withdrawnToken1 = ZERO_BD
  position.collectedFeesToken0 = ZERO_BD
  position.collectedFeesToken1 = ZERO_BD
  position.feeGrowthInside0LastX128 = positionCall.getFeeGrowthInside0LastX128()
  position.feeGrowthInside1LastX128 = positionCall.getFeeGrowthInside1LastX128()

  return position
}

function savePositionSnapshot(position: Position, event_blockNumber: BigInt, event_timestamp: BigInt, txHash: string, gasUsed: BigInt, gasPrice: BigInt): void {
  let transaction = loadOrCreateTransaction(txHash, event_blockNumber, event_timestamp, gasUsed, gasPrice)
  let snapshotId = position.id.concat('#').concat(event_blockNumber.toString())

  let snapshot = new PositionSnapshot(snapshotId)
  snapshot.owner = position.owner
  snapshot.pool = position.pool
  snapshot.position = position.id
  snapshot.blockNumber = event_blockNumber
  snapshot.timestamp = event_timestamp
  snapshot.liquidity = position.liquidity
  snapshot.depositedToken0 = position.depositedToken0
  snapshot.depositedToken1 = position.depositedToken1
  snapshot.withdrawnToken0 = position.withdrawnToken0
  snapshot.withdrawnToken1 = position.withdrawnToken1
  snapshot.collectedFeesToken0 = position.collectedFeesToken0
  snapshot.collectedFeesToken1 = position.collectedFeesToken1
  snapshot.transaction = transaction.id
  snapshot.feeGrowthInside0LastX128 = position.feeGrowthInside0LastX128
  snapshot.feeGrowthInside1LastX128 = position.feeGrowthInside1LastX128
  snapshot.save()
}

export function handleIncreaseLiquidity(event: IncreaseLiquidity): void {
  let position = getPosition(event.params.tokenId)
  if (position === null) return

  // Need transaction for the position if it's new
  if (position.transaction === null || position.transaction == '') {
    let transaction = loadOrCreateTransaction(
      event.transaction.hash.toHexString(),
      event.block.number,
      event.block.timestamp,
      event.receipt !== null ? event.receipt!.gasUsed : ZERO_BI,
      event.transaction.gasPrice,
    )
    position.transaction = transaction.id
  }

  let pool = Pool.load(position.pool)
  if (pool === null) {
    position.save()
    return
  }

  let token0 = Token.load(pool.token0)
  let token1 = Token.load(pool.token1)
  if (token0 === null || token1 === null) {
    position.save()
    return
  }

  let amount0 = convertTokenToDecimal(event.params.amount0, token0.decimals)
  let amount1 = convertTokenToDecimal(event.params.amount1, token1.decimals)

  position.liquidity = position.liquidity.plus(event.params.liquidity)
  position.depositedToken0 = position.depositedToken0.plus(amount0)
  position.depositedToken1 = position.depositedToken1.plus(amount1)

  // Update fee growth
  let nftManager = NonfungiblePositionManagerContract.bind(Address.fromString(NFT_MANAGER_ADDRESS))
  let positionResult = nftManager.try_positions(event.params.tokenId)
  if (!positionResult.reverted) {
    position.feeGrowthInside0LastX128 = positionResult.value.getFeeGrowthInside0LastX128()
    position.feeGrowthInside1LastX128 = positionResult.value.getFeeGrowthInside1LastX128()
  }

  position.save()

  savePositionSnapshot(
    position,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash.toHexString(),
    event.receipt !== null ? event.receipt!.gasUsed : ZERO_BI,
    event.transaction.gasPrice,
  )
}

export function handleDecreaseLiquidity(event: DecreaseLiquidity): void {
  let position = getPosition(event.params.tokenId)
  if (position === null) return

  let pool = Pool.load(position.pool)
  if (pool === null) {
    position.save()
    return
  }

  let token0 = Token.load(pool.token0)
  let token1 = Token.load(pool.token1)
  if (token0 === null || token1 === null) {
    position.save()
    return
  }

  let amount0 = convertTokenToDecimal(event.params.amount0, token0.decimals)
  let amount1 = convertTokenToDecimal(event.params.amount1, token1.decimals)

  position.liquidity = position.liquidity.minus(event.params.liquidity)
  position.withdrawnToken0 = position.withdrawnToken0.plus(amount0)
  position.withdrawnToken1 = position.withdrawnToken1.plus(amount1)

  // Update fee growth
  let nftManager = NonfungiblePositionManagerContract.bind(Address.fromString(NFT_MANAGER_ADDRESS))
  let positionResult = nftManager.try_positions(event.params.tokenId)
  if (!positionResult.reverted) {
    position.feeGrowthInside0LastX128 = positionResult.value.getFeeGrowthInside0LastX128()
    position.feeGrowthInside1LastX128 = positionResult.value.getFeeGrowthInside1LastX128()
  }

  position.save()

  savePositionSnapshot(
    position,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash.toHexString(),
    event.receipt !== null ? event.receipt!.gasUsed : ZERO_BI,
    event.transaction.gasPrice,
  )
}

export function handleCollect(event: Collect): void {
  let position = getPosition(event.params.tokenId)
  if (position === null) return

  let pool = Pool.load(position.pool)
  if (pool === null) return

  let token0 = Token.load(pool.token0)
  let token1 = Token.load(pool.token1)
  if (token0 === null || token1 === null) return

  let amount0 = convertTokenToDecimal(event.params.amount0, token0.decimals)
  let amount1 = convertTokenToDecimal(event.params.amount1, token1.decimals)

  position.collectedFeesToken0 = position.collectedFeesToken0.plus(amount0)
  position.collectedFeesToken1 = position.collectedFeesToken1.plus(amount1)

  // Update fee growth
  let nftManager = NonfungiblePositionManagerContract.bind(Address.fromString(NFT_MANAGER_ADDRESS))
  let positionResult = nftManager.try_positions(event.params.tokenId)
  if (!positionResult.reverted) {
    position.feeGrowthInside0LastX128 = positionResult.value.getFeeGrowthInside0LastX128()
    position.feeGrowthInside1LastX128 = positionResult.value.getFeeGrowthInside1LastX128()
  }

  position.save()

  savePositionSnapshot(
    position,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash.toHexString(),
    event.receipt !== null ? event.receipt!.gasUsed : ZERO_BI,
    event.transaction.gasPrice,
  )
}

export function handleTransfer(event: Transfer): void {
  let position = getPosition(event.params.tokenId)
  if (position === null) return

  position.owner = event.params.to

  // If this is the first transfer (mint), set the transaction
  if (position.transaction === null || position.transaction == '') {
    let transaction = loadOrCreateTransaction(
      event.transaction.hash.toHexString(),
      event.block.number,
      event.block.timestamp,
      event.receipt !== null ? event.receipt!.gasUsed : ZERO_BI,
      event.transaction.gasPrice,
    )
    position.transaction = transaction.id
  }

  position.save()

  savePositionSnapshot(
    position,
    event.block.number,
    event.block.timestamp,
    event.transaction.hash.toHexString(),
    event.receipt !== null ? event.receipt!.gasUsed : ZERO_BI,
    event.transaction.gasPrice,
  )
}
