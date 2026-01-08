import { TradingApi } from '@luxfi/api'
import { toGqlSafetyLevel } from 'lx/src/components/TokenSelector/utils'
import { getNativeAddress } from 'lx/src/constants/addresses'
import { toSupportedChainId } from 'lx/src/features/chains/utils'
import { CurrencyInfo } from 'lx/src/features/dataApi/types'
import { buildCurrency } from 'lx/src/features/dataApi/utils/buildCurrency'
import { getCurrencySafetyInfo } from 'lx/src/features/dataApi/utils/getCurrencySafetyInfo'
import { NATIVE_ADDRESS_FOR_TRADING_API } from 'lx/src/features/transactions/swap/utils/tradingApi'
import { currencyId } from 'lx/src/utils/currencyId'

export function tradingApiSwappableTokenToCurrencyInfo(
  token: TradingApi.GetSwappableTokensResponse['tokens'][0],
): CurrencyInfo | undefined {
  const isNative = token.address === NATIVE_ADDRESS_FOR_TRADING_API
  const supportedChainId = toSupportedChainId(token.chainId)

  if (!supportedChainId) {
    return undefined
  }

  const currency = buildCurrency({
    chainId: supportedChainId,
    address: isNative ? getNativeAddress(supportedChainId) : token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
  })

  if (!currency) {
    return undefined
  }

  const safetyLevel = toGqlSafetyLevel(token.project.safetyLevel)

  const currencyInfo: CurrencyInfo = {
    currency,
    currencyId: currencyId(currency),
    logoUrl: token.project.logo?.url,
    isSpam: token.project.isSpam,
    safetyInfo: getCurrencySafetyInfo(safetyLevel ?? undefined),
  }

  return currencyInfo
}
