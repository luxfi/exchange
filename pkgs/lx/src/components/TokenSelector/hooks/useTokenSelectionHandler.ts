import { Currency } from '@luxamm/sdk-core'
import { useCallback } from 'react'
import { TokenSelectorOption } from '@l.x/lx/src/components/lists/items/types'
import { type OnchainItemSection, OnchainItemSectionName } from '@l.x/lx/src/components/lists/OnchainItemList/types'
import { TokenSelectorFlow } from '@l.x/lx/src/components/TokenSelector/types'
import { flowToModalName } from '@l.x/lx/src/components/TokenSelector/utils'
import { TradeableAsset } from '@l.x/lx/src/entities/assets'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { CurrencyInfo } from '@l.x/lx/src/features/dataApi/types'
import { SearchContext } from '@l.x/lx/src/features/search/SearchModal/analytics/SearchContext'
import { ElementName, LXEventName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
import { isChainSupportedForChainedActions } from '@l.x/lx/src/features/transactions/swap/utils/chainedActions'
import { CurrencyField } from '@l.x/lx/src/types/currency'
import { currencyAddress } from '@l.x/lx/src/utils/currencyId'
import { useTrace } from '@l.x/utils/src/telemetry/trace/TraceContext'

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
      sendAnalyticsEvent(LXEventName.TokenSelected, {
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
