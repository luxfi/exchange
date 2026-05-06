import { brand } from '@l.x/config'
import { config } from '@l.x/lx/src/config'
import {
  getBootnodeChainPathSuffix,
  getBootnodeChainSlug,
  getBootnodeRpcUrl,
} from '@l.x/lx/src/features/chains/evm/rpc'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'

vi.mock('@l.x/lx/src/config', () => ({
  config: {
    bootnodeRpcUrlOverride: '',
  },
}))

vi.mock('@l.x/config', () => ({
  brand: {
    gatewayDomain: 'api.lux.exchange',
  },
}))

describe('getBootnodeChainPathSuffix', () => {
  // Bootnode normalizes per-chain path suffixes server-side, so the client
  // helper always returns ''. Kept for parity with the prior Quicknode
  // helper so call sites can still concatenate the suffix harmlessly.
  const testCases: Array<[UniverseChainId, string]> = [
    [UniverseChainId.Avalanche, ''],
    [UniverseChainId.Mainnet, ''],
    [UniverseChainId.ArbitrumOne, ''],
    [UniverseChainId.Base, ''],
    [UniverseChainId.Blast, ''],
    [UniverseChainId.Bnb, ''],
    [UniverseChainId.Celo, ''],
    [UniverseChainId.Monad, ''],
    [UniverseChainId.Optimism, ''],
    [UniverseChainId.Polygon, ''],
    [UniverseChainId.Sepolia, ''],
    [UniverseChainId.UnichainSepolia, ''],
    [UniverseChainId.WorldChain, ''],
    [UniverseChainId.XLayer, ''],
    [UniverseChainId.Zksync, ''],
    [UniverseChainId.Zora, ''],
  ]

  it.each(testCases)('returns empty path suffix for %s', (chainId, expectedSuffix) => {
    expect(getBootnodeChainPathSuffix(chainId)).toBe(expectedSuffix)
  })
})

describe('getBootnodeRpcUrl', () => {
  it('uses brand.gatewayDomain by default', () => {
    vi.mocked(config).bootnodeRpcUrlOverride = ''
    vi.mocked(brand).gatewayDomain = 'api.lux.exchange'

    expect(getBootnodeRpcUrl(UniverseChainId.Base)).toBe('https://api.lux.exchange/v1/rpc/base')
  })

  it('honors the bootnodeRpcUrlOverride config (with trailing slash)', () => {
    vi.mocked(config).bootnodeRpcUrlOverride = 'https://bootnode.dev.example.com/'

    expect(getBootnodeRpcUrl(UniverseChainId.Polygon)).toBe('https://bootnode.dev.example.com/v1/rpc/polygon')

    vi.mocked(config).bootnodeRpcUrlOverride = ''
  })

  it('throws for unsupported chain', () => {
    vi.mocked(config).bootnodeRpcUrlOverride = ''
    // @ts-expect-error testing invalid chain id
    expect(() => getBootnodeRpcUrl(999999)).toThrow(
      'Chain 999999 does not have a corresponding Bootnode chain slug',
    )
  })

  it('handles all supported chains without throwing', () => {
    vi.mocked(config).bootnodeRpcUrlOverride = ''
    vi.mocked(brand).gatewayDomain = 'api.lux.exchange'

    const supportedChains = [
      UniverseChainId.ArbitrumOne,
      UniverseChainId.Avalanche,
      UniverseChainId.Base,
      UniverseChainId.Blast,
      UniverseChainId.Bnb,
      UniverseChainId.Celo,
      UniverseChainId.Monad,
      UniverseChainId.XLayer,
      UniverseChainId.Optimism,
      UniverseChainId.Polygon,
      UniverseChainId.Sepolia,
      UniverseChainId.UnichainSepolia,
      UniverseChainId.WorldChain,
      UniverseChainId.Zksync,
      UniverseChainId.Zora,
      UniverseChainId.Mainnet,
    ]

    supportedChains.forEach((chainId) => {
      const url = getBootnodeRpcUrl(chainId)
      expect(url).toBe(`https://api.lux.exchange/v1/rpc/${getBootnodeChainSlug(chainId)}`)
      expect(url).not.toBe('')
      expect(url.startsWith('https://')).toBe(true)
    })
  })
})

describe('getBootnodeChainSlug', () => {
  it('returns correct bootnode slug for each chain', () => {
    expect(getBootnodeChainSlug(UniverseChainId.Mainnet)).toBe('ethereum')
    expect(getBootnodeChainSlug(UniverseChainId.ArbitrumOne)).toBe('arbitrum')
    expect(getBootnodeChainSlug(UniverseChainId.Avalanche)).toBe('avalanche')
    expect(getBootnodeChainSlug(UniverseChainId.Base)).toBe('base')
    expect(getBootnodeChainSlug(UniverseChainId.Blast)).toBe('blast')
    expect(getBootnodeChainSlug(UniverseChainId.Bnb)).toBe('bsc')
    expect(getBootnodeChainSlug(UniverseChainId.Celo)).toBe('celo')
    expect(getBootnodeChainSlug(UniverseChainId.Monad)).toBe('monad')
    expect(getBootnodeChainSlug(UniverseChainId.Optimism)).toBe('optimism')
    expect(getBootnodeChainSlug(UniverseChainId.Polygon)).toBe('polygon')
    expect(getBootnodeChainSlug(UniverseChainId.Sepolia)).toBe('sepolia')
    expect(getBootnodeChainSlug(UniverseChainId.UnichainSepolia)).toBe('unichain-sepolia')
    expect(getBootnodeChainSlug(UniverseChainId.WorldChain)).toBe('worldchain')
    expect(getBootnodeChainSlug(UniverseChainId.Zksync)).toBe('zksync')
    expect(getBootnodeChainSlug(UniverseChainId.Zora)).toBe('zora')
    expect(getBootnodeChainSlug(UniverseChainId.XLayer)).toBe('xlayer')
  })

  it('throws error for unsupported chain', () => {
    // @ts-expect-error testing invalid chain id
    expect(() => getBootnodeChainSlug(999999)).toThrow('Chain 999999 does not have a corresponding Bootnode chain slug')
  })
})
