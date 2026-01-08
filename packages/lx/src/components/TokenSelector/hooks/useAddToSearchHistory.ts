import { useDispatch } from 'react-redux'
import { OnchainItemListOptionType, PoolOption, SearchModalOption } from 'lx/src/components/lists/items/types'
import { getNativeAddress } from 'lx/src/constants/addresses'
import { CurrencyInfo } from 'lx/src/features/dataApi/types'
import {
  PoolSearchHistoryResult,
  SearchHistoryResultType,
  TokenSearchHistoryResult,
} from 'lx/src/features/search/SearchHistoryResult'
import { addToSearchHistory } from 'lx/src/features/search/searchHistorySlice'
import { tokenAddressOrNativeAddress } from 'lx/src/features/search/utils'

export function useAddToSearchHistory(): {
  registerSearchItem: (item: SearchModalOption) => void
  registerSearchTokenCurrencyInfo: (currencyInfo: CurrencyInfo) => void
} {
  const dispatch = useDispatch()

  const registerSearchItem = (item: SearchModalOption): void => {
    switch (item.type) {
      case OnchainItemListOptionType.Pool:
        dispatch(addToSearchHistory({ searchResult: poolOptionToSearchHistoryResult(item) }))
        break
      case OnchainItemListOptionType.Token:
        dispatch(addToSearchHistory({ searchResult: currencyInfoToTokenSearchHistoryResult(item.currencyInfo) }))
        break
      case OnchainItemListOptionType.WalletByAddress:
      case OnchainItemListOptionType.Unitag:
      case OnchainItemListOptionType.ENSAddress:
        dispatch(
          addToSearchHistory({
            // ensName, unitag, primaryENSName, etc are dynamic and should be re-fetched at calltime
            // so we add to search history as a simple `WalletByAddress` type and do the refetching inside WalletByAddressOptionItem
            searchResult: { address: item.address, type: SearchHistoryResultType.WalletByAddress },
          }),
        )
        break
      case OnchainItemListOptionType.NFTCollection:
        dispatch(
          addToSearchHistory({
            searchResult: {
              ...item,
              type: SearchHistoryResultType.NFTCollection,
            },
          }),
        )
        break
    }
  }

  const registerSearchTokenCurrencyInfo = (currencyInfo: CurrencyInfo): void => {
    dispatch(addToSearchHistory({ searchResult: currencyInfoToTokenSearchHistoryResult(currencyInfo) }))
  }

  return { registerSearchItem, registerSearchTokenCurrencyInfo }
}

function poolOptionToSearchHistoryResult(item: PoolOption): PoolSearchHistoryResult {
  const { chainId, poolId, token0CurrencyInfo, token1CurrencyInfo, protocolVersion, feeTier } = item
  return {
    type: SearchHistoryResultType.Pool,
    chainId,
    poolId,
    token0CurrencyId: token0CurrencyInfo.currencyId,
    token1CurrencyId: token1CurrencyInfo.currencyId,
    protocolVersion,
    feeTier,
  }
}

function currencyInfoToTokenSearchHistoryResult(currencyInfo: CurrencyInfo): TokenSearchHistoryResult {
  const address = currencyInfo.currency.isToken
    ? currencyInfo.currency.address
    : getNativeAddress(currencyInfo.currency.chainId)

  return {
    type: SearchHistoryResultType.Token,
    chainId: currencyInfo.currency.chainId,
    address: tokenAddressOrNativeAddress(address, currencyInfo.currency.chainId),
  }
}
