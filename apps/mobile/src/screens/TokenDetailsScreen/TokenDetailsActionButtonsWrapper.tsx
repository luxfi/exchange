import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FadeInDown } from 'react-native-reanimated'
import { MODAL_OPEN_WAIT_TIME } from 'src/app/navigation/constants'
import { navigate } from 'src/app/navigation/rootNavigation'
import {
  TokenDetailsBuySellButtons,
  TokenDetailsSwapButtons,
} from 'src/components/TokenDetails/TokenDetailsActionButtons'
import { useTokenDetailsContext } from 'src/components/TokenDetails/TokenDetailsContext'
import {
  useMultichainBuyVariant,
  useTokenDetailsCTAVariant,
} from 'src/components/TokenDetails/useTokenDetailsCTAVariant'
import { useTokenDetailsCurrentChainBalance } from 'src/components/TokenDetails/useTokenDetailsCurrentChainBalance'
import { NetworkBalanceSheetContent } from 'src/screens/TokenDetailsScreen/NetworkBalanceSheetContent'
import { useNetworkBalanceSheet } from 'src/screens/TokenDetailsScreen/useNetworkBalanceSheet'
import { useIsScreenNavigationReady } from 'src/utils/useIsScreenNavigationReady'
import { ArrowDownCircle, ArrowUpCircle, Bank, QrCode, SendRoundedAirplane } from '@luxfi/ui/src/components/icons'
import { AnimatedFlex } from '@luxfi/ui/src/components/layout/AnimatedFlex'
import type { MenuOptionItem } from 'lx/src/components/menus/ContextMenu'
import { Modal } from 'lx/src/components/modals/Modal'
import { getNativeAddress } from 'lx/src/constants/addresses'
import { useTokenBasicInfoPartsFragment } from 'lx/src/data/graphql/lx-data-api/fragments'
import { useBridgingTokenWithHighestBalance } from 'lx/src/features/bridging/hooks/tokens'
import { getChainInfo } from 'lx/src/features/chains/chainInfo'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { type PortfolioBalance, TokenList } from 'lx/src/features/dataApi/types'
import { useIsSupportedFiatOnRampCurrency } from 'lx/src/features/fiatOnRamp/hooks'
import { useChainGasToken } from 'lx/src/features/gas/hooks/useChainGasToken'
import { ModalName } from 'lx/src/features/telemetry/constants'
import { useAppInsets } from 'lx/src/hooks/useAppInsets'
import { CurrencyField } from 'lx/src/types/currency'
import { buildCurrencyId, isNativeCurrencyAddress } from 'lx/src/utils/currencyId'
import { useEvent } from '@luxfi/utilities/src/react/hooks'
import { useWalletNavigation } from '@luxfi/wallet/src/contexts/WalletNavigationContext'
import { useActiveAccountAddressWithThrow } from '@luxfi/wallet/src/features/wallet/hooks'

function getHighestBalanceEntry(balances: PortfolioBalance[]): PortfolioBalance {
  return balances.reduce((best, current) => ((current.balanceUSD ?? 0) > (best.balanceUSD ?? 0) ? current : best))
}

export const TokenDetailsActionButtonsWrapper = memo(function _TokenDetailsActionButtonsWrapper(): JSX.Element | null {
  const { t } = useTranslation()
  const insets = useAppInsets()
  const activeAddress = useActiveAccountAddressWithThrow()
  const { isTestnetModeEnabled } = useEnabledChains()
  const isMultichainTokenUx = useFeatureFlag(FeatureFlags.MultichainTokenUx)

  const { currencyId, chainId, address, currencyInfo, openTokenWarningModal, tokenColorLoading, navigation } =
    useTokenDetailsContext()

  const { navigateToFiatOnRamp, navigateToSwapFlow, navigateToSend, navigateToReceive } = useWalletNavigation()

  const token = useTokenBasicInfoPartsFragment({ currencyId }).data

  const isBlocked = currencyInfo?.safetyInfo?.tokenList === TokenList.Blocked

  const isNativeCurrency = isNativeCurrencyAddress(chainId, address)
  const nativeCurrencyAddress = getChainInfo(chainId).nativeCurrency.address

  const { gasBalance, isLoading: isGasBalanceLoading } = useChainGasToken({ chainId, accountAddress: activeAddress })
  const hasZeroGasBalance = gasBalance && gasBalance.equalTo('0')

  const { currency: nativeFiatOnRampCurrency, isLoading: isNativeFiatOnRampCurrencyLoading } =
    useIsSupportedFiatOnRampCurrency(buildCurrencyId(chainId, nativeCurrencyAddress))

  const currentChainBalance = useTokenDetailsCurrentChainBalance()

  const { currency: fiatOnRampCurrency, isLoading: isFiatOnRampCurrencyLoading } =
    useIsSupportedFiatOnRampCurrency(currencyId)

  const { data: bridgingTokenWithHighestBalance, isLoading: isBridgingTokenLoading } =
    useBridgingTokenWithHighestBalance({
      evmAddress: activeAddress,
      currencyAddress: address,
      currencyChainId: chainId,
    })

  const {
    allChainBalances,
    hasMultiChainBalances,
    isNetworkSheetOpen,
    openSellSheet,
    openSendSheet,
    onCloseNetworkSheet,
    onSelectNetwork,
  } = useNetworkBalanceSheet({ currencyId, chainId })

  const hasTokenBalance = isMultichainTokenUx ? allChainBalances.length > 0 : Boolean(currentChainBalance)

  // For multichain UX: resolve the chain with the highest balance (computed once, used by multiple handlers)
  const highestBalanceEntry = useMemo(() => {
    if (!isMultichainTokenUx || !allChainBalances.length) {
      return null
    }
    return getHighestBalanceEntry(allChainBalances)
  }, [isMultichainTokenUx, allChainBalances])

  const highestBalanceCurrencyId = highestBalanceEntry?.currencyInfo.currencyId ?? currencyId

  const { currency: highestBalanceFiatCurrency } = useIsSupportedFiatOnRampCurrency(highestBalanceCurrencyId)

  const onPressSwap = useEvent((currencyField: CurrencyField) => {
    if (isBlocked) {
      openTokenWarningModal()
    } else {
      navigateToSwapFlow({ currencyField, currencyAddress: address, currencyChainId: chainId })
    }
  })

  const onPressBuyFiatOnRamp = useEvent((isOfframp: boolean = false): void => {
    navigateToFiatOnRamp({ prefilledCurrency: fiatOnRampCurrency, isOfframp })
  })

  const onPressGet = useEvent(() => {
    navigate(ModalName.BuyNativeToken, {
      chainId,
      currencyId,
    })
  })

  const onPressSend = useEvent(() => {
    if (isMultichainTokenUx && hasMultiChainBalances) {
      openSendSheet()
    } else {
      navigateToSend({ currencyAddress: address, chainId })
    }
  })

  const onPressWithdraw = useEvent(() => {
    setTimeout(() => {
      navigate(ModalName.Wormhole, {
        currencyInfo,
      })
    }, MODAL_OPEN_WAIT_TIME)
  })

  const onPressBuy = useEvent(() => {
    if (isBlocked) {
      openTokenWarningModal()
      return
    }
    if (isMultichainTokenUx && highestBalanceEntry) {
      const { currency } = highestBalanceEntry.currencyInfo
      const currencyAddress = currency.isToken ? currency.address : getNativeAddress(currency.chainId)
      navigateToSwapFlow({ currencyField: CurrencyField.OUTPUT, currencyAddress, currencyChainId: currency.chainId })
    } else {
      navigateToSwapFlow({ currencyField: CurrencyField.OUTPUT, currencyAddress: address, currencyChainId: chainId })
    }
  })

  const onPressSell = useEvent(() => {
    if (isMultichainTokenUx && hasMultiChainBalances) {
      openSellSheet()
    } else {
      onPressSwap(CurrencyField.INPUT)
    }
  })

  const onPressBuyWithCash = useEvent(() => {
    navigateToFiatOnRamp({ prefilledCurrency: highestBalanceFiatCurrency ?? fiatOnRampCurrency })
  })

  const onPressSellForCash = useEvent(() => {
    navigateToFiatOnRamp({ prefilledCurrency: highestBalanceFiatCurrency ?? fiatOnRampCurrency, isOfframp: true })
  })

  const bridgedWithdrawalInfo = currencyInfo?.bridgedWithdrawalInfo

  const isScreenNavigationReady = useIsScreenNavigationReady({ navigation })

  const getCTAVariant = useTokenDetailsCTAVariant({
    hasTokenBalance,
    isNativeCurrency,
    nativeFiatOnRampCurrency,
    fiatOnRampCurrency,
    bridgingTokenWithHighestBalance,
    hasZeroGasBalance,
    tokenSymbol: token.symbol,
    onPressBuyFiatOnRamp,
    onPressGet,
    onPressSwap,
  })

  const actionMenuOptions: MenuOptionItem[] = useMemo(() => {
    const actions: MenuOptionItem[] = []

    if (fiatOnRampCurrency) {
      actions.push({
        label: t('common.button.buy'),
        Icon: Bank,
        onPress: onPressBuyFiatOnRamp,
      })
    }

    if (bridgedWithdrawalInfo && hasTokenBalance) {
      actions.push({
        label: t('common.withdraw'),
        Icon: ArrowUpCircle,
        onPress: onPressWithdraw,
        subheader: t('bridgedAsset.wormhole.toNativeChain', { nativeChainName: bridgedWithdrawalInfo.chain }),
        actionType: 'external-link',
        height: 56,
      })
    }

    if (hasTokenBalance && fiatOnRampCurrency) {
      actions.push({
        label: t('common.button.sell'),
        Icon: ArrowUpCircle,
        onPress: () => onPressBuyFiatOnRamp(true),
      })
    }

    if (hasTokenBalance) {
      actions.push({ label: t('common.button.send'), Icon: SendRoundedAirplane, onPress: onPressSend })
    }

    // All cases have a receive action
    actions.push({ label: t('common.button.receive'), Icon: ArrowDownCircle, onPress: navigateToReceive })

    return actions
  }, [
    fiatOnRampCurrency,
    t,
    bridgedWithdrawalInfo,
    hasTokenBalance,
    onPressWithdraw,
    onPressSend,
    navigateToReceive,
    onPressBuyFiatOnRamp,
  ])

  const multichainActionMenuOptions: MenuOptionItem[] = useMemo(() => {
    const actions: MenuOptionItem[] = []

    if (hasTokenBalance) {
      actions.push({ label: t('common.button.send'), Icon: SendRoundedAirplane, onPress: onPressSend })
    }

    actions.push({ label: t('common.button.receive'), Icon: QrCode, onPress: navigateToReceive })

    if (highestBalanceFiatCurrency || fiatOnRampCurrency) {
      actions.push({ label: t('fiatOnRamp.action.buyWithCash'), Icon: Bank, onPress: onPressBuyWithCash })
    }

    if (hasTokenBalance && (highestBalanceFiatCurrency || fiatOnRampCurrency)) {
      actions.push({ label: t('fiatOnRamp.action.sellForCash'), Icon: ArrowUpCircle, onPress: onPressSellForCash })
    }

    if (bridgedWithdrawalInfo && hasTokenBalance) {
      actions.push({
        label: t('common.withdraw'),
        Icon: ArrowUpCircle,
        onPress: onPressWithdraw,
        subheader: t('bridgedAsset.wormhole.toNativeChain', { nativeChainName: bridgedWithdrawalInfo.chain }),
        actionType: 'external-link',
        height: 56,
      })
    }

    return actions
  }, [
    t,
    hasTokenBalance,
    bridgedWithdrawalInfo,
    highestBalanceFiatCurrency,
    fiatOnRampCurrency,
    onPressSend,
    navigateToReceive,
    onPressBuyWithCash,
    onPressSellForCash,
    onPressWithdraw,
  ])

  const hideActionButtons =
    !isScreenNavigationReady ||
    tokenColorLoading ||
    isGasBalanceLoading ||
    isNativeFiatOnRampCurrencyLoading ||
    isFiatOnRampCurrencyLoading ||
    isBridgingTokenLoading

  const onPressDisabled = isTestnetModeEnabled
    ? (): void =>
        navigate(ModalName.TestnetMode, {
          unsupported: true,
          descriptionCopy: t('tdp.noTestnetSupportDescription'),
        })
    : openTokenWarningModal

  const multichainBuyVariant = useMultichainBuyVariant({
    hasTokenBalance,
    isNativeCurrency,
    nativeFiatOnRampCurrency,
    fiatOnRampCurrency,
    bridgingTokenWithHighestBalance,
    hasZeroGasBalance,
    tokenSymbol: token.symbol,
    onPressBuyWithCash,
    onPressGet,
    onPressBuy,
  })

  return hideActionButtons ? null : (
    <AnimatedFlex mb={insets.bottom} backgroundColor="$surface1" entering={FadeInDown}>
      {isMultichainTokenUx ? (
        <TokenDetailsBuySellButtons
          actionMenuOptions={multichainActionMenuOptions}
          buyButtonIcon={multichainBuyVariant.icon}
          buyButtonTitle={multichainBuyVariant.title}
          userHasBalance={hasTokenBalance}
          onPressBuy={multichainBuyVariant.onPress}
          onPressDisabled={onPressDisabled}
          onPressSell={onPressSell}
        />
      ) : (
        <TokenDetailsSwapButtons
          actionMenuOptions={actionMenuOptions}
          ctaButton={getCTAVariant}
          userHasBalance={hasTokenBalance}
          onPressDisabled={onPressDisabled}
        />
      )}

      {isMultichainTokenUx && isNetworkSheetOpen && (
        <Modal
          overrideInnerContainer
          enableDynamicSizing
          name={ModalName.NetworkBalanceSelector}
          onClose={onCloseNetworkSheet}
        >
          <NetworkBalanceSheetContent allChainBalances={allChainBalances} onSelectBalance={onSelectNetwork} />
        </Modal>
      )}
    </AnimatedFlex>
  )
})
