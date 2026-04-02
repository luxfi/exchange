import { ChartPeriod } from '@luxamm/client-data-api/dist/data/v1/api_pb'
import { LinearGradient } from 'expo-linear-gradient'
import { TFunction } from 'i18next'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { I18nManager, StyleSheet } from 'react-native'
import { DotGrid } from 'src/components/charts/DotGrid'
import { type ChartData, SparklineChart } from 'src/components/home/PortfolioChart/SparklineChart'
import { Loader } from 'src/components/loading/loaders'
import { Flex, Separator, Text, TouchableArea, useSporeColors } from '@luxfi/ui/src'
import { useDeviceDimensions } from '@luxfi/ui/src/hooks/useDeviceDimensions'
import { opacify } from '@luxfi/ui/src/theme'
import { TestID } from 'lx/src/test/fixtures/testIDs'

const EXPANDED_CHART_HEIGHT = 180
const COLLAPSED_CHART_VISIBLE_HEIGHT = 70
const COLLAPSED_CHART_TOP_OFFSET = -5
const COLLAPSED_CHART_WIDTH = 100
const GRADIENT_WIDTH = 40
// Horizontal padding: 24px each side from contentHeader + wrapper padding layers
const CHART_HORIZONTAL_PADDING = 48

export const PERIOD_OPTIONS: ChartPeriod[] = [
  ChartPeriod.HOUR,
  ChartPeriod.DAY,
  ChartPeriod.WEEK,
  ChartPeriod.MONTH,
  ChartPeriod.YEAR,
  ChartPeriod.MAX,
]

// TODO(CONS-1374): move periodToTestIdSuffixValue and periodToLabel to shared lx package
function periodToTestIdSuffixValue(period: ChartPeriod): string {
  switch (period) {
    case ChartPeriod.HOUR:
      return '1h'
    case ChartPeriod.DAY:
      return '1d'
    case ChartPeriod.WEEK:
      return '1w'
    case ChartPeriod.MONTH:
      return '1m'
    case ChartPeriod.YEAR:
      return '1y'
    case ChartPeriod.MAX:
      return 'all'
    default:
      return 'unknown'
  }
}

function periodToLabel(t: TFunction, period: ChartPeriod): string {
  switch (period) {
    case ChartPeriod.HOUR:
      return t('token.priceExplorer.timeRangeLabel.hour')
    case ChartPeriod.DAY:
      return t('token.priceExplorer.timeRangeLabel.day')
    case ChartPeriod.WEEK:
      return t('token.priceExplorer.timeRangeLabel.week')
    case ChartPeriod.MONTH:
      return t('token.priceExplorer.timeRangeLabel.month')
    case ChartPeriod.YEAR:
      return t('token.priceExplorer.timeRangeLabel.year')
    case ChartPeriod.MAX:
      return t('common.all')
    default:
      return ''
  }
}

interface PortfolioChartProps {
  data: ChartData
  loading: boolean
  chartColor: string
  isExpanded: boolean
  chartPeriod: ChartPeriod
  onChartPeriodChange: (period: ChartPeriod) => void
  onScrub?: (point: ChartData[number] | null) => void
  isTotalValueMatch: boolean
}

export const PortfolioChart = memo(function PortfolioChart({
  data,
  loading,
  chartColor,
  isExpanded,
  chartPeriod,
  onChartPeriodChange,
  onScrub,
  isTotalValueMatch,
}: PortfolioChartProps): JSX.Element | null {
  const { t } = useTranslation()
  const colors = useSporeColors()
  const { fullWidth } = useDeviceDimensions()

  const isRTL = I18nManager.isRTL
  const chartWidth = fullWidth - CHART_HORIZONTAL_PADDING

  // Slice data to only the points visible in the collapsed chart width
  const collapsedData = useMemo(() => {
    if (data.length <= 2) {
      return data
    }
    const visibleRatio = COLLAPSED_CHART_WIDTH / chartWidth
    const visibleCount = Math.max(2, Math.ceil(data.length * visibleRatio))
    return data.slice(-visibleCount)
  }, [data, chartWidth])

  if (!isExpanded) {
    return (
      <Flex
        testID={TestID.PortfolioChartCollapsed}
        width={COLLAPSED_CHART_WIDTH}
        height={COLLAPSED_CHART_VISIBLE_HEIGHT}
        mt={COLLAPSED_CHART_TOP_OFFSET}
      >
        {loading && data.length === 0 ? (
          <Loader.Graph />
        ) : (
          <>
            <DotGrid width={COLLAPSED_CHART_WIDTH} height={COLLAPSED_CHART_VISIBLE_HEIGHT} />
            <Flex direction="ltr" style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}>
              <SparklineChart
                data={collapsedData}
                width={COLLAPSED_CHART_WIDTH}
                height={COLLAPSED_CHART_VISIBLE_HEIGHT}
                color={chartColor}
                yGutter={8}
              />
            </Flex>
          </>
        )}
        <LinearGradient
          colors={[colors.surface1.val, opacify(0, colors.surface1.val)]}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={styles.leftGradient}
        />
      </Flex>
    )
  }

  return (
    <Flex testID={TestID.PortfolioChartExpanded} gap="$spacing16" pb="$spacing16">
      {/* Chart area */}
      <Flex height={EXPANDED_CHART_HEIGHT} overflow="hidden">
        {loading && data.length === 0 ? (
          <Loader.Graph />
        ) : (
          <>
            <DotGrid width={chartWidth} height={EXPANDED_CHART_HEIGHT} />
            <Flex direction="ltr" style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }}>
              <SparklineChart
                showDot
                interactive={isTotalValueMatch}
                data={data}
                width={chartWidth}
                height={EXPANDED_CHART_HEIGHT}
                color={chartColor}
                yGutter={20}
                dotStrokeColor={colors.surface1.val}
                onScrub={isTotalValueMatch ? onScrub : undefined}
              />
            </Flex>
          </>
        )}
        <LinearGradient
          pointerEvents="none"
          colors={[colors.surface1.val, opacify(0, colors.surface1.val)]}
          end={{ x: 1, y: 0 }}
          start={{ x: 0, y: 0 }}
          style={styles.leftGradient}
        />
      </Flex>

      {/* Time range selector */}
      <Flex row>
        {PERIOD_OPTIONS.map((period) => {
          const isSelected = period === chartPeriod
          const periodIdSuffix = periodToTestIdSuffixValue(period)
          return (
            <TouchableArea key={period} flex={1} alignItems="center" onPress={() => onChartPeriodChange(period)}>
              <Flex
                alignItems="center"
                justifyContent="center"
                px={isSelected ? '$spacing8' : '$none'}
                py="$spacing6"
                borderRadius="$rounded16"
                backgroundColor={isSelected ? '$surface3' : undefined}
                testID={isSelected ? `${TestID.PortfolioChartSelectedPeriodPrefix}${periodIdSuffix}` : undefined}
              >
                <Text
                  allowFontScaling={false}
                  numberOfLines={1}
                  testID={`${TestID.PortfolioChartPeriodPrefix}${periodIdSuffix}`}
                  variant="buttonLabel3"
                  color={isSelected ? '$neutral1' : '$neutral2'}
                >
                  {periodToLabel(t, period)}
                </Text>
              </Flex>
            </TouchableArea>
          )
        })}
      </Flex>
      <Separator />
    </Flex>
  )
})

const styles = StyleSheet.create({
  leftGradient: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: GRADIENT_WIDTH,
  },
})
