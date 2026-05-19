import { describe, it, expect } from 'vitest'
import {
  LUX_MAINNET_CONTRACTS,
  LUX_TESTNET_CONTRACTS,
  LUX_DEV_CONTRACTS,
  ZOO_MAINNET_CONTRACTS,
  HANZO_MAINNET_CONTRACTS,
  SPC_MAINNET_CONTRACTS,
  PARS_MAINNET_CONTRACTS,
  DEX_PRECOMPILES,
  PQ_CRYPTO_PRECOMPILES,
  getContracts,
} from '../src/contracts/addresses'

// ---- helpers ----

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

function allAddresses(obj: Record<string, string>): string[] {
  return Object.values(obj)
}

function addressEntries(obj: Record<string, string>): [string, string][] {
  return Object.entries(obj)
}

// Known EMPTY legacy addresses from DEPLOYMENTS.md -- these should NOT appear
// in the current production contract set.
const KNOWN_EMPTY_LEGACY = [
  '0xd9a95609DbB228A13568Bd9f9A285105E7596970',
  '0x1F6cbC7d3bc7D803ee76D80F0eEE25767431e674',
  '0xb732BD88F25EdD9C3456638671fB37685D4B4e3f',
]

// ---- 1. All chain contract sets exist ----

describe('contract set exports', () => {
  it.each([
    ['LUX_MAINNET_CONTRACTS', LUX_MAINNET_CONTRACTS],
    ['LUX_TESTNET_CONTRACTS', LUX_TESTNET_CONTRACTS],
    ['LUX_DEV_CONTRACTS', LUX_DEV_CONTRACTS],
    ['ZOO_MAINNET_CONTRACTS', ZOO_MAINNET_CONTRACTS],
    ['HANZO_MAINNET_CONTRACTS', HANZO_MAINNET_CONTRACTS],
    ['SPC_MAINNET_CONTRACTS', SPC_MAINNET_CONTRACTS],
    ['PARS_MAINNET_CONTRACTS', PARS_MAINNET_CONTRACTS],
    ['DEX_PRECOMPILES', DEX_PRECOMPILES],
    ['PQ_CRYPTO_PRECOMPILES', PQ_CRYPTO_PRECOMPILES],
  ])('%s is a non-empty object', (_name, contracts) => {
    expect(contracts).toBeDefined()
    expect(typeof contracts).toBe('object')
    expect(Object.keys(contracts).length).toBeGreaterThan(0)
  })
})

// ---- 2. getContracts() returns correct set for every chain ID ----

describe('getContracts()', () => {
  it.each([
    [96369, LUX_MAINNET_CONTRACTS],
    [96368, LUX_TESTNET_CONTRACTS],
    [200200, ZOO_MAINNET_CONTRACTS],
    [36963, HANZO_MAINNET_CONTRACTS],
    [36911, SPC_MAINNET_CONTRACTS],
    [494949, PARS_MAINNET_CONTRACTS],
    [1337, LUX_DEV_CONTRACTS],
  ])('chain %i returns the correct contract set', (chainId, expected) => {
    expect(getContracts(chainId)).toBe(expected)
  })

  // ---- 3. Unknown chain IDs fall back to mainnet (not undefined) ----

  it.each([999, 0, -1, 12345, 1])('unknown chain %i returns LUX_MAINNET_CONTRACTS', (chainId) => {
    const result = getContracts(chainId)
    expect(result).toBe(LUX_MAINNET_CONTRACTS)
    expect(result).toBeDefined()
  })
})

// ---- 4. All addresses are valid hex (0x + 40 hex chars) ----

describe('address format validation', () => {
  const ALL_SETS: [string, Record<string, string>][] = [
    ['LUX_MAINNET_CONTRACTS', LUX_MAINNET_CONTRACTS],
    ['LUX_TESTNET_CONTRACTS', LUX_TESTNET_CONTRACTS],
    ['LUX_DEV_CONTRACTS', LUX_DEV_CONTRACTS],
    ['ZOO_MAINNET_CONTRACTS', ZOO_MAINNET_CONTRACTS],
    ['HANZO_MAINNET_CONTRACTS', HANZO_MAINNET_CONTRACTS],
    ['SPC_MAINNET_CONTRACTS', SPC_MAINNET_CONTRACTS],
    ['PARS_MAINNET_CONTRACTS', PARS_MAINNET_CONTRACTS],
    ['DEX_PRECOMPILES', DEX_PRECOMPILES],
    ['PQ_CRYPTO_PRECOMPILES', PQ_CRYPTO_PRECOMPILES],
  ]

  it.each(ALL_SETS)('%s has valid hex addresses (0x + 40 hex chars)', (_name, contracts) => {
    for (const [key, addr] of addressEntries(contracts)) {
      expect(addr, `${_name}.${key} = "${addr}"`).toMatch(ADDRESS_RE)
    }
  })
})

// ---- 5. No duplicate addresses within a single chain ----

describe('no duplicate addresses within a chain', () => {
  const CHAIN_SETS: [string, Record<string, string>][] = [
    ['LUX_MAINNET_CONTRACTS', LUX_MAINNET_CONTRACTS],
    ['LUX_TESTNET_CONTRACTS', LUX_TESTNET_CONTRACTS],
    ['LUX_DEV_CONTRACTS', LUX_DEV_CONTRACTS],
    ['ZOO_MAINNET_CONTRACTS', ZOO_MAINNET_CONTRACTS],
    ['HANZO_MAINNET_CONTRACTS', HANZO_MAINNET_CONTRACTS],
    ['SPC_MAINNET_CONTRACTS', SPC_MAINNET_CONTRACTS],
    ['PARS_MAINNET_CONTRACTS', PARS_MAINNET_CONTRACTS],
    ['DEX_PRECOMPILES', DEX_PRECOMPILES],
  ]

  it.each(CHAIN_SETS)('%s has no duplicate addresses', (_name, contracts) => {
    const addrs = allAddresses(contracts).map((a) => a.toLowerCase())
    const unique = new Set(addrs)
    const dupes = addrs.filter((a, i) => addrs.indexOf(a) !== i)
    expect(dupes, `${_name} has duplicates: ${dupes.join(', ')}`).toHaveLength(0)
    expect(unique.size).toBe(addrs.length)
  })
})

// ---- 6. Critical addresses are not empty/zero ----

describe('critical addresses are not zero', () => {
  const SETS_WITH_AMM: [string, Record<string, string>][] = [
    ['LUX_MAINNET_CONTRACTS', LUX_MAINNET_CONTRACTS],
    ['LUX_TESTNET_CONTRACTS', LUX_TESTNET_CONTRACTS],
    ['LUX_DEV_CONTRACTS', LUX_DEV_CONTRACTS],
    ['ZOO_MAINNET_CONTRACTS', ZOO_MAINNET_CONTRACTS],
    ['HANZO_MAINNET_CONTRACTS', HANZO_MAINNET_CONTRACTS],
    ['SPC_MAINNET_CONTRACTS', SPC_MAINNET_CONTRACTS],
    ['PARS_MAINNET_CONTRACTS', PARS_MAINNET_CONTRACTS],
  ]

  it.each(SETS_WITH_AMM)('%s V2_FACTORY is not the zero address', (_name, contracts) => {
    expect(contracts.V2_FACTORY).toBeDefined()
    expect(contracts.V2_FACTORY.toLowerCase()).not.toBe(ZERO_ADDRESS)
  })

  it.each(SETS_WITH_AMM)('%s V2_ROUTER is not the zero address', (_name, contracts) => {
    expect(contracts.V2_ROUTER).toBeDefined()
    expect(contracts.V2_ROUTER.toLowerCase()).not.toBe(ZERO_ADDRESS)
  })
})

// ---- 7. Mainnet addresses don't match known EMPTY legacy addresses ----

describe('mainnet addresses are not known-empty legacy', () => {
  const legacyLower = KNOWN_EMPTY_LEGACY.map((a) => a.toLowerCase())

  it('LUX_MAINNET_CONTRACTS contains no legacy EMPTY addresses', () => {
    for (const [key, addr] of addressEntries(LUX_MAINNET_CONTRACTS)) {
      expect(
        legacyLower.includes(addr.toLowerCase()),
        `LUX_MAINNET_CONTRACTS.${key} matches known-empty legacy address ${addr}`,
      ).toBe(false)
    }
  })
})

// ---- 8. DEX_PRECOMPILES addresses match canonical 0x04xx block ----

describe('DEX_PRECOMPILES canonical 0x04xx addresses', () => {
  const EXPECTED_SUFFIXES: [string, string][] = [
    // Core DEX (0x0400-0x040F)
    ['POOL_MANAGER', '0400'],
    ['SWAP_ROUTER', '0401'],
    ['HOOKS_REGISTRY', '0402'],
    ['FLASH_LOAN', '0403'],
    // Lending (0x0410-0x041F)
    ['LENDING_POOL', '0410'],
    ['INTEREST_RATE', '0411'],
    ['LIQUIDATOR', '0412'],
    // Perpetuals (0x0420-0x042F)
    ['PERP_ENGINE', '0420'],
    ['FUNDING_RATE', '0421'],
    ['INSURANCE_FUND', '0422'],
    // Liquid Vaults (0x0430-0x043F)
    ['LIQUID_VAULT', '0430'],
    ['LIQUID_FX', '0431'],
    ['LIQUID_TOKEN', '0432'],
    ['YIELD_ROUTER', '0433'],
    // Bridges (0x0440-0x044F)
    ['TELEPORT_BRIDGE', '0440'],
    ['OMNICHAIN_ROUTER', '0441'],
  ]

  it.each(EXPECTED_SUFFIXES)(
    'DEX_PRECOMPILES.%s ends with 0x%s',
    (name, suffix) => {
      const addr = (DEX_PRECOMPILES as Record<string, string>)[name]
      expect(addr).toBeDefined()
      expect(addr.toLowerCase()).toBe(
        `0x${'0'.repeat(40 - suffix.length)}${suffix}`,
      )
    },
  )

  it('all DEX precompile addresses have leading zeros (low address space)', () => {
    for (const [key, addr] of addressEntries(DEX_PRECOMPILES)) {
      const body = addr.slice(2, 32)
      expect(body, `DEX_PRECOMPILES.${key} should have leading zeros`).toMatch(/^0+$/)
    }
  })
})

// ---- 8b. PQ_CRYPTO_PRECOMPILES match LP-4200 unified PQCrypto block ----

describe('PQ_CRYPTO_PRECOMPILES LP-4200 unified block', () => {
  const EXPECTED: [string, string][] = [
    ['ML_KEM', '012201'],
    ['ML_DSA', '012202'],
    ['SLH_DSA', '012203'],
    ['PULSAR', '012204'],
    ['P3Q', '012205'],
    ['CORONA', '012206'],
    ['MAGNETAR', '012207'],
    ['HQC', '012208'],
  ]

  it.each(EXPECTED)('PQ_CRYPTO_PRECOMPILES.%s = 0x..%s', (name, suffix) => {
    const addr = (PQ_CRYPTO_PRECOMPILES as Record<string, string>)[name]
    expect(addr).toBeDefined()
    expect(addr.toLowerCase()).toBe(
      `0x${'0'.repeat(40 - suffix.length)}${suffix}`,
    )
  })

  it('PQ precompiles are non-empty, well-formed hex', () => {
    for (const [key, addr] of addressEntries(PQ_CRYPTO_PRECOMPILES)) {
      expect(addr, `PQ_CRYPTO_PRECOMPILES.${key} = "${addr}"`).toMatch(ADDRESS_RE)
    }
  })
})

// ---- 9. All subnet chains have at least V2_FACTORY and V2_ROUTER ----

describe('subnet chains have required AMM contracts', () => {
  const SUBNET_SETS: [string, Record<string, string>][] = [
    ['ZOO_MAINNET_CONTRACTS', ZOO_MAINNET_CONTRACTS],
    ['HANZO_MAINNET_CONTRACTS', HANZO_MAINNET_CONTRACTS],
    ['SPC_MAINNET_CONTRACTS', SPC_MAINNET_CONTRACTS],
    ['PARS_MAINNET_CONTRACTS', PARS_MAINNET_CONTRACTS],
  ]

  it.each(SUBNET_SETS)('%s has V2_FACTORY', (_name, contracts) => {
    expect(contracts).toHaveProperty('V2_FACTORY')
    expect(contracts.V2_FACTORY).toMatch(ADDRESS_RE)
  })

  it.each(SUBNET_SETS)('%s has V2_ROUTER', (_name, contracts) => {
    expect(contracts).toHaveProperty('V2_ROUTER')
    expect(contracts.V2_ROUTER).toMatch(ADDRESS_RE)
  })
})

// ---- 10. WLUX address differs between mainnet and testnet ----

describe('WLUX differs between networks', () => {
  it('mainnet WLUX is different from testnet WLUX', () => {
    expect(LUX_MAINNET_CONTRACTS.WLUX.toLowerCase()).not.toBe(
      LUX_TESTNET_CONTRACTS.WLUX.toLowerCase(),
    )
  })

  it('mainnet WLUX is different from dev WLUX', () => {
    expect(LUX_MAINNET_CONTRACTS.WLUX.toLowerCase()).not.toBe(
      LUX_DEV_CONTRACTS.WLUX.toLowerCase(),
    )
  })

  it('testnet WLUX is different from dev WLUX', () => {
    expect(LUX_TESTNET_CONTRACTS.WLUX.toLowerCase()).not.toBe(
      LUX_DEV_CONTRACTS.WLUX.toLowerCase(),
    )
  })
})
