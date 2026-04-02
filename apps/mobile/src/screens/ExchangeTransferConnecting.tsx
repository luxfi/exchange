import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { Screen } from 'src/components/layout/Screen'
import { useFiatOnRampContext } from 'src/features/fiatOnRamp/FiatOnRampContext'
import { Flex, UniversalImage, useIsDarkMode } from '@luxfi/ui/src'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { ServiceProviderLogoStyles } from '@l.x/lx/src/features/fiatOnRamp/constants'
import { FiatOnRampConnectingView } from '@l.x/lx/src/features/fiatOnRamp/FiatOnRampConnectingView'
import { useFiatOnRampTransactionCreator } from '@l.x/lx/src/features/fiatOnRamp/hooks'
import { useFiatOnRampAggregatorTransferWidgetQuery } from '@l.x/lx/src/features/fiatOnRamp/hooks/useFiatOnRampQueries'
import { type FORServiceProvider } from '@l.x/lx/src/features/fiatOnRamp/types'
import { getOptionalServiceProviderLogo } from '@l.x/lx/src/features/fiatOnRamp/utils'
import { pushNotification } from '@l.x/lx/src/features/notifications/slice/slice'
import { AppNotificationType } from '@l.x/lx/src/features/notifications/slice/types'
import { FiatOnRampEventName } from '@l.x/lx/src/features/telemetry/constants'
import { sendAnalyticsEvent } from '@l.x/lx/src/features/telemetry/send'
import { openUri } from '@l.x/lx/src/utils/linking'
import { ONE_SECOND_MS } from '@luxfi/utilities/src/time/time'
import { useTimeout } from '@luxfi/utilities/src/time/timing'
import { useActiveAccountAddressWithThrow } from '@luxfi/wallet/src/features/wallet/hooks'

// Design decision
const CONNECTING_TIMEOUT = 2 * ONE_SECOND_MS

export function ExchangeTransferConnecting({
  serviceProvider,
  onClose,
}: {
  serviceProvider: FORServiceProvider
  onClose: () => void
}): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const activeAccountAddress = useActiveAccountAddressWithThrow()
  const [timeoutElapsed, setTimeoutElapsed] = useState(false)
  const { isOffRamp } = useFiatOnRampContext()

  const { externalTransactionId, dispatchAddTransaction } = useFiatOnRampTransactionCreator({
    ownerAddress: activeAccountAddress,
    chainId: UniverseChainId.Mainnet,
    serviceProvider: serviceProvider.serviceProvider,
  })

  const onError = useCallback((): void => {
    dispatch(
      pushNotification({
        type: AppNotificationType.Error,
        errorMessage: t('common.error.general'),
      }),
    )
    onClose()
  }, [dispatch, onClose, t])

  useTimeout(() => {
    setTimeoutElapsed(true)
  }, CONNECTING_TIMEOUT)

  const {
    data: widgetData,
    isLoading: widgetLoading,
    error: widgetError,
  } = useFiatOnRampAggregatorTransferWidgetQuery({
    serviceProvider: serviceProvider.serviceProvider,
    walletAddress: activeAccountAddress,
    externalSessionId: externalTransactionId,
    redirectUrl: `${lxUrls.redirectUrlBase}?screen=transaction&fiatOnRamp=true&userAddress=${activeAccountAddress}`,
  })

  useEffect(() => {
    if (widgetError) {
      onError()
      return
    }
    async function navigateToWidget(widgetUrl: string): Promise<void> {
      onClose()
      sendAnalyticsEvent(FiatOnRampEventName.FiatOnRampTransferWidgetOpened, {
        externalTransactionId,
        serviceProvider: serviceProvider.serviceProvider,
      })

      await openUri({ uri: widgetUrl }).catch(onError)
      dispatchAddTransaction({ isOffRamp: false })
    }
    if (timeoutElapsed && !widgetLoading && widgetData) {
      navigateToWidget(widgetData.widgetUrl).catch(() => undefined)
    }
  }, [
    dispatchAddTransaction,
    onClose,
    onError,
    timeoutElapsed,
    widgetData,
    widgetLoading,
    widgetError,
    externalTransactionId,
    serviceProvider,
  ])

  const isDarkMode = useIsDarkMode()
  const logoUrl = getOptionalServiceProviderLogo(serviceProvider.logos, isDarkMode) ?? ''

  return (
    <Screen>
      <FiatOnRampConnectingView
        isOffRamp={isOffRamp}
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
    </Screen>
  )
}
