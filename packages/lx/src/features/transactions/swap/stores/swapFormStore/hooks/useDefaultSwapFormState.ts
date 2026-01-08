import { useMemo } from 'react'
import { getNativeAddress } from 'lx/src/constants/addresses'
import type { TradeableAsset } from 'lx/src/entities/assets'
import { AssetType } from 'lx/src/entities/assets'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import type { UniverseChainId } from 'lx/src/features/chains/types'
import type { SwapFormState } from 'lx/src/features/transactions/swap/stores/swapFormStore/types'
import { CurrencyField } from 'lx/src/types/currency'

const getDefaultInputCurrency = (chainId: UniverseChainId): TradeableAsset => ({
  address: getNativeAddress(chainId),
  chainId,
  type: AssetType.Currency,
})

export const getDefaultState = (defaultChainId: UniverseChainId): Readonly<Omit<SwapFormState, 'account'>> => ({
  exactAmountFiat: undefined,
  exactAmountToken: '',
  exactCurrencyField: CurrencyField.INPUT,
  focusOnCurrencyField: CurrencyField.INPUT,
  filteredChainIds: {},
  input: getDefaultInputCurrency(defaultChainId),
  output: undefined,
  isFiatMode: false,
  isMax: false,
  isSubmitting: false,
  isConfirmed: false,
  showPendingUI: false,
  instantReceiptFetchTime: undefined,
  instantOutputAmountRaw: undefined,
  txHash: undefined,
  txHashReceivedTime: undefined,
})

export const useDefaultSwapFormState = (): ReturnType<typeof getDefaultState> => {
  const { defaultChainId } = useEnabledChains()

  return useMemo(() => getDefaultState(defaultChainId), [defaultChainId])
}
