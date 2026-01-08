import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { NoResultsFound } from 'lx/src/components/lists/NoResultsFound'
import { useAddToSearchHistory } from 'lx/src/components/TokenSelector/hooks/useAddToSearchHistory'
import { useTokenSectionsForSearchResults } from 'lx/src/components/TokenSelector/hooks/useTokenSectionsForSearchResults'
import { TokenSelectorList } from 'lx/src/components/TokenSelector/TokenSelectorList'
import { OnSelectCurrency } from 'lx/src/components/TokenSelector/types'
import { TradeableAsset } from 'lx/src/entities/assets'
import { UniverseChainId } from 'lx/src/features/chains/types'

function _TokenSelectorSearchResultsList({
  onSelectCurrency: parentOnSelectCurrency,
  evmAddress,
  svmAddress,
  chainFilter,
  parsedChainFilter,
  searchFilter,
  debouncedSearchFilter,
  debouncedParsedSearchFilter,
  isBalancesOnlySearch,
  input,
  renderedInModal,
}: {
  onSelectCurrency: OnSelectCurrency
  evmAddress?: string
  svmAddress?: string
  chainFilter: UniverseChainId | null
  parsedChainFilter: UniverseChainId | null
  searchFilter: string
  debouncedSearchFilter: string | null
  debouncedParsedSearchFilter: string | null
  isBalancesOnlySearch: boolean
  input: TradeableAsset | undefined
  renderedInModal: boolean
}): JSX.Element {
  const { t } = useTranslation()
  const { registerSearchTokenCurrencyInfo } = useAddToSearchHistory()
  const {
    data: sections,
    loading,
    error,
    refetch,
  } = useTokenSectionsForSearchResults({
    evmAddress,
    svmAddress,
    chainFilter: chainFilter ?? parsedChainFilter,
    searchFilter: debouncedParsedSearchFilter ?? debouncedSearchFilter,
    isBalancesOnlySearch,
    input,
  })

  // eslint-disable-next-line max-params
  const onSelectCurrency: OnSelectCurrency = (currencyInfo, section, index) => {
    parentOnSelectCurrency(currencyInfo, section, index)
    registerSearchTokenCurrencyInfo(currencyInfo)
  }

  const userIsTyping = Boolean(searchFilter && debouncedSearchFilter !== searchFilter)

  const emptyElement = useMemo(
    () => (debouncedSearchFilter ? <NoResultsFound searchFilter={debouncedSearchFilter} /> : undefined),
    [debouncedSearchFilter],
  )
  return (
    <TokenSelectorList
      showTokenAddress
      chainFilter={chainFilter}
      emptyElement={emptyElement}
      errorText={t('token.selector.search.error')}
      hasError={Boolean(error)}
      loading={userIsTyping || loading}
      refetch={refetch}
      sections={sections}
      showTokenWarnings={true}
      renderedInModal={renderedInModal}
      onSelectCurrency={onSelectCurrency}
    />
  )
}

export const TokenSelectorSearchResultsList = memo(_TokenSelectorSearchResultsList)
