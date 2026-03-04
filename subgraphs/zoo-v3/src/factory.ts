import { PoolCreated } from '../generated/Factory/Factory'
import { Pool, Token, Factory, Bundle } from '../generated/schema'
import { Pool as PoolTemplate } from '../generated/templates'
import { ERC20 } from '../generated/Factory/ERC20'
import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'

let ZERO_BD = BigDecimal.fromString('0')
let ZERO_BI = BigInt.fromI32(0)
let ONE_BI = BigInt.fromI32(1)
let FACTORY_ADDRESS = '0x80bBc7C4C7a59C899D1B37BC14539A22D5830a84'

// Tracked tokens for price derivation (Zoo Network — standard-lib deployments)
let WLUX_ADDRESS = '0x5491216406dab99b7032b83765f36790e27f8a61'
let LUSDC_ADDRESS = '0xb2ee1ce7b84853b83aa08702ad0ad4d79711882d'
let LETH_ADDRESS = '0x4870621ea8be7a383efcfda225249d35888bd9f2'
let LBTC_ADDRESS = '0x6fc44509a32e513be1aa00d27bb298e63830c6a8'

export let WHITELIST_TOKENS: string[] = [
  WLUX_ADDRESS,
  LUSDC_ADDRESS,
  LETH_ADDRESS,
  LBTC_ADDRESS,
]

// Known token metadata (avoids eth_call on nodes without historical state)
function knownSymbol(addr: string): string {
  let a = addr.toLowerCase()
  if (a == '0x5491216406dab99b7032b83765f36790e27f8a61') return 'WLUX'
  if (a == '0xb2ee1ce7b84853b83aa08702ad0ad4d79711882d') return 'LUSDC'
  if (a == '0x4870621ea8be7a383efcfda225249d35888bd9f2') return 'LETH'
  if (a == '0x6fc44509a32e513be1aa00d27bb298e63830c6a8') return 'LBTC'
  if (a == '0x742202418235b225bd77ee5ba9c4cba416aeb17d') return 'sLUX'
  return ''
}

function knownName(addr: string): string {
  let a = addr.toLowerCase()
  if (a == '0x5491216406dab99b7032b83765f36790e27f8a61') return 'Wrapped LUX'
  if (a == '0xb2ee1ce7b84853b83aa08702ad0ad4d79711882d') return 'Bridged USDC'
  if (a == '0x4870621ea8be7a383efcfda225249d35888bd9f2') return 'Bridged ETH'
  if (a == '0x6fc44509a32e513be1aa00d27bb298e63830c6a8') return 'Bridged BTC'
  if (a == '0x742202418235b225bd77ee5ba9c4cba416aeb17d') return 'Staked LUX'
  return ''
}

function knownDecimals(addr: string): i32 {
  let a = addr.toLowerCase()
  if (a == '0x6fc44509a32e513be1aa00d27bb298e63830c6a8') return 8 // LBTC
  if (a == '0xb2ee1ce7b84853b83aa08702ad0ad4d79711882d') return 6 // LUSDC
  return 18
}

function fetchTokenSymbol(tokenAddress: Address): string {
  let known = knownSymbol(tokenAddress.toHexString())
  if (known != '') return known
  return tokenAddress.toHexString().slice(0, 10)
}

function fetchTokenName(tokenAddress: Address): string {
  let known = knownName(tokenAddress.toHexString())
  if (known != '') return known
  return 'Token ' + tokenAddress.toHexString().slice(0, 10)
}

function fetchTokenDecimals(tokenAddress: Address): BigInt {
  return BigInt.fromI32(knownDecimals(tokenAddress.toHexString()))
}

function fetchTokenTotalSupply(tokenAddress: Address): BigInt {
  return ZERO_BI
}

export function handlePoolCreated(event: PoolCreated): void {
  let factory = Factory.load(FACTORY_ADDRESS)
  if (factory === null) {
    factory = new Factory(FACTORY_ADDRESS)
    factory.poolCount = ZERO_BI
    factory.totalVolumeUSD = ZERO_BD
    factory.totalVolumeETH = ZERO_BD
    factory.totalValueLockedUSD = ZERO_BD
    factory.totalValueLockedETH = ZERO_BD
    factory.txCount = ZERO_BI
    factory.owner = FACTORY_ADDRESS

    let bundle = new Bundle('1')
    bundle.ethPriceUSD = ZERO_BD
    bundle.luxPriceUSD = ZERO_BD
    bundle.save()
  }
  factory.poolCount = factory.poolCount.plus(ONE_BI)

  let token0 = Token.load(event.params.token0.toHexString())
  if (token0 === null) {
    token0 = new Token(event.params.token0.toHexString())
    token0.symbol = fetchTokenSymbol(event.params.token0)
    token0.name = fetchTokenName(event.params.token0)
    token0.decimals = fetchTokenDecimals(event.params.token0)
    token0.totalSupply = fetchTokenTotalSupply(event.params.token0)
    token0.volume = ZERO_BD
    token0.volumeUSD = ZERO_BD
    token0.untrackedVolumeUSD = ZERO_BD
    token0.feesUSD = ZERO_BD
    token0.txCount = ZERO_BI
    token0.poolCount = ZERO_BI
    token0.totalValueLocked = ZERO_BD
    token0.totalValueLockedUSD = ZERO_BD
    token0.totalValueLockedUSDUntracked = ZERO_BD
    token0.derivedETH = ZERO_BD
    token0.derivedUSD = ZERO_BD
    token0.whitelistPools = []
  }

  let token1 = Token.load(event.params.token1.toHexString())
  if (token1 === null) {
    token1 = new Token(event.params.token1.toHexString())
    token1.symbol = fetchTokenSymbol(event.params.token1)
    token1.name = fetchTokenName(event.params.token1)
    token1.decimals = fetchTokenDecimals(event.params.token1)
    token1.totalSupply = fetchTokenTotalSupply(event.params.token1)
    token1.volume = ZERO_BD
    token1.volumeUSD = ZERO_BD
    token1.untrackedVolumeUSD = ZERO_BD
    token1.feesUSD = ZERO_BD
    token1.txCount = ZERO_BI
    token1.poolCount = ZERO_BI
    token1.totalValueLocked = ZERO_BD
    token1.totalValueLockedUSD = ZERO_BD
    token1.totalValueLockedUSDUntracked = ZERO_BD
    token1.derivedETH = ZERO_BD
    token1.derivedUSD = ZERO_BD
    token1.whitelistPools = []
  }

  let pool = new Pool(event.params.pool.toHexString())
  pool.createdAtTimestamp = event.block.timestamp
  pool.createdAtBlockNumber = event.block.number
  pool.token0 = token0.id
  pool.token1 = token1.id
  pool.feeTier = BigInt.fromI32(event.params.fee)
  pool.liquidity = ZERO_BI
  pool.sqrtPrice = ZERO_BI
  pool.feeGrowthGlobal0X128 = ZERO_BI
  pool.feeGrowthGlobal1X128 = ZERO_BI
  pool.token0Price = ZERO_BD
  pool.token1Price = ZERO_BD
  pool.tick = null
  pool.observationIndex = ZERO_BI
  pool.volumeToken0 = ZERO_BD
  pool.volumeToken1 = ZERO_BD
  pool.volumeUSD = ZERO_BD
  pool.untrackedVolumeUSD = ZERO_BD
  pool.feesUSD = ZERO_BD
  pool.txCount = ZERO_BI
  pool.collectedFeesToken0 = ZERO_BD
  pool.collectedFeesToken1 = ZERO_BD
  pool.collectedFeesUSD = ZERO_BD
  pool.totalValueLockedToken0 = ZERO_BD
  pool.totalValueLockedToken1 = ZERO_BD
  pool.totalValueLockedETH = ZERO_BD
  pool.totalValueLockedUSD = ZERO_BD
  pool.totalValueLockedUSDUntracked = ZERO_BD
  pool.liquidityProviderCount = ZERO_BI

  let token0Id = token0.id.toLowerCase()
  let token1Id = token1.id.toLowerCase()
  for (let i = 0; i < WHITELIST_TOKENS.length; i++) {
    if (token0Id == WHITELIST_TOKENS[i].toLowerCase()) {
      let newPools = token1.whitelistPools
      newPools.push(pool.id)
      token1.whitelistPools = newPools
    }
    if (token1Id == WHITELIST_TOKENS[i].toLowerCase()) {
      let newPools = token0.whitelistPools
      newPools.push(pool.id)
      token0.whitelistPools = newPools
    }
  }

  token0.poolCount = token0.poolCount.plus(ONE_BI)
  token1.poolCount = token1.poolCount.plus(ONE_BI)

  PoolTemplate.create(event.params.pool)

  pool.save()
  token0.save()
  token1.save()
  factory.save()
}
