import { groupTickBars } from '~/components/Charts/ToucanChart/bidDistribution/utils/tickGrouping'
import type { ChartBarData, ProcessedChartData } from '~/components/Toucan/Auction/BidDistributionChart/utils/utils'

const TARGET_GROUPED_BARS = 33

interface NormalizedDataSlice {
  yMin: number
  yMax: number
  scaleFactor: number
}

/**
 * Applies pan offset and zoom to produce updated y-axis bounds.
 * Centers the visible window around the concentration band when available,
 * otherwise falls back to the price history range.
 */
export function applyPanZoom<T extends NormalizedDataSlice>(params: {
  normalizedData: T
  concentration: { startTick: number; endTick: number } | null | undefined
  yPanOffset: number
  yZoomLevel: number
}): T & { scaledYMin: number; scaledYMax: number } {
  const { normalizedData, concentration, yPanOffset, yZoomLevel } = params
  const { scaleFactor } = normalizedData

  const baseYMin = concentration ? Math.min(normalizedData.yMin, concentration.startTick) : normalizedData.yMin
  const baseYMax = concentration ? Math.max(normalizedData.yMax, concentration.endTick) : normalizedData.yMax

  const baseRange = baseYMax - baseYMin || Math.max(baseYMax * 0.1, 0.001)
  const buffer = baseRange * 0.1
  const bufferedMin = baseYMin - buffer
  const bufferedMax = baseYMax + buffer
  const bufferedRange = bufferedMax - bufferedMin
  const halfRange = bufferedRange / yZoomLevel / 2
  const baseMidpoint = (bufferedMin + bufferedMax) / 2
  const center = baseMidpoint + yPanOffset
  const yMin = center - halfRange
  const yMax = center + halfRange

  return {
    ...normalizedData,
    yMin,
    yMax,
    scaledYMin: yMin * scaleFactor,
    scaledYMax: yMax * scaleFactor,
  }
}

/**
 * Computes the allowable pan offset range based on the distribution bar extent.
 * Returns null if there is insufficient data to determine bounds.
 */
export function computePanBounds(params: {
  normalizedData: NormalizedDataSlice
  bars: ChartBarData[]
  yZoomLevel: number
}): { min: number; max: number } | null {
  const { normalizedData, bars, yZoomLevel } = params
  const baseRange = normalizedData.yMax - normalizedData.yMin
  if (baseRange <= 0) {
    return null
  }
  const zoomedRange = baseRange / yZoomLevel
  const minOffset = -baseRange * 2
  const maxBarTick = bars.length > 0 ? bars.reduce((m, b) => Math.max(m, b.tick), -Infinity) : 0
  const offsetToReachMaxBar = maxBarTick - normalizedData.yMax + zoomedRange * 0.1
  const maxOffset = Math.max(baseRange * 2, offsetToReachMaxBar)
  return { min: minOffset, max: maxOffset }
}

/**
 * Groups distribution bars based on the current zoom level so that the number
 * of rendered bars stays near TARGET_GROUPED_BARS. Returns null when chartData
 * is absent, or the original bars when no grouping is needed.
 */
export function computeViewGroupedBars(params: {
  chartData: ProcessedChartData
  yMin: number | undefined
  yMax: number | undefined
  tickSizeDecimal: number
  clearingPriceDecimal: number | undefined
  yZoomLevel: number
}): ChartBarData[] {
  const { chartData, yMin, yMax, tickSizeDecimal, clearingPriceDecimal, yZoomLevel } = params

  if (!tickSizeDecimal || tickSizeDecimal <= 0 || !Number.isFinite(tickSizeDecimal)) {
    return chartData.bars
  }

  const viewMin = chartData.concentration
    ? Math.min(yMin ?? chartData.minTick, chartData.concentration.startTick)
    : (yMin ?? chartData.minTick)
  const viewMax = chartData.concentration
    ? Math.max(yMax ?? chartData.maxTick, chartData.concentration.endTick)
    : (yMax ?? chartData.maxTick)
  const baseRange = viewMax - viewMin
  const viewRange = (baseRange * 1.2) / yZoomLevel

  if (!Number.isFinite(viewRange) || viewRange <= 0) {
    return chartData.bars
  }

  const ticksInView = Math.round(viewRange / tickSizeDecimal)
  if (ticksInView <= TARGET_GROUPED_BARS || !Number.isFinite(ticksInView)) {
    return chartData.bars
  }

  const groupSizeTicks = Math.max(1, Math.ceil(ticksInView / TARGET_GROUPED_BARS))
  const medianOffsetTicks = Math.floor((groupSizeTicks - 1) / 2)
  const minBidTickDecimal =
    clearingPriceDecimal !== undefined ? clearingPriceDecimal + tickSizeDecimal : chartData.minTick

  try {
    const grouped = groupTickBars({
      bars: chartData.bars,
      tickSizeDecimal,
      minBidTickDecimal,
      grouping: { groupSizeTicks, medianOffsetTicks },
    })

    return grouped.map(
      (g, i): ChartBarData => ({
        tick: g.tick,
        tickQ96: g.tickQ96,
        tickDisplay: g.tick.toString(),
        amount: g.amount,
        index: i,
      }),
    )
  } catch {
    return chartData.bars
  }
}
