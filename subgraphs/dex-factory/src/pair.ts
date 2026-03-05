import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'
import {
  Mint as MintEvent,
  Burn as BurnEvent,
  Swap as SwapEvent,
  Sync as SyncEvent,
  Transfer as TransferEvent,
} from '../generated/templates/Pair/Pair'
import {
  Pair,
  Token,
  Factory,
  Transaction,
  Mint,
  Burn,
  Swap,
  Bundle,
  LiquidityPosition,
  User,
} from '../generated/schema'

let ZERO_BD = BigDecimal.fromString('0')
let ZERO_BI = BigInt.fromI32(0)
let ONE_BI = BigInt.fromI32(1)
let ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
let FACTORY_ADDRESS = '0xD173926A10A0C4eCd3A51B1422270b65Df0551c1'

// Stablecoin addresses on Lux C-chain for USD derivation
let LUSDC_ADDRESS = '0x57f9E717dc080a6A76fB6F77BecA8C9C1D266B96'

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

function createLiquidityPosition(pairAddress: string, user: string): LiquidityPosition {
  let id = pairAddress.concat('-').concat(user)
  let lp = LiquidityPosition.load(id)
  if (lp === null) {
    lp = new LiquidityPosition(id)
    let pair = Pair.load(pairAddress)
    if (pair !== null) {
      lp.pair = pair.id
      pair.liquidityProviderCount = pair.liquidityProviderCount.plus(ONE_BI)
      pair.save()
    }
    let u = User.load(user)
    if (u === null) {
      u = new User(user)
      u.save()
    }
    lp.user = u.id
    lp.liquidityTokenBalance = ZERO_BD
    lp.save()
  }
  return lp as LiquidityPosition
}

export function handleTransfer(event: TransferEvent): void {
  let from = event.params.from.toHexString()
  let to = event.params.to.toHexString()
  let pairAddress = event.address.toHexString()
  let value = convertTokenToDecimal(event.params.value, BigInt.fromI32(18))

  // Mint (from = zero)
  if (from != ADDRESS_ZERO) {
    let fromLP = createLiquidityPosition(pairAddress, from)
    fromLP.liquidityTokenBalance = fromLP.liquidityTokenBalance.minus(value)
    fromLP.save()
  }

  // Burn (to = zero)
  if (to != ADDRESS_ZERO && to != pairAddress) {
    let toLP = createLiquidityPosition(pairAddress, to)
    toLP.liquidityTokenBalance = toLP.liquidityTokenBalance.plus(value)
    toLP.save()
  }
}

export function handleSync(event: SyncEvent): void {
  let pair = Pair.load(event.address.toHexString())
  if (pair === null) return

  let token0 = Token.load(pair.token0)
  let token1 = Token.load(pair.token1)
  if (token0 === null || token1 === null) return

  pair.reserve0 = convertTokenToDecimal(event.params.reserve0, token0.decimals)
  pair.reserve1 = convertTokenToDecimal(event.params.reserve1, token1.decimals)

  if (pair.reserve1.notEqual(ZERO_BD)) {
    pair.token0Price = pair.reserve0.div(pair.reserve1)
  }
  if (pair.reserve0.notEqual(ZERO_BD)) {
    pair.token1Price = pair.reserve1.div(pair.reserve0)
  }

  // Derive USD values - use LUSDC pairs as reference
  let reserveUSD = ZERO_BD
  let token0Id = token0.id.toLowerCase()
  let token1Id = token1.id.toLowerCase()
  let lusdcId = LUSDC_ADDRESS.toLowerCase()

  if (token0Id == lusdcId) {
    reserveUSD = pair.reserve0.times(BigDecimal.fromString('2'))
    token1.derivedUSD = pair.reserve1.gt(ZERO_BD) ? pair.reserve0.div(pair.reserve1) : ZERO_BD
  } else if (token1Id == lusdcId) {
    reserveUSD = pair.reserve1.times(BigDecimal.fromString('2'))
    token0.derivedUSD = pair.reserve0.gt(ZERO_BD) ? pair.reserve1.div(pair.reserve0) : ZERO_BD
  }

  pair.reserveUSD = reserveUSD
  pair.trackedReserveETH = ZERO_BD // TODO: derive from LUX price

  pair.save()
  token0.save()
  token1.save()

  // Update factory liquidity
  let factory = Factory.load(FACTORY_ADDRESS)
  if (factory !== null) {
    factory.totalLiquidityUSD = factory.totalLiquidityUSD.plus(reserveUSD)
    factory.save()
  }
}

function getOrCreateTransaction(event: SwapEvent): Transaction {
  let tx = Transaction.load(event.transaction.hash.toHexString())
  if (tx === null) {
    tx = new Transaction(event.transaction.hash.toHexString())
    tx.blockNumber = event.block.number
    tx.timestamp = event.block.timestamp
    tx.save()
  }
  return tx as Transaction
}

export function handleMint(event: MintEvent): void {
  let pair = Pair.load(event.address.toHexString())
  if (pair === null) return

  let token0 = Token.load(pair.token0)
  let token1 = Token.load(pair.token1)
  if (token0 === null || token1 === null) return

  let amount0 = convertTokenToDecimal(event.params.amount0, token0.decimals)
  let amount1 = convertTokenToDecimal(event.params.amount1, token1.decimals)

  token0.txCount = token0.txCount.plus(ONE_BI)
  token1.txCount = token1.txCount.plus(ONE_BI)
  pair.txCount = pair.txCount.plus(ONE_BI)

  // Create transaction
  let tx = Transaction.load(event.transaction.hash.toHexString())
  if (tx === null) {
    tx = new Transaction(event.transaction.hash.toHexString())
    tx.blockNumber = event.block.number
    tx.timestamp = event.block.timestamp
    tx.save()
  }

  let mint = new Mint(event.transaction.hash.toHexString().concat('-').concat(event.logIndex.toString()))
  mint.transaction = tx.id
  mint.timestamp = event.block.timestamp
  mint.pair = pair.id
  mint.to = event.params.sender
  mint.liquidity = ZERO_BD
  mint.sender = event.params.sender
  mint.amount0 = amount0
  mint.amount1 = amount1
  mint.logIndex = event.logIndex
  mint.amountUSD = ZERO_BD

  // Update factory
  let factory = Factory.load(FACTORY_ADDRESS)
  if (factory !== null) {
    factory.txCount = factory.txCount.plus(ONE_BI)
    factory.save()
  }

  token0.save()
  token1.save()
  pair.save()
  mint.save()
}

export function handleBurn(event: BurnEvent): void {
  let pair = Pair.load(event.address.toHexString())
  if (pair === null) return

  let token0 = Token.load(pair.token0)
  let token1 = Token.load(pair.token1)
  if (token0 === null || token1 === null) return

  let amount0 = convertTokenToDecimal(event.params.amount0, token0.decimals)
  let amount1 = convertTokenToDecimal(event.params.amount1, token1.decimals)

  token0.txCount = token0.txCount.plus(ONE_BI)
  token1.txCount = token1.txCount.plus(ONE_BI)
  pair.txCount = pair.txCount.plus(ONE_BI)

  let tx = Transaction.load(event.transaction.hash.toHexString())
  if (tx === null) {
    tx = new Transaction(event.transaction.hash.toHexString())
    tx.blockNumber = event.block.number
    tx.timestamp = event.block.timestamp
    tx.save()
  }

  let burn = new Burn(event.transaction.hash.toHexString().concat('-').concat(event.logIndex.toString()))
  burn.transaction = tx.id
  burn.timestamp = event.block.timestamp
  burn.pair = pair.id
  burn.liquidity = ZERO_BD
  burn.sender = event.params.sender
  burn.amount0 = amount0
  burn.amount1 = amount1
  burn.to = event.params.to
  burn.logIndex = event.logIndex
  burn.amountUSD = ZERO_BD
  burn.complete = true

  let factory = Factory.load(FACTORY_ADDRESS)
  if (factory !== null) {
    factory.txCount = factory.txCount.plus(ONE_BI)
    factory.save()
  }

  token0.save()
  token1.save()
  pair.save()
  burn.save()
}

export function handleSwap(event: SwapEvent): void {
  let pair = Pair.load(event.address.toHexString())
  if (pair === null) return

  let token0 = Token.load(pair.token0)
  let token1 = Token.load(pair.token1)
  if (token0 === null || token1 === null) return

  let amount0In = convertTokenToDecimal(event.params.amount0In, token0.decimals)
  let amount1In = convertTokenToDecimal(event.params.amount1In, token1.decimals)
  let amount0Out = convertTokenToDecimal(event.params.amount0Out, token0.decimals)
  let amount1Out = convertTokenToDecimal(event.params.amount1Out, token1.decimals)

  // Get volume in USD
  let amount0Total = amount0In.plus(amount0Out)
  let amount1Total = amount1In.plus(amount1Out)
  let derivedAmountUSD = ZERO_BD

  if (token0.derivedUSD !== null && token0.derivedUSD!.gt(ZERO_BD)) {
    derivedAmountUSD = amount0Total.times(token0.derivedUSD!)
  } else if (token1.derivedUSD !== null && token1.derivedUSD!.gt(ZERO_BD)) {
    derivedAmountUSD = amount1Total.times(token1.derivedUSD!)
  }

  // Update token volumes
  token0.tradeVolume = token0.tradeVolume.plus(amount0Total)
  token0.tradeVolumeUSD = token0.tradeVolumeUSD.plus(derivedAmountUSD)
  token0.txCount = token0.txCount.plus(ONE_BI)

  token1.tradeVolume = token1.tradeVolume.plus(amount1Total)
  token1.tradeVolumeUSD = token1.tradeVolumeUSD.plus(derivedAmountUSD)
  token1.txCount = token1.txCount.plus(ONE_BI)

  // Update pair volumes
  pair.volumeToken0 = pair.volumeToken0.plus(amount0Total)
  pair.volumeToken1 = pair.volumeToken1.plus(amount1Total)
  pair.volumeUSD = pair.volumeUSD.plus(derivedAmountUSD)
  pair.txCount = pair.txCount.plus(ONE_BI)

  // Create transaction and swap
  let tx = Transaction.load(event.transaction.hash.toHexString())
  if (tx === null) {
    tx = new Transaction(event.transaction.hash.toHexString())
    tx.blockNumber = event.block.number
    tx.timestamp = event.block.timestamp
    tx.save()
  }

  let swap = new Swap(event.transaction.hash.toHexString().concat('-').concat(event.logIndex.toString()))
  swap.transaction = tx.id
  swap.timestamp = event.block.timestamp
  swap.pair = pair.id
  swap.sender = event.params.sender
  swap.from = event.transaction.from
  swap.amount0In = amount0In
  swap.amount1In = amount1In
  swap.amount0Out = amount0Out
  swap.amount1Out = amount1Out
  swap.to = event.params.to
  swap.logIndex = event.logIndex
  swap.amountUSD = derivedAmountUSD

  // Update factory
  let factory = Factory.load(FACTORY_ADDRESS)
  if (factory !== null) {
    factory.totalVolumeUSD = factory.totalVolumeUSD.plus(derivedAmountUSD)
    factory.txCount = factory.txCount.plus(ONE_BI)
    factory.save()
  }

  token0.save()
  token1.save()
  pair.save()
  swap.save()
}
