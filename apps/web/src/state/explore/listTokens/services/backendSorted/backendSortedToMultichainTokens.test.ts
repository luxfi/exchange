import { ListTokensResponse } from '@uniswap/client-data-api/dist/data/v1/api_pb'
import { Token, TokenMetadata, TokenStats, TokenType } from '@uniswap/client-data-api/dist/data/v1/types_pb'
import { backendSortedToMultichainTokens } from '~/state/explore/listTokens/services/backendSorted/backendSortedToMultichainTokens'

function createLegacyToken(
  overrides: {
    chainId?: number
    address?: string
    symbol?: string
    name?: string
    decimals?: number
    projectName?: string
    logoUrl?: string
    volume1d?: number
  } = {},
): Token {
  const {
    chainId = 1,
    address = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol = 'USDC',
    name = 'USD Coin',
    decimals = 6,
    projectName = 'Circle',
    logoUrl = 'https://example.com/usdc.png',
    volume1d = 1_000_000,
  } = overrides

  const metadata = new TokenMetadata({
    projectName,
    logoUrl,
    safetyLevel: 1,
    spamCode: 1,
    isBridged: false,
  })

  const stats = new TokenStats({
    volume1d,
    price: 1,
    priceHistory1d: [],
  })

  return new Token({
    chainId,
    address,
    symbol,
    name,
    decimals,
    type: TokenType.ERC20,
    metadata,
    stats,
  })
}

describe('backendSortedToMultichainTokens', () => {
  it('should return empty array when response is undefined', () => {
    expect(backendSortedToMultichainTokens(undefined)).toEqual([])
  })

  it('should return empty array when response has no tokens', () => {
    const response = new ListTokensResponse({
      tokens: [],
      multichainTokens: [],
    })
    expect(backendSortedToMultichainTokens(response)).toEqual([])
  })

  it('should return empty array when response.tokens is missing', () => {
    const response = new ListTokensResponse({
      multichainTokens: [],
    })
    expect(backendSortedToMultichainTokens(response)).toEqual([])
  })

  it('should transform one legacy token into one MultichainToken with one ChainToken', () => {
    const token = createLegacyToken({
      chainId: 1,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
    })
    const response = new ListTokensResponse({
      tokens: [token],
      multichainTokens: [],
    })

    const result = backendSortedToMultichainTokens(response)

    expect(result).toHaveLength(1)
    const mc = result[0]!
    expect(mc.multichainId).toBe('mc:1_0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')
    expect(mc.symbol).toBe('USDC')
    expect(mc.name).toBe('USD Coin')
    expect(mc.projectName).toBe('Circle')
    expect(mc.logoUrl).toBe('https://example.com/usdc.png')
    expect(mc.chainTokens).toHaveLength(1)
    expect(mc.chainTokens[0]?.chainId).toBe(1)
    expect(mc.chainTokens[0]?.address).toBe('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')
    expect(mc.chainTokens[0]?.decimals).toBe(6)
    expect(mc.chainTokens[0]?.isBridged).toBe(false)
    expect(mc.stats?.volume1d).toBe(1_000_000)
  })

  it('should transform multiple legacy tokens into multiple MultichainTokens', () => {
    const token1 = createLegacyToken({
      chainId: 1,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
    })
    const token2 = createLegacyToken({
      chainId: 8453,
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      symbol: 'ETH',
      name: 'Ethereum',
    })
    const response = new ListTokensResponse({
      tokens: [token1, token2],
      multichainTokens: [],
    })

    const result = backendSortedToMultichainTokens(response)

    expect(result).toHaveLength(2)
    expect(result[0]?.multichainId).toBe('mc:1_0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')
    expect(result[0]?.symbol).toBe('USDC')
    expect(result[1]?.multichainId).toBe('mc:8453_0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913')
    expect(result[1]?.symbol).toBe('ETH')
    expect(result[1]?.name).toBe('Ethereum')
    expect(result[0]?.chainTokens).toHaveLength(1)
    expect(result[1]?.chainTokens).toHaveLength(1)
  })

  it('should map token stats to ChainTokenStats for each chain token', () => {
    const token = createLegacyToken({
      volume1d: 5_000_000,
    })
    token.stats = new TokenStats({
      volume1h: 100,
      volume1d: 5_000_000,
      volume7d: 10_000_000,
      volume30d: 50_000_000,
      volume1y: 100_000_000,
      priceHistory1d: [],
    })
    const response = new ListTokensResponse({
      tokens: [token],
      multichainTokens: [],
    })

    const result = backendSortedToMultichainTokens(response)
    const chainToken = result[0]?.chainTokens[0]

    expect(chainToken.stats?.volume1h).toBe(100)
    expect(chainToken.stats?.volume1d).toBe(5_000_000)
    expect(chainToken.stats?.volume7d).toBe(10_000_000)
    expect(chainToken.stats?.volume30d).toBe(50_000_000)
    expect(chainToken.stats?.volume1y).toBe(100_000_000)
  })
})
