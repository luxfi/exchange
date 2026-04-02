import { Currency } from '@luxamm/sdk-core'
import { useCallback } from 'react'
import { TokenSelectorOption } from 'lx/src/components/lists/items/types'
import { type OnchainItemSection, OnchainItemSectionName } from 'lx/src/components/lists/OnchainItemList/types'
import { TokenSelectorFlow } from 'lx/src/components/TokenSelector/types'
import { flowToModalName } from 'lx/src/components/TokenSelector/utils'
import { TradeableAsset } from 'lx/src/entities/assets'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { CurrencyInfo } from 'lx/src/features/dataApi/types'
import { SearchContext } from 'lx/src/features/search/SearchModal/analytics/SearchContext'
import { ElementName, LxEventName } from 'lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'lx/src/features/telemetry/send'
import { isChainSupportedForChainedActions } from 'lx/src/features/transactions/swap/utils/chainedActions'
import { CurrencyField } from 'lx/src/types/currency'
import { currencyAddress } from 'lx/src/utils/currencyId'
import { useTrace } from 'utilities/src/telemetry/trace/TraceContext'

export function useTokenSelectionHandler({
  flow,
  currencyField,
  chainFilter,
  oppositeToken,
  debouncedSearchFilter,
  onSelectCurrency,
}: {
  flow: TokenSelectorFlow
  currencyField: CurrencyField
  chainFilter: UniverseChainId | null
  oppositeToken: TradeableAsset | undefined
  debouncedSearchFilter: string | null
  onSelectCurrency: (args: {
    currency: Currency
    field: CurrencyField
    allowCrossChainPair: boolean
    isPreselectedAsset: boolean
  }) => void
}): {
  currencyFieldName: ElementName | undefined
  onSelectCurrencyCallback: (
    currencyInfo: CurrencyInfo,
    section: OnchainItemSection<TokenSelectorOption>,
    index: number,
  ) => void
} {
  const { page } = useTrace()

  // Log currency field only for swap as for send it's always input
  const currencyFieldName =
    flow === TokenSelectorFlow.Swap
      ? currencyField === CurrencyField.INPUT
        ? ElementName.TokenInputSelector
        : ElementName.TokenOutputSelector
      : undefined

  const onSelectCurrencyCallback = useCallback(
    // eslint-disable-next-line max-params
    (currencyInfo: CurrencyInfo, section: OnchainItemSection<TokenSelectorOption>, index: number): void => {
      const searchContext: SearchContext = {
        category: section.sectionKey,
        query: debouncedSearchFilter ?? undefined,
        position: index + 1,
        suggestionCount: section.data.length,
        searchChainFilter: chainFilter,
      }

      // log event that a currency was selected
      const tokenOption = section.data[index]
      const balanceUSD = Array.isArray(tokenOption) ? undefined : (tokenOption?.balanceUSD ?? undefined)
      sendAnalyticsEvent(LxEventName.TokenSelected, {
        name: currencyInfo.currency.name,
        address: currencyAddress(currencyInfo.currency),
        chain: currencyInfo.currency.chainId,
        modal: flowToModalName(flow),
        page,
        field: currencyField,
        token_balance_usd: balanceUSD,
        category: searchContext.category,
        position: searchContext.position,
        suggestion_count: searchContext.suggestionCount,
        query: searchContext.query,
        tokenSection: section.sectionKey,
        preselect_asset: false,
      })

      const oppositeChainId = oppositeToken?.chainId

      const isUnsupportedCombo =
        (oppositeChainId && !isChainSupportedForChainedActions(oppositeChainId)) ||
        !isChainSupportedForChainedActions(currencyInfo.currency.chainId)

      const allowCrossChainPair = !isUnsupportedCombo || section.sectionKey === OnchainItemSectionName.BridgingTokens

      onSelectCurrency({
        currency: currencyInfo.currency,
        field: currencyField,
        allowCrossChainPair,
        isPreselectedAsset: false,
      })
    },
    [debouncedSearchFilter, chainFilter, flow, page, currencyField, onSelectCurrency, oppositeToken?.chainId],
  )

  return { currencyFieldName, onSelectCurrencyCallback }
}
