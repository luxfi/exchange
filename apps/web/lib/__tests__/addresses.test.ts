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
  getContracts,
} from '@luxexchange/exchange/contracts/addresses'

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

// ---- 8. DEX_PRECOMPILES addresses match LP numbering scheme ----

describe('DEX_PRECOMPILES LP numbering', () => {
  const EXPECTED_SUFFIXES: [string, string][] = [
    ['POOL_MANAGER', '9010'],
    ['SWAP_ROUTER', '9012'],
    ['HOOKS_REGISTRY', '9013'],
    ['FLASH_LOAN', '9014'],
    ['ORACLE_HUB', '9011'],
    ['CLOB', '9020'],
    ['VAULT', '9030'],
    ['TELEPORT', '6010'],
  ]

  it.each(EXPECTED_SUFFIXES)(
    'DEX_PRECOMPILES.%s ends with LP-%s',
    (name, suffix) => {
      const addr = (DEX_PRECOMPILES as Record<string, string>)[name]
      expect(addr).toBeDefined()
      // Precompile addresses are zero-padded with the LP number at the end
      expect(addr.toLowerCase()).toBe(
        `0x${'0'.repeat(40 - suffix.length)}${suffix}`,
      )
    },
  )

  it('all precompile addresses have leading zeros (low address space)', () => {
    for (const [key, addr] of addressEntries(DEX_PRECOMPILES)) {
      // First 30 hex chars after 0x should be zero
      const body = addr.slice(2, 32)
      expect(body, `DEX_PRECOMPILES.${key} should have leading zeros`).toMatch(/^0+$/)
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
