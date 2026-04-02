import { ChartPeriod } from '@luxamm/client-data-api/dist/data/v1/api_pb'
import { isWarmLoadingStatus } from '@luxexchange/api'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, RefreshButton, Shine, Text, useIsDarkMode } from 'ui/src'
import AnimatedNumber, {
  BALANCE_CHANGE_INDICATION_DURATION,
} from '@luxexchange/lx/src/components/AnimatedNumber/AnimatedNumber'
import { RelativeChange } from '@luxexchange/lx/src/components/RelativeChange/RelativeChange'
import { PollingInterval } from '@luxexchange/lx/src/constants/misc'
import { UniverseChainId } from '@luxexchange/lx/src/features/chains/types'
import { usePortfolioTotalValue } from '@luxexchange/lx/src/features/dataApi/balances/balancesRest'
import { FiatCurrency } from '@luxexchange/lx/src/features/fiatCurrency/constants'
import { useAppFiatCurrency, useAppFiatCurrencyInfo } from '@luxexchange/lx/src/features/fiatCurrency/hooks'
import { useLocalizationContext } from '@luxexchange/lx/src/features/language/LocalizationContext'
import i18next from '@luxexchange/lx/src/i18n'
import { NumberType } from 'utilities/src/format/types'
import { isWebPlatform } from 'utilities/src/platform'

function periodToTimeLabel(t: ReturnType<typeof useTranslation>['t'], period: ChartPeriod): string {
  switch (period) {
    case ChartPeriod.HOUR:
      return t('common.thisHour')
    case ChartPeriod.DAY:
      return t('common.today')
    case ChartPeriod.WEEK:
      return t('common.thisWeek')
    case ChartPeriod.MONTH:
      return t('common.thisMonth')
    case ChartPeriod.YEAR:
      return t('common.thisYear')
    case ChartPeriod.MAX:
      return t('common.allTime')
    default:
      return t('common.today')
  }
}

interface PortfolioBalanceProps {
  evmOwner?: Address
  svmOwner?: Address
  endText?: JSX.Element | string
  chainIds?: UniverseChainId[]
  chartPeriod?: ChartPeriod
  /** When set, overrides the displayed balance (e.g. during chart scrubbing) */
  overrideBalanceUSD?: number
}

export const PortfolioBalance = memo(function _PortfolioBalance({
  evmOwner,
  svmOwner,
  endText,
  chainIds,
  chartPeriod,
  overrideBalanceUSD,
}: PortfolioBalanceProps): JSX.Element {
  const { t } = useTranslation()
  const { data, loading, networkStatus, refetch } = usePortfolioTotalValue({
    evmAddress: evmOwner,
    svmAddress: svmOwner,
    chainIds,
    // TransactionHistoryUpdater will refetch this query on new transaction.
    // No need to be super aggressive with polling here.
    pollInterval: PollingInterval.Normal,
  })

  // Ensure component switches theme
  useIsDarkMode()

  const currency = useAppFiatCurrency()
  const currencyComponents = useAppFiatCurrencyInfo()
  const { convertFiatAmount, convertFiatAmountFormatted } = useLocalizationContext()

  const isLoading = loading && !data
  const isWarmLoading = !!data && isWarmLoadingStatus(networkStatus)

  const { percentChange, absoluteChangeUSD, balanceUSD } = data || {}

  const isRightToLeft = i18next.dir() === 'rtl'

  const displayBalanceUSD = overrideBalanceUSD ?? balanceUSD
  const totalBalance = convertFiatAmountFormatted(displayBalanceUSD, NumberType.PortfolioBalance)
  const absoluteChange = absoluteChangeUSD && convertFiatAmount(absoluteChangeUSD).amount
  // TODO gary re-enabling this for USD/Euros only, replace with more scalable approach
  const shouldFadePortfolioDecimals =
    (currency === FiatCurrency.UnitedStatesDollar || currency === FiatCurrency.Euro) && currencyComponents.symbolAtFront

  const RefreshBalanceButton = useMemo(() => {
    if (isWebPlatform) {
      return <RefreshButton isLoading={loading} onPress={refetch} />
    }
    return undefined
  }, [loading, refetch])

  return (
    <Flex gap="$spacing4">
      <AnimatedNumber
        balance={displayBalanceUSD}
        colorIndicationDuration={overrideBalanceUSD !== undefined ? 0 : BALANCE_CHANGE_INDICATION_DURATION}
        disableAnimations={overrideBalanceUSD !== undefined}
        loading={isLoading}
        loadingPlaceholderText="000000.00"
        shouldFadeDecimals={shouldFadePortfolioDecimals}
        value={totalBalance}
        warmLoading={isWarmLoading}
        isRightToLeft={isRightToLeft}
        EndElement={RefreshBalanceButton}
      />
      <Flex row grow alignItems="center">
        <Shine disabled={!isWarmLoading}>
          <RelativeChange
            absoluteChange={absoluteChange}
            arrowSize="$icon.16"
            change={percentChange}
            loading={isLoading}
            negativeChangeColor={isWarmLoading ? '$neutral2' : '$statusCritical'}
            positiveChangeColor={isWarmLoading ? '$neutral2' : '$statusSuccess'}
            variant="body3"
          />
        </Shine>
        {chartPeriod !== undefined && (
          <Text variant="body3" color="$neutral3" ml="$spacing4">
            {periodToTimeLabel(t, chartPeriod).toLocaleLowerCase()}
          </Text>
        )}
        {endText}
      </Flex>
    </Flex>
  )
})
