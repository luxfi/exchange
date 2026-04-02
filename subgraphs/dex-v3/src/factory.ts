import { PoolCreated } from '../generated/Factory/Factory'
import { Pool, Token, Factory, Bundle } from '../generated/schema'
import { Pool as PoolTemplate } from '../generated/templates'
import { ERC20 } from '../generated/Factory/ERC20'
import { BigInt, BigDecimal, Address } from '@graphprotocol/graph-ts'

let ZERO_BD = BigDecimal.fromString('0')
let ZERO_BI = BigInt.fromI32(0)
let ONE_BI = BigInt.fromI32(1)
let FACTORY_ADDRESS = '0x80bBc7C4C7a59C899D1B37BC14539A22D5830a84'

// Tracked tokens for price derivation (Lux C-chain)
// These MUST match the actual on-chain token addresses used in V3 pools
let WLUX_ADDRESS = '0x4888e4a2ee0f03051c72d2bd3acf755ed3498b3e'
let LUSD_ADDRESS = '0x848Cff46eb323f323b6Bbe1Df274E40793d7f2c2'
let LETH_ADDRESS = '0x60E0a8167FC13dE89348978860466C9ceC24B9ba'
let LBTC_ADDRESS = '0x1E48D32a4F5e9f08DB9aE4959163300FaF8A6C8e'

export let WHITELIST_TOKENS: string[] = [
  WLUX_ADDRESS,
  LUSD_ADDRESS,
  LETH_ADDRESS,
  LBTC_ADDRESS,
]

// Known token metadata (avoids eth_call on nodes without historical state)
function knownSymbol(addr: string): string {
  let a = addr.toLowerCase()
  if (a == '0x4888e4a2ee0f03051c72d2bd3acf755ed3498b3e') return 'WLUX'
  if (a == '0x848cff46eb323f323b6bbe1df274e40793d7f2c2') return 'LUSD'
  if (a == '0x60e0a8167fc13de89348978860466c9cec24b9ba') return 'LETH'
  if (a == '0x1e48d32a4f5e9f08db9ae4959163300faf8a6c8e') return 'LBTC'
  if (a == '0x26b40f650156c7ebf9e087dd0dca181fe87625b7') return 'LSOL'
  if (a == '0x5e5290f350352768bd2bfc59c2da15dd04a7cb88') return 'LZOO'
  if (a == '0x3141b94b89691009b950c96e97bff48e0c543e3c') return 'LTON'
  if (a == '0x0e4bd0dd67c15decfbbbdbbe07fc9d51d737693d') return 'LAVAX'
  return ''
}

function knownName(addr: string): string {
  let a = addr.toLowerCase()
  if (a == '0x4888e4a2ee0f03051c72d2bd3acf755ed3498b3e') return 'Wrapped LUX'
  if (a == '0x848cff46eb323f323b6bbe1df274e40793d7f2c2') return 'Lux USD'
  if (a == '0x60e0a8167fc13de89348978860466c9cec24b9ba') return 'Lux Ether'
  if (a == '0x1e48d32a4f5e9f08db9ae4959163300faf8a6c8e') return 'Lux Bitcoin'
  if (a == '0x26b40f650156c7ebf9e087dd0dca181fe87625b7') return 'Lux Solana'
  if (a == '0x5e5290f350352768bd2bfc59c2da15dd04a7cb88') return 'Lux Zoo'
  if (a == '0x3141b94b89691009b950c96e97bff48e0c543e3c') return 'Lux Toncoin'
  if (a == '0x0e4bd0dd67c15decfbbbdbbe07fc9d51d737693d') return 'Lux AVAX'
  return ''
}

function knownDecimals(addr: string): i32 {
  let a = addr.toLowerCase()
  if (a == '0x1e48d32a4f5e9f08db9ae4959163300faf8a6c8e') return 8 // LBTC
  if (a == '0x3141b94b89691009b950c96e97bff48e0c543e3c') return 9 // LTON
  return 18
}

function fetchTokenSymbol(tokenAddress: Address): string {
  let known = knownSymbol(tokenAddress.toHexString())
  if (known != '') return known
  // Return address fragment for unknown tokens (no eth_call — node may lack historical state)
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
  // Load or create factory
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

    // Create bundle for LUX/ETH price tracking
    let bundle = new Bundle('1')
    bundle.ethPriceUSD = ZERO_BD
    bundle.luxPriceUSD = ZERO_BD
    bundle.save()
  }
  factory.poolCount = factory.poolCount.plus(ONE_BI)

  // Create or load token0
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

  // Create or load token1
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

  // Create the pool
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

  // Add pool to whitelist tracking for each token
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

  // Create the tracked pool from template
  PoolTemplate.create(event.params.pool)

  // Save all entities
  pool.save()
  token0.save()
  token1.save()
  factory.save()
}
