import { ChartPeriod } from '@luxamm/client-data-api/dist/data/v1/api_pb'
import { useEffect, useMemo } from 'react'
import { type ChartData } from 'src/components/home/PortfolioChart/SparklineChart'
import { useSporeColors } from '@luxfi/ui/src'
import { useGetPortfolioHistoricalValueChartQuery } from 'lx/src/data/rest/getPortfolioChart'
import { logger } from '@luxfi/utilities/src/logger/logger'

export function usePortfolioChartData({
  evmAddress,
  chartPeriod,
  chainIds,
  enabled = true,
}: {
  evmAddress?: string
  chartPeriod: ChartPeriod
  chainIds?: number[]
  enabled?: boolean
}): {
  data: ChartData
  loading: boolean
  error: Error | null
  chartColor: string
} {
  const colors = useSporeColors()

  const {
    data: chartResponse,
    isPending,
    isFetching,
    error,
  } = useGetPortfolioHistoricalValueChartQuery({
    input: {
      evmAddress,
      chartPeriod,
      chainIds,
    },
    enabled: enabled && !!evmAddress,
  })

  useEffect(() => {
    if (error) {
      logger.warn('usePortfolioChartData', 'usePortfolioChartData', 'Portfolio chart query failed', {
        evmAddress,
        chartPeriod,
      })
    }
  }, [error, evmAddress, chartPeriod])

  const data = useMemo<ChartData>(() => {
    if (!chartResponse?.points || chartResponse.points.length === 0) {
      return []
    }

    return chartResponse.points.map((point) => ({
      // API returns timestamp as bigint in seconds
      timestamp: Number(point.timestamp),
      value: point.value,
    }))
  }, [chartResponse?.points])

  const first = data[0]
  const last = data[data.length - 1]
  const chartColor = !first || !last || last.value >= first.value ? colors.statusSuccess.val : colors.statusCritical.val

  return {
    data,
    loading: isPending || isFetching,
    error: error ?? null,
    chartColor,
  }
}
