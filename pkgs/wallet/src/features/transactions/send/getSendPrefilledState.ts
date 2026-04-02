import { getNativeAddress } from '@l.x/lx/src/constants/addresses'
import { AssetType, CurrencyAsset } from '@l.x/lx/src/entities/assets'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { TransactionState } from '@l.x/lx/src/features/transactions/types/transactionState'
import { CurrencyField } from '@l.x/lx/src/types/currency'

export function getSendPrefilledState({
  chainId,
  currencyAddress,
}: {
  chainId: UniverseChainId
  currencyAddress?: Address
}): TransactionState {
  const nativeTokenAddress = getNativeAddress(chainId)

  const nativeToken: CurrencyAsset = {
    address: nativeTokenAddress,
    chainId,
    type: AssetType.Currency,
  }

  const chosenToken: CurrencyAsset | undefined = !currencyAddress
    ? undefined
    : {
        address: currencyAddress,
        chainId,
        type: AssetType.Currency,
      }

  const transactionState: TransactionState = {
    exactCurrencyField: CurrencyField.INPUT,
    exactAmountToken: '',
    // If specified currency address populate the currency, otherwise default to native token on chain
    [CurrencyField.INPUT]: chosenToken ?? nativeToken,
    [CurrencyField.OUTPUT]: null,
    showRecipientSelector: true,
  }

  return transactionState
}
