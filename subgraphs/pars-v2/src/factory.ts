import { PairCreated } from '../generated/Factory/Factory'
import { Pair, Token, Factory, Bundle } from '../generated/schema'
import { Pair as PairTemplate } from '../generated/templates'
import { ERC20 } from '../generated/Factory/ERC20'
import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'

let ZERO_BD = BigDecimal.fromString('0')
let ZERO_BI = BigInt.fromI32(0)
let ONE_BI = BigInt.fromI32(1)
let FACTORY_ADDRESS = '0x84CF0A13db1be8e1F0676405cfcBC8b09692FD1C'

// Tracked tokens for price derivation (Pars mainnet)
let WLUX_ADDRESS = '0x548F54Dfb32ea6cE4fa3515236696CF3d1b7D26a'
let LUSDC_ADDRESS = '0xC5e4A6f54Be469551a342872C1aB83AB46f61b22'
let LETH_ADDRESS = '0xe0f7E9A0cB1688ccA453995fd6e19AE4fbD9cBfd'
let LBTC_ADDRESS = '0x7d7cC8D05BB0F38D80b5Ce44b4b069A6FB769468'

function fetchTokenSymbol(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress)
  let result = contract.try_symbol()
  return result.reverted ? 'unknown' : result.value
}

function fetchTokenName(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress)
  let result = contract.try_name()
  return result.reverted ? 'unknown' : result.value
}

function fetchTokenDecimals(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress)
  let result = contract.try_decimals()
  return result.reverted ? BigInt.fromI32(18) : BigInt.fromI32(result.value)
}

function fetchTokenTotalSupply(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress)
  let result = contract.try_totalSupply()
  return result.reverted ? ZERO_BI : result.value
}

export function handlePairCreated(event: PairCreated): void {
  // Load or create factory
  let factory = Factory.load(FACTORY_ADDRESS)
  if (factory === null) {
    factory = new Factory(FACTORY_ADDRESS)
    factory.pairCount = 0
    factory.totalVolumeUSD = ZERO_BD
    factory.totalVolumeETH = ZERO_BD
    factory.untrackedVolumeUSD = ZERO_BD
    factory.totalLiquidityUSD = ZERO_BD
    factory.totalLiquidityETH = ZERO_BD
    factory.txCount = ZERO_BI

    // Create bundle for price tracking
    let bundle = new Bundle('1')
    bundle.ethPrice = ZERO_BD
    bundle.luxPrice = ZERO_BD
    bundle.save()
  }
  factory.pairCount = factory.pairCount + 1

  // Create token0
  let token0 = Token.load(event.params.token0.toHexString())
  if (token0 === null) {
    token0 = new Token(event.params.token0.toHexString())
    token0.symbol = fetchTokenSymbol(event.params.token0)
    token0.name = fetchTokenName(event.params.token0)
    token0.decimals = fetchTokenDecimals(event.params.token0)
    token0.totalSupply = fetchTokenTotalSupply(event.params.token0)
    token0.tradeVolume = ZERO_BD
    token0.tradeVolumeUSD = ZERO_BD
    token0.untrackedVolumeUSD = ZERO_BD
    token0.txCount = ZERO_BI
    token0.totalLiquidity = ZERO_BD
    token0.derivedETH = ZERO_BD
    token0.derivedUSD = ZERO_BD
  }

  // Create token1
  let token1 = Token.load(event.params.token1.toHexString())
  if (token1 === null) {
    token1 = new Token(event.params.token1.toHexString())
    token1.symbol = fetchTokenSymbol(event.params.token1)
    token1.name = fetchTokenName(event.params.token1)
    token1.decimals = fetchTokenDecimals(event.params.token1)
    token1.totalSupply = fetchTokenTotalSupply(event.params.token1)
    token1.tradeVolume = ZERO_BD
    token1.tradeVolumeUSD = ZERO_BD
    token1.untrackedVolumeUSD = ZERO_BD
    token1.txCount = ZERO_BI
    token1.totalLiquidity = ZERO_BD
    token1.derivedETH = ZERO_BD
    token1.derivedUSD = ZERO_BD
  }

  // Create pair
  let pair = new Pair(event.params.pair.toHexString())
  pair.token0 = token0.id
  pair.token1 = token1.id
  pair.reserve0 = ZERO_BD
  pair.reserve1 = ZERO_BD
  pair.totalSupply = ZERO_BD
  pair.reserveETH = ZERO_BD
  pair.reserveUSD = ZERO_BD
  pair.trackedReserveETH = ZERO_BD
  pair.token0Price = ZERO_BD
  pair.token1Price = ZERO_BD
  pair.volumeToken0 = ZERO_BD
  pair.volumeToken1 = ZERO_BD
  pair.volumeUSD = ZERO_BD
  pair.untrackedVolumeUSD = ZERO_BD
  pair.txCount = ZERO_BI
  pair.createdAtTimestamp = event.block.timestamp
  pair.createdAtBlockNumber = event.block.number
  pair.liquidityProviderCount = ZERO_BI

  // Create the tracked contract based on the template
  PairTemplate.create(event.params.pair)

  // Save entities
  token0.save()
  token1.save()
  pair.save()
  factory.save()
}
