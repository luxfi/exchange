import { GraphQLApi } from '@universe/api'
import { DAI, WRAPPED_NATIVE_CURRENCY } from 'uniswap/src/constants/tokens'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { gqlToCurrency, unwrapToken } from '~/appGraphql/data/util'
import { NATIVE_CHAIN_ID } from '~/constants/tokens'

const PATHUSD_ADDRESS = '0x20c0000000000000000000000000000000000000'

describe('gqlToCurrency', () => {
  describe('Tempo chain handling', () => {
    it('returns undefined for Tempo native token with no address', () => {
      const result = gqlToCurrency({
        chain: GraphQLApi.Chain.Tempo,
        standard: GraphQLApi.TokenStandard.Native,
      })
      expect(result).toBeUndefined()
    })

    it('returns undefined for Tempo native token with NATIVE_CHAIN_ID address', () => {
      const result = gqlToCurrency({
        chain: GraphQLApi.Chain.Tempo,
        standard: GraphQLApi.TokenStandard.Native,
        address: NATIVE_CHAIN_ID,
      })
      expect(result).toBeUndefined()
    })

    it('builds currency normally for Tempo token with Native standard but real address', () => {
      const result = gqlToCurrency({
        chain: GraphQLApi.Chain.Tempo,
        standard: GraphQLApi.TokenStandard.Native,
        address: PATHUSD_ADDRESS,
        decimals: 6,
        symbol: 'pathUSD',
        name: 'pathUSD',
      })
      expect(result).toBeDefined()
      expect(result?.isToken).toBe(true)
      expect(result?.symbol).toBe('pathUSD')
    })

    it('builds currency normally for Tempo ERC20 token', () => {
      const result = gqlToCurrency({
        chain: GraphQLApi.Chain.Tempo,
        address: PATHUSD_ADDRESS,
        decimals: 6,
        symbol: 'pathUSD',
        name: 'pathUSD',
      })
      expect(result).toBeDefined()
      expect(result?.isToken).toBe(true)
    })
  })

  describe('non-Tempo chains', () => {
    it('returns native currency for Mainnet native token', () => {
      const result = gqlToCurrency({
        chain: GraphQLApi.Chain.Ethereum,
        standard: GraphQLApi.TokenStandard.Native,
        address: NATIVE_CHAIN_ID,
      })
      expect(result).toBeDefined()
      expect(result?.isNative).toBe(true)
      expect(result?.chainId).toBe(UniverseChainId.Mainnet)
    })

    it('builds ERC20 token for Mainnet token with address', () => {
      const result = gqlToCurrency({
        chain: GraphQLApi.Chain.Ethereum,
        address: DAI.address,
        decimals: 18,
        symbol: 'DAI',
        name: 'Dai Stablecoin',
      })
      expect(result).toBeDefined()
      expect(result?.isToken).toBe(true)
      expect(result?.symbol).toBe('DAI')
    })

    it('returns undefined for missing chain', () => {
      const result = gqlToCurrency({})
      expect(result).toBeUndefined()
    })

    it('returns undefined for unsupported chain', () => {
      const result = gqlToCurrency({
        chain: 'INVALID' as GraphQLApi.Chain,
      })
      expect(result).toBeUndefined()
    })
  })
})

describe('unwrapToken', () => {
  it('does NOT unwrap pathUSD to native USD on Tempo', () => {
    const pathUsdToken = { address: PATHUSD_ADDRESS, symbol: 'pathUSD', name: 'pathUSD' }
    const result = unwrapToken(UniverseChainId.Tempo, pathUsdToken)
    expect(result.address).toBe(PATHUSD_ADDRESS)
    expect(result.symbol).toBe('pathUSD')
  })

  it('unwraps WETH to native ETH on Mainnet', () => {
    const wethAddress = WRAPPED_NATIVE_CURRENCY[UniverseChainId.Mainnet]?.address
    const wethToken = { address: wethAddress, symbol: 'WETH', name: 'Wrapped Ether' }
    const result = unwrapToken(UniverseChainId.Mainnet, wethToken)
    expect(result.address).toBe(NATIVE_CHAIN_ID)
  })

  it('does not unwrap non-wrapped tokens', () => {
    const daiToken = { address: DAI.address, symbol: 'DAI', name: 'Dai' }
    const result = unwrapToken(UniverseChainId.Mainnet, daiToken)
    expect(result.address).toBe(DAI.address)
    expect(result.symbol).toBe('DAI')
  })

  it('returns token unchanged when address is undefined', () => {
    const token = { address: undefined }
    const result = unwrapToken(UniverseChainId.Mainnet, token)
    expect(result).toBe(token)
  })
})
