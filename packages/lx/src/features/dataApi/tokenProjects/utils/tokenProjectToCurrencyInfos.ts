import { GraphQLApi } from '@luxfi/api'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { fromGraphQLChain } from 'lx/src/features/chains/utils'
import { CurrencyInfo } from 'lx/src/features/dataApi/types'
import { buildCurrency, buildCurrencyInfo } from 'lx/src/features/dataApi/utils/buildCurrency'
import { getCurrencySafetyInfo } from 'lx/src/features/dataApi/utils/getCurrencySafetyInfo'
import { currencyId } from 'lx/src/utils/currencyId'

export function tokenProjectToCurrencyInfos(
  tokenProjects: GraphQLApi.TokenProjectsQuery['tokenProjects'],
  chainFilter?: UniverseChainId | null,
): CurrencyInfo[] {
  return tokenProjects
    ?.flatMap((project) =>
      project?.tokens.map((token) => {
        const { logoUrl, safetyLevel } = project
        const { name, chain, address, decimals, symbol, feeData, protectionInfo, isBridged, bridgedWithdrawalInfo } =
          token
        const chainId = fromGraphQLChain(chain)

        if (chainFilter && chainFilter !== chainId) {
          return null
        }

        const currency = buildCurrency({
          chainId,
          address,
          decimals,
          symbol,
          name,
          buyFeeBps: feeData?.buyFeeBps,
          sellFeeBps: feeData?.sellFeeBps,
        })

        if (!currency) {
          return null
        }

        const currencyInfo = buildCurrencyInfo({
          currency,
          currencyId: currencyId(currency),
          logoUrl,
          safetyInfo: getCurrencySafetyInfo(safetyLevel, protectionInfo),
          isBridged,
          bridgedWithdrawalInfo,
        })

        return currencyInfo
      }),
    )
    .filter(Boolean) as CurrencyInfo[]
}
