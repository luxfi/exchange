import { ChainToken, MultichainToken } from '@uniswap/client-data-api/dist/data/v1/types_pb'
import { describe, expect, it } from 'vitest'
import { filterMultichainTokensByChainId } from '~/state/explore/listTokens/utils/filterMultichainTokensByChainId'

function createMultichainToken(chainIds: number[]): MultichainToken {
  return new MultichainToken({
    multichainId: 'mc:1_0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: 'USDC',
    name: 'USD Coin',
    projectName: 'Circle',
    logoUrl: '',
    chainTokens: chainIds.map(
      (chainId) =>
        new ChainToken({
          chainId,
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 6,
        }),
    ),
  })
}

describe('filterMultichainTokensByChainId', () => {
  it('should filter out tokens that do not have the selected chain', () => {
    const tokenChain1Only = createMultichainToken([1])
    const tokenChain137Only = createMultichainToken([137])
    const result = filterMultichainTokensByChainId([tokenChain1Only, tokenChain137Only], 1)
    expect(result).toHaveLength(1)
    expect(result[0]?.symbol).toBe('USDC')
    expect(result[0]?.chainTokens).toHaveLength(1)
    expect(result[0]?.chainTokens[0]?.chainId).toBe(1)
  })

  it('should narrow each token to a single chainToken for the selected chain', () => {
    const tokenMultiChain = createMultichainToken([1, 137, 8453])
    expect(tokenMultiChain.chainTokens).toHaveLength(3)
    const result = filterMultichainTokensByChainId([tokenMultiChain], 137)
    expect(result).toHaveLength(1)
    expect(result[0]?.chainTokens).toHaveLength(1)
    expect(result[0]?.chainTokens[0]?.chainId).toBe(137)
    expect(result[0]?.chainTokens[0]?.address).toBe('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')
  })

  it('should return empty array when no token has the selected chain', () => {
    const tokenChain1 = createMultichainToken([1])
    const result = filterMultichainTokensByChainId([tokenChain1], 137)
    expect(result).toHaveLength(0)
  })

  it('should preserve token fields when narrowing chainTokens', () => {
    const token = createMultichainToken([1, 137])
    const result = filterMultichainTokensByChainId([token], 1)
    expect(result[0]?.multichainId).toBe(token.multichainId)
    expect(result[0]?.symbol).toBe(token.symbol)
    expect(result[0]?.name).toBe(token.name)
    expect(result[0]?.chainTokens).toHaveLength(1)
  })
})
