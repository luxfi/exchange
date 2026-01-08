import type { GraphQLApi } from '@luxfi/api'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { fromGraphQLChain } from 'lx/src/features/chains/utils'
import { tokenProjectToCurrencyInfos } from 'lx/src/features/dataApi/tokenProjects/utils/tokenProjectToCurrencyInfos'
import type { CurrencyInfo } from 'lx/src/features/dataApi/types'
import { buildCurrency } from 'lx/src/features/dataApi/utils/buildCurrency'
import { removeSafetyInfo, usdcTokenProject } from 'lx/src/test/fixtures'

describe(tokenProjectToCurrencyInfos, () => {
  const project = usdcTokenProject()

  const getExpectedResult = (token: GraphQLApi.Token): CurrencyInfo =>
    ({
      logoUrl: project.logoUrl,
      currencyId: `${fromGraphQLChain(token.chain)}-${token.address}`,
      currency: buildCurrency({
        chainId: fromGraphQLChain(token.chain),
        address: token.address,
        decimals: token.decimals,
        symbol: token.symbol,
        name: token.name ?? project.name,
      }),
      isBridged: token.isBridged,
      bridgedWithdrawalInfo: token.bridgedWithdrawalInfo,
    }) as CurrencyInfo

  it('converts tokenProject to CurrencyInfo', () => {
    const result = tokenProjectToCurrencyInfos([project]).map(removeSafetyInfo)

    expect(result).toEqual(project.tokens.map((token) => getExpectedResult(token)))
  })

  it('filters by chainId if chainFilter is provided', () => {
    const result = tokenProjectToCurrencyInfos([project], UniverseChainId.Polygon).map(removeSafetyInfo)

    expect(result).toEqual(
      project.tokens.filter((token) => token.chain === 'POLYGON').map((token) => getExpectedResult(token)),
    )
  })

  it('filters out values for which currency is invalid', () => {
    const projectWithInvalidTokens = {
      ...project,
      tokens: [
        project.tokens[0],
        {
          ...project.tokens[1],
          chain: 'INVALID',
        },
      ],
    } as GraphQLApi.TokenProject

    const result = tokenProjectToCurrencyInfos([projectWithInvalidTokens], UniverseChainId.Mainnet).map(
      removeSafetyInfo,
    )

    expect(result).toEqual([getExpectedResult(project.tokens[0] as GraphQLApi.Token)])
  })
})
