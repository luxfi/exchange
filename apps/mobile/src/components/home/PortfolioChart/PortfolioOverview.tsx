import { useQueryClient } from '@tanstack/react-query'
import { SharedEventName } from '@uniswap/analytics-events'
import { ChartPeriod } from '@uniswap/client-data-api/dist/data/v1/api_pb'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { navigate } from 'src/app/navigation/rootNavigation'
import { PortfolioChart } from 'src/components/home/PortfolioChart/PortfolioChart'
import { type ChartData } from 'src/components/home/PortfolioChart/SparklineChart'
import { usePortfolioChartData } from 'src/components/home/PortfolioChart/usePortfolioChartData'
import { PortfolioPerformance } from 'src/components/home/PortfolioPerformance'
import { Flex, TouchableArea } from 'ui/src'
import { useLayoutAnimationOnChange } from 'ui/src/animations/layout'
import { AnglesMaximize } from 'ui/src/components/icons/AnglesMaximize'
import { AnglesMinimize } from 'ui/src/components/icons/AnglesMinimize'
import { getPortfolioHistoricalValueChartQuery } from 'uniswap/src/data/rest/getPortfolioChart'
import { usePortfolioTotalValue } from 'uniswap/src/features/dataApi/balances/balancesRest'
import { CHART_PERIOD_OPTIONS } from 'uniswap/src/features/portfolio/chartPeriod'
import { PortfolioBalance } from 'uniswap/src/features/portfolio/PortfolioBalance/PortfolioBalance'
import { getPortfolioChartPercentChange } from 'uniswap/src/features/portfolio/portfolioChartPercentChange'
import { usePortfolioChartBalanceMismatch } from 'uniswap/src/features/portfolio/usePortfolioChartBalanceMismatch'
import { useHapticFeedback } from 'uniswap/src/features/settings/useHapticFeedback/useHapticFeedback'
import { ElementName, ModalName } from 'uniswap/src/features/telemetry/constants'
import { sendAnalyticsEvent } from 'uniswap/src/features/telemetry/send'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'

interface PortfolioChartSectionProps {
  evmAddress: string
  chainIds: number[]
  isPnLEnabled: boolean
}

export function PortfolioOverview({ evmAddress, chainIds, isPnLEnabled }: PortfolioChartSectionProps): JSX.Element {
  const [isChartExpanded, setIsChartExpanded] = useState(false)
  const [chartPeriod, setChartPeriod] = useState(ChartPeriod.DAY)
  const [chartScrubFiatValue, setChartScrubFiatValue] = useState<number | undefined>(undefined)
  const queryClient = useQueryClient()
  const { hapticFeedback } = useHapticFeedback()

  const handleScrub = useCallback(
    async (point: ChartData[number] | null) => {
      if (point) {
        await hapticFeedback.light()
      }
      setChartScrubFiatValue(point?.value)
    },
    [hapticFeedback],
  )

  useEffect(() => {
    if (!isChartExpanded) {
      setChartScrubFiatValue(undefined)
    }
  }, [isChartExpanded])

  const {
    data: chartData,
    loading: chartLoading,
    chartColor,
  } = usePortfolioChartData({
    evmAddress,
    chartPeriod,
    chainIds,
    enabled: isPnLEnabled,
  })

  const chartPercentChange = useMemo(() => {
    const firstPoint = chartData[0]
    if (chartScrubFiatValue !== undefined && firstPoint !== undefined) {
      return getPortfolioChartPercentChange([firstPoint.value, chartScrubFiatValue])
    }
    return getPortfolioChartPercentChange(chartData.map((d) => d.value))
  }, [chartData, chartScrubFiatValue])

  const lastChartValue = useMemo(() => {
    if (chartData.length === 0) {
      return undefined
    }
    return chartData[chartData.length - 1]?.value
  }, [chartData])

  const { data: portfolioData } = usePortfolioTotalValue({
    evmAddress,
    chainIds,
  })

  const { isTotalValueMatch } = usePortfolioChartBalanceMismatch({
    lastChartValue,
    portfolioTotalBalanceUSD: portfolioData?.balanceUSD,
  })

  const canShowChart = isPnLEnabled && chartData.length > 0

  useLayoutAnimationOnChange(isChartExpanded)

  useEffect(() => {
    // Only collapse when we definitively have no data (not during a loading/refetch transition).
    // Without this guard, changing the chart period triggers a refetch that temporarily empties
    // chartData, which would incorrectly collapse the expanded chart.
    if (!canShowChart && !chartLoading) {
      setIsChartExpanded(false)
    }
  }, [canShowChart, chartLoading])

  // Prefetch all chart periods when expanded so switching is instant
  useEffect(() => {
    if (!isChartExpanded || !evmAddress) {
      return
    }
    for (const period of CHART_PERIOD_OPTIONS) {
      if (period === chartPeriod) {
        continue
      }
      queryClient
        .prefetchQuery(
          getPortfolioHistoricalValueChartQuery({
            input: { evmAddress, chartPeriod: period, chainIds },
          }),
        )
        .catch(() => undefined)
    }
  }, [isChartExpanded, evmAddress, chartPeriod, chainIds, queryClient])

  const toggleChartExpanded = useCallback(() => {
    sendAnalyticsEvent(SharedEventName.ELEMENT_CLICKED, {
      element: ElementName.PortfolioChart,
    })
    setIsChartExpanded((prev) => !prev)
  }, [])

  const openReportModal = useCallback(() => {
    navigate(ModalName.ReportPortfolioData, {})
  }, [])

  const chartToggleIcon = useMemo((): JSX.Element | undefined => {
    if (!canShowChart) {
      return undefined
    }
    const Icon = isChartExpanded ? AnglesMinimize : AnglesMaximize
    return (
      <Flex ml="$spacing4">
        <Icon color="$neutral3" size="$icon.16" />
      </Flex>
    )
  }, [canShowChart, isChartExpanded])

  return (
    <>
      <TouchableArea
        disabled={!canShowChart}
        testID={TestID.PortfolioChartToggle}
        activeOpacity={1}
        onPress={toggleChartExpanded}
      >
        <Flex py="$spacing20" px="$spacing24">
          {canShowChart && !isChartExpanded ? (
            <Flex row alignItems="flex-start">
              <Flex flex={1}>
                <PortfolioBalance
                  evmOwner={evmAddress}
                  endText={chartToggleIcon}
                  chartPeriod={chartPeriod}
                  overrideBalanceUSD={chartScrubFiatValue}
                  overridePercentChange={chartPercentChange?.percentChange}
                  overrideAbsoluteChangeUSD={chartPercentChange?.absoluteChangeUSD}
                />
              </Flex>
              <PortfolioChart
                data={chartData}
                loading={chartLoading}
                chartColor={chartColor}
                isExpanded={false}
                chartPeriod={chartPeriod}
                isTotalValueMatch={isTotalValueMatch}
                onChartPeriodChange={setChartPeriod}
              />
            </Flex>
          ) : (
            <PortfolioBalance
              evmOwner={evmAddress}
              endText={chartToggleIcon}
              chartPeriod={canShowChart ? chartPeriod : undefined}
              overrideBalanceUSD={chartScrubFiatValue}
              overridePercentChange={canShowChart ? chartPercentChange?.percentChange : undefined}
              overrideAbsoluteChangeUSD={canShowChart ? chartPercentChange?.absoluteChangeUSD : undefined}
            />
          )}
        </Flex>
      </TouchableArea>
      {canShowChart && isChartExpanded && (
        <Flex px="$spacing24">
          <PortfolioChart
            data={chartData}
            loading={chartLoading}
            chartColor={chartColor}
            isExpanded={true}
            chartPeriod={chartPeriod}
            isTotalValueMatch={isTotalValueMatch}
            onChartPeriodChange={setChartPeriod}
            onScrub={handleScrub}
          />
          <Flex pt="$spacing4" pb="$spacing32">
            <PortfolioPerformance evmAddress={evmAddress} chainIds={chainIds} onReport={openReportModal} />
          </Flex>
        </Flex>
      )}
    </>
  )
}
