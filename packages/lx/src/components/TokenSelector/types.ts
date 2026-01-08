import { TokenSelectorOption } from 'lx/src/components/lists/items/types'
import type { OnchainItemSection } from 'lx/src/components/lists/OnchainItemList/types'
import { TradeableAsset } from 'lx/src/entities/assets'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { CurrencyInfo } from 'lx/src/features/dataApi/types'
import { FiatNumberType } from 'utilities/src/format/types'

export type OnSelectCurrency = (
  currency: CurrencyInfo,
  section: OnchainItemSection<TokenSelectorOption>,
  index: number,
) => void

export type TokenSectionsHookProps = {
  evmAddress?: Address
  svmAddress?: Address
  chainFilter: UniverseChainId | null
  oppositeSelectedToken?: TradeableAsset
}

export type ConvertFiatAmountFormattedCallback = (
  fromAmount: Maybe<string | number>,
  numberType: FiatNumberType,
  placeholder?: string | undefined,
) => string

export enum TokenSelectorFlow {
  Swap = 0,
  Send = 1,
}
