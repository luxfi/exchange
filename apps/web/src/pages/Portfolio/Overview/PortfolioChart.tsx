import { ChartPeriod, GetPortfolioChartResponse } from '@uniswap/client-data-api/dist/data/v1/api_pb'
import { GraphQLApi } from '@universe/api'
import { UTCTimestamp } from 'lightweight-charts'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Flex,
  SegmentedControl,
  SegmentedControlOption,
  Separator,
  styled,
  Text,
  useMedia,
  useSporeColors,
} from 'ui/src'
import { useAppFiatCurrencyInfo } from 'uniswap/src/features/fiatCurrency/hooks'
import { useCurrentLocale } from 'uniswap/src/features/language/hooks'
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
import {
  CHART_PERIOD_OPTIONS,
  chartPeriodToElementName,
  chartPeriodToLabel,
  chartPeriodToTestIdSuffix,
  chartPeriodToTimeLabel,
} from 'uniswap/src/features/portfolio/chartPeriod'
import { getPortfolioChartPercentChange } from 'uniswap/src/features/portfolio/portfolioChartPercentChange'
import { Trace } from 'uniswap/src/features/telemetry/Trace'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
import { NumberType } from 'utilities/src/format/types'
import { ChartSkeleton } from '~/components/Charts/LoadingState'
import { PriceChart, PriceChartData } from '~/components/Charts/PriceChart'
import { ChartType, PriceChartType } from '~/components/Charts/utils'
import { useShowDemoView } from '~/pages/Portfolio/hooks/useShowDemoView'

const ChartContainer = styled(Flex, {
  width: '100%',
})

const CHART_HEIGHT = 300
const UNFUNDED_CHART_SKELETON_HEIGHT = 275

// Map ChartPeriod to GraphQLApi.HistoryDuration for PriceChart display
function chartPeriodToHistoryDuration(period: ChartPeriod): GraphQLApi.HistoryDuration {
  switch (period) {
    case ChartPeriod.HOUR:
      return GraphQLApi.HistoryDuration.Hour
    case ChartPeriod.DAY:
      return GraphQLApi.HistoryDuration.Day
    case ChartPeriod.WEEK:
      return GraphQLApi.HistoryDuration.Week
    case ChartPeriod.MONTH:
      return GraphQLApi.HistoryDuration.Month
    case ChartPeriod.YEAR:
      return GraphQLApi.HistoryDuration.Year
    case ChartPeriod.MAX:
      return GraphQLApi.HistoryDuration.Max
    default:
      return GraphQLApi.HistoryDuration.Day
  }
}

function convertPortfolioChartDataToPriceChartData(
  points: Array<{ timestamp: bigint; value: number }>,
): PriceChartData[] {
  return points.map((point) => {
    // UTCTimestamp expects seconds, and the API returns timestamps as bigint in seconds
    const time = Number(point.timestamp) as UTCTimestamp
    const value = point.value

    // For portfolio balance charts, we use line charts, so all OHLC values are the same
    return {
      time,
      value,
      open: value,
      high: value,
      low: value,
      close: value,
    }
  })
}

>>>>>>> upstream/main
interface PortfolioChartProps {
  isPortfolioZero: boolean
  chartData?: GetPortfolioChartResponse
  isPending: boolean
  error?: Error | null
  selectedPeriod: ChartPeriod
  setSelectedPeriod: (period: ChartPeriod) => void
  portfolioTotalBalanceUSD?: number
  isTotalValueMatch: boolean
}

export function PortfolioChart({
  isPortfolioZero,
  chartData: portfolioChartData,
  isPending,
  error,
  portfolioTotalBalanceUSD,
  selectedPeriod,
  setSelectedPeriod,
  isTotalValueMatch,
}: PortfolioChartProps): JSX.Element {
  const { t } = useTranslation()
  const media = useMedia()
  const colors = useSporeColors()
  const isDemoView = useShowDemoView()
  const { convertFiatAmountFormatted } = useLocalizationContext()
  const locale = useCurrentLocale()
  const appFiatCurrencyInfo = useAppFiatCurrencyInfo()
  const isChartEmpty = useMemo(() => {
    if (!portfolioChartData?.points || portfolioChartData.points.length === 0) {
      return true
    }

    // if the last point is 0, check all other points to determine if there has ever been value here
    if (portfolioChartData.points[portfolioChartData.points.length - 1].value === 0) {
      return portfolioChartData.points.every((point) => point.value === 0)
    }

    return false
  }, [portfolioChartData?.points])

  const periodOptions = useMemo<Array<SegmentedControlOption<string>>>(() => {
<<<<<<< HEAD
    const options: Array<[ChartPeriod, string]> = [
      [ChartPeriod.HOUR, t('token.priceExplorer.timeRangeLabel.hour')],
      [ChartPeriod.DAY, t('token.priceExplorer.timeRangeLabel.day')],
      [ChartPeriod.WEEK, t('token.priceExplorer.timeRangeLabel.week')],
      [ChartPeriod.MONTH, t('token.priceExplorer.timeRangeLabel.month')],
      [ChartPeriod.YEAR, t('token.priceExplorer.timeRangeLabel.year')],
      [ChartPeriod.MAX, t('common.all')],
    ]

    return options.map(([period, label]) => ({
      value: String(period),
      display: (
        <Flex data-testid={`${TestID.PortfolioChartPeriodPrefix}${periodLabelToTestIdSuffix[period]}`}>
          <Text variant="buttonLabel4" color={period === selectedPeriod ? undefined : '$neutral2'}>
            {label}
=======
    return CHART_PERIOD_OPTIONS.map((period) => ({
      value: String(period),
      wrapper: <Trace key={`${period}-trace`} logPress element={chartPeriodToElementName(period)} />,
      display: (
        <Flex data-testid={`${TestID.PortfolioChartPeriodPrefix}${chartPeriodToTestIdSuffix(period)}`}>
          <Text variant="buttonLabel4" color={period === selectedPeriod ? undefined : '$neutral2'}>
            {chartPeriodToLabel(t, period)}
          </Text>
        </Flex>
      ),
    }))
  }, [selectedPeriod, t])

  const chartData = useMemo(() => {
    if (!portfolioChartData?.points) {
      return []
    }
    return convertPortfolioChartDataToPriceChartData(portfolioChartData.points)
  }, [portfolioChartData])

  // Determine color based on portfolio balance change
  const chartColor = useMemo(() => {
    if (chartData.length < 2) {
      return colors.accent1.val
    }
    const firstValue = chartData[0].value
    const lastValue = chartData[chartData.length - 1].value
    if (lastValue > firstValue) {
      return colors.statusSuccess.val
    }
    if (lastValue < firstValue) {
      return colors.statusCritical.val
    }
    return colors.statusSuccess.val
  }, [chartData, colors])

            pricePercentChange={chartPercentChange?.percentChange}
            additionalHeaderContent={
              <Text variant="body2" color="$neutral2" ml={-4}>
                {chartPeriodToTimeLabel(t, selectedPeriod).toLocaleLowerCase()}
              </Text>
            }
          />
        </Flex>
      )}
      <Flex
        $md={{ width: '100%' }}
        opacity={isPortfolioZero ? 0.5 : 1}
        pointerEvents={isPortfolioZero || isDemoView ? 'none' : 'auto'}
      >
        <SegmentedControl
          disabled={isDisabled}
          fullWidth={media.md}
          options={periodOptions}
          selectedOption={String(selectedPeriod)}
          onSelectOption={(periodStr: string) => setSelectedPeriod(Number(periodStr) as ChartPeriod)}
        />
      </Flex>
    </Flex>
  )
}
