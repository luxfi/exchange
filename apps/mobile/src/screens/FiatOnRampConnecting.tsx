import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { skipToken } from '@tanstack/react-query'
import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { type FiatOnRampStackParamList } from 'src/app/navigation/types'
import { Screen } from 'src/components/layout/Screen'
import { useFiatOnRampContext } from 'src/features/fiatOnRamp/FiatOnRampContext'
import { closeModal } from 'src/features/modals/modalSlice'
import { Flex, Text, UniversalImage, useIsDarkMode } from '@luxfi/ui/src'
import { spacing } from '@luxfi/ui/src/theme'
import { lxUrls } from '@luxexchange/lx/src/constants/urls'
import { UniverseChainId } from '@luxexchange/lx/src/features/chains/types'
import { useLocalFiatToUSDConverter } from '@luxexchange/lx/src/features/fiatCurrency/hooks'
import { ServiceProviderLogoStyles } from '@luxexchange/lx/src/features/fiatOnRamp/constants'
import { FiatOnRampConnectingView } from '@luxexchange/lx/src/features/fiatOnRamp/FiatOnRampConnectingView'
import { useFiatOnRampTransactionCreator } from '@luxexchange/lx/src/features/fiatOnRamp/hooks'
import {
  useFiatOnRampAggregatorOffRampWidgetQuery,
  useFiatOnRampAggregatorWidgetQuery,
} from '@luxexchange/lx/src/features/fiatOnRamp/hooks/useFiatOnRampQueries'
import { getOptionalServiceProviderLogo } from '@luxexchange/lx/src/features/fiatOnRamp/utils'
import { useLocalizationContext } from '@luxexchange/lx/src/features/language/LocalizationContext'
import { pushNotification } from '@luxexchange/lx/src/features/notifications/slice/slice'
import { AppNotificationType } from '@luxexchange/lx/src/features/notifications/slice/types'
import { FiatOffRampEventName, FiatOnRampEventName, ModalName } from '@luxexchange/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@luxexchange/lx/src/features/telemetry/send'
import { forceFetchFiatOnRampTransactions } from '@luxexchange/lx/src/features/transactions/slice'
import { type FiatOnRampScreens } from '@luxexchange/lx/src/types/screens/mobile'
import { openUri } from '@luxexchange/lx/src/utils/linking'
import { ONE_SECOND_MS } from '@luxfi/utilities/src/time/time'
import { useTimeout } from '@luxfi/utilities/src/time/timing'
import { useActiveAccountAddressWithThrow } from '@luxfi/wallet/src/features/wallet/hooks'

// Design decision
const CONNECTING_TIMEOUT = 2 * ONE_SECOND_MS

type Props = NativeStackScreenProps<FiatOnRampStackParamList, FiatOnRampScreens.Connecting>

export function FiatOnRampConnectingScreen({ navigation }: Props): JSX.Element | null {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { addFiatSymbolToNumber } = useLocalizationContext()
  const [timeoutElapsed, setTimeoutElapsed] = useState(false)
  const activeAccountAddress = useActiveAccountAddressWithThrow()
  const fiatToUSDConverter = useLocalFiatToUSDConverter()

  const {
    isOffRamp,
    selectedQuote,
    quotesSections,
    countryCode,
    countryState,
    baseCurrencyInfo,
    quoteCurrency,
    fiatAmount,
    tokenAmount,
    externalTransactionIdSuffix,
  } = useFiatOnRampContext()
  const serviceProvider = selectedQuote?.serviceProviderDetails

  const { externalTransactionId, dispatchAddTransaction } = useFiatOnRampTransactionCreator({
    ownerAddress: activeAccountAddress,
    chainId: quoteCurrency.currencyInfo?.currency.chainId ?? UniverseChainId.Mainnet,
    serviceProvider: serviceProvider?.serviceProvider,
    idSuffix: externalTransactionIdSuffix,
  })

  const onError = useCallback((): void => {
    dispatch(
      pushNotification({
        type: AppNotificationType.Error,
        errorMessage: t('common.error.general'),
      }),
    )
    navigation.goBack()
  }, [dispatch, navigation, t])

  const {
    data: widgetData,
    isLoading: widgetLoading,
    error: widgetError,
  } = useFiatOnRampAggregatorWidgetQuery(
    !isOffRamp && serviceProvider && quoteCurrency.meldCurrencyCode && baseCurrencyInfo && fiatAmount
      ? {
          serviceProvider: serviceProvider.serviceProvider,
          countryCode,
          destinationCurrencyCode: quoteCurrency.meldCurrencyCode,
          sourceAmount: fiatAmount,
          sourceCurrencyCode: baseCurrencyInfo.code,
          walletAddress: activeAccountAddress,
          externalSessionId: externalTransactionId,
          redirectUrl: `${lxUrls.redirectUrlBase}?screen=transaction&fiatOnRamp=true&userAddress=${activeAccountAddress}`,
        }
      : skipToken,
  )

  const {
    data: offRampWidgetData,
    isLoading: offRampWidgetLoading,
    error: offRampWidgetError,
  } = useFiatOnRampAggregatorOffRampWidgetQuery(
    isOffRamp && serviceProvider && quoteCurrency.meldCurrencyCode && baseCurrencyInfo && tokenAmount
      ? {
          serviceProvider: serviceProvider.serviceProvider,
          countryCode,
          baseCurrencyCode: quoteCurrency.meldCurrencyCode,
          sourceAmount: tokenAmount,
          quoteCurrencyCode: baseCurrencyInfo.code,
          refundWalletAddress: activeAccountAddress,
          externalCustomerId: activeAccountAddress,
          externalSessionId: externalTransactionId,
          redirectUrl: `${lxUrls.redirectUrlBase}?screen=transaction&fiatOffRamp=true&userAddress=${activeAccountAddress}&externalTransactionId=${externalTransactionId}`,
        }
      : skipToken,
  )
  useTimeout(() => {
    setTimeoutElapsed(true)
  }, CONNECTING_TIMEOUT)

  useEffect(() => {
    if (!baseCurrencyInfo || !serviceProvider || widgetError || offRampWidgetError) {
      onError()
      return
    }
    async function navigateToWidget(widgetUrl: string): Promise<void> {
      if (serviceProvider && quoteCurrency.meldCurrencyCode && baseCurrencyInfo && quotesSections?.[0]?.data[0]) {
        sendAnalyticsEvent(
          isOffRamp ? FiatOffRampEventName.FiatOffRampWidgetOpened : FiatOnRampEventName.FiatOnRampWidgetOpened,
          {
            externalTransactionId,
            serviceProvider: serviceProvider.serviceProvider,
            preselectedServiceProvider: quotesSections[0]?.data?.[0]?.serviceProviderDetails?.serviceProvider,
            countryCode,
            countryState,
            fiatCurrency: baseCurrencyInfo.code.toLowerCase(),
            cryptoCurrency: quoteCurrency.meldCurrencyCode.toLowerCase(),
            chainId: quoteCurrency.currencyInfo?.currency.chainId,
            currencyAmount: tokenAmount,
            amountUSD: fiatToUSDConverter(fiatAmount ?? 0),
          },
        )
      }
      dispatchAddTransaction({ isOffRamp })
      dispatch(forceFetchFiatOnRampTransactions())
      await openUri({ uri: widgetUrl, throwOnError: true })
        .then(() => {
          // Close the modal only after closing uri link
          dispatch(closeModal({ name: ModalName.FiatOnRampAggregator }))
        })
        .catch(onError)
    }

    if (!isOffRamp && timeoutElapsed && !widgetLoading && widgetData) {
      navigateToWidget(widgetData.widgetUrl).catch(() => undefined)
    }

    if (isOffRamp && timeoutElapsed && !offRampWidgetLoading && offRampWidgetData) {
      navigateToWidget(offRampWidgetData.widgetUrl).catch(() => undefined)
    }
  }, [
    timeoutElapsed,
    widgetData,
    offRampWidgetData,
    widgetLoading,
    offRampWidgetLoading,
    widgetError,
    offRampWidgetError,
    onError,
    dispatchAddTransaction,
    baseCurrencyInfo,
    serviceProvider,
    dispatch,
    externalTransactionId,
    quoteCurrency.meldCurrencyCode,
    quotesSections,
    countryCode,
    countryState,
    isOffRamp,
    fiatAmount,
    fiatToUSDConverter,
    tokenAmount,
    quoteCurrency,
  ])

  const isDarkMode = useIsDarkMode()
  const logoUrl = getOptionalServiceProviderLogo(serviceProvider?.logos, isDarkMode)

  return (
    <Screen edges={['top', 'bottom']}>
      {baseCurrencyInfo && serviceProvider && (
        <Flex fill justifyContent="space-between" alignItems="center">
          <FiatOnRampConnectingView
            amount={addFiatSymbolToNumber({
              value: fiatAmount,
              currencyCode: baseCurrencyInfo.code,
              currencySymbol: baseCurrencyInfo.symbol,
            })}
            isOffRamp={isOffRamp}
            quoteCurrencyCode={quoteCurrency.currencyInfo?.currency.symbol}
            serviceProviderLogo={
              <Flex
                alignItems="center"
                height={ServiceProviderLogoStyles.icon.height}
                justifyContent="center"
                width={ServiceProviderLogoStyles.icon.width}
              >
                <UniversalImage
                  uri={logoUrl}
                  size={{
                    height: ServiceProviderLogoStyles.icon.height,
                    width: ServiceProviderLogoStyles.icon.width,
                  }}
                  style={{ image: { borderRadius: ServiceProviderLogoStyles.icon.borderRadius } }}
                />
              </Flex>
            }
            serviceProviderName={serviceProvider.name}
          />
          <Text bottom={spacing.spacing8} color="$neutral3" px="$spacing24" textAlign="center" variant="body3">
            {t('fiatOnRamp.connection.terms', { serviceProvider: serviceProvider.name })}
          </Text>
        </Flex>
      )}
    </Screen>
  )
}
