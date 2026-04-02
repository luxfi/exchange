import { useMemo } from 'react'
import { AssetType } from 'lx/src/entities/assets'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { useNFT } from 'lx/src/features/nfts/hooks/useNFT'
import { useOnChainCurrencyBalance, useOnChainNativeCurrencyBalance } from 'lx/src/features/portfolio/api'
import { getCurrencyAmount, ValueType } from 'lx/src/features/tokens/getCurrencyAmount'
import { useCurrencyInfo } from 'lx/src/features/tokens/useCurrencyInfo'
import { DerivedSendInfo } from 'lx/src/features/transactions/send/types'
import { TransactionState } from 'lx/src/features/transactions/types/transactionState'
import { CurrencyField } from 'lx/src/types/currency'
import { buildCurrencyId } from 'lx/src/utils/currencyId'
import { useActiveAccount } from '@luxfi/wallet/src/features/wallet/hooks'

export function useDerivedSendInfo(state: TransactionState): DerivedSendInfo {
  const {
    [CurrencyField.INPUT]: tradeableAsset,
    exactAmountToken,
    exactAmountFiat,
    recipient,
    isFiatInput,
    txId,
  } = state

  const activeAccount = useActiveAccount()
  const { defaultChainId } = useEnabledChains()
  const chainId = tradeableAsset?.chainId ?? defaultChainId

  const currencyInInfo = useCurrencyInfo(
    tradeableAsset?.type === AssetType.Currency
      ? buildCurrencyId(tradeableAsset.chainId, tradeableAsset.address)
      : undefined,
    { refetch: true },
  )

  const currencyIn = currencyInInfo?.currency
  const { data: nftIn } = useNFT({
    owner: activeAccount?.address,
    address: tradeableAsset?.address,
    tokenId:
      tradeableAsset?.type === AssetType.ERC1155 || tradeableAsset?.type === AssetType.ERC721
        ? tradeableAsset.tokenId
        : undefined,
  })

  const currencies = useMemo(
    () => ({
      [CurrencyField.INPUT]: currencyInInfo ?? nftIn,
    }),
    [currencyInInfo, nftIn],
  )

  const { balance: tokenInBalance } = useOnChainCurrencyBalance(
    currencyIn?.isToken ? currencyIn : undefined,
    activeAccount?.address,
  )

  const { balance: nativeInBalance } = useOnChainNativeCurrencyBalance(chainId, activeAccount?.address)

  const amountSpecified = useMemo(
    () =>
      getCurrencyAmount({
        value: exactAmountToken,
        valueType: ValueType.Exact,
        currency: currencyIn,
      }),
    [currencyIn, exactAmountToken],
  )
  const currencyAmounts = useMemo(
    () => ({
      [CurrencyField.INPUT]: amountSpecified,
    }),
    [amountSpecified],
  )

  const currencyBalances = useMemo(
    () => ({
      [CurrencyField.INPUT]: currencyIn?.isNative ? nativeInBalance : tokenInBalance,
    }),
    [currencyIn, nativeInBalance, tokenInBalance],
  )
  return useMemo(
    () => ({
      chainId,
      currencies,
      currencyAmounts,
      currencyBalances,
      currencyTypes: { [CurrencyField.INPUT]: tradeableAsset?.type },
      currencyInInfo,
      exactAmountToken,
      exactAmountFiat: exactAmountFiat ?? '',
      exactCurrencyField: CurrencyField.INPUT,
      isFiatInput,
      nftIn: nftIn ?? undefined,
      recipient,
      txId,
    }),
    [
      chainId,
      currencies,
      currencyAmounts,
      currencyBalances,
      currencyInInfo,
      exactAmountToken,
      exactAmountFiat,
      isFiatInput,
      nftIn,
      recipient,
      tradeableAsset?.type,
      txId,
    ],
  )
}
