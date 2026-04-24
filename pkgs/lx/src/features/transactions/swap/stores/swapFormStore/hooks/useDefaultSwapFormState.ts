import { useMemo } from 'react'
import { getNativeAddress } from '@l.x/lx/src/constants/addresses'
import type { TradeableAsset } from '@l.x/lx/src/entities/assets'
import { AssetType } from '@l.x/lx/src/entities/assets'
import { useEnabledChains } from '@l.x/lx/src/features/chains/hooks/useEnabledChains'
import type { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import type { SwapFormState } from '@l.x/lx/src/features/transactions/swap/stores/swapFormStore/types'
import { CurrencyField } from '@l.x/lx/src/types/currency'

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
