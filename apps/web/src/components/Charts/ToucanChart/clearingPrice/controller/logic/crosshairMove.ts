import type { IChartApi, ISeriesApi, MouseEventParams, Time } from 'lightweight-charts'
import type {
  ClearingPriceChartPoint,
  ClearingPriceTooltipState,
} from '~/components/Charts/ToucanChart/clearingPrice/types'
<<<<<<< HEAD
=======
import { CHART_DIMENSIONS } from '~/components/Toucan/Auction/BidDistributionChart/constants'
>>>>>>> upstream/main

interface HandleCrosshairMoveParams {
  param: MouseEventParams<Time>
  chart: IChartApi
  series: ISeriesApi<'Area'>
  onTooltipStateChange: (state: ClearingPriceTooltipState | null) => void
}

/**
 * Calculates tooltip position and determines whether it should flip
 * to the left side when near the right edge of the chart.
 */
export function handleClearingPriceCrosshairMove(params: HandleCrosshairMoveParams): void {
  const { param, chart, series, onTooltipStateChange } = params

  // No hover data - hide tooltip
  if (!param.point || !param.time) {
    onTooltipStateChange(null)
    return
  }

  const data = param.seriesData.get(series) as ClearingPriceChartPoint | undefined
  if (!data) {
    onTooltipStateChange(null)
    return
  }

<<<<<<< HEAD
  const priceScaleWidth = chart.priceScale('left').width()
  const chartWidth = chart.paneSize().width
  const x = param.point.x + priceScaleWidth

  // Determine if we should flip to the left side
  // Flip when we're past 60% of the chart width
  const flipThreshold = chartWidth * 0.6
  const flipLeft = param.point.x > flipThreshold

  // Vertical positioning - keep tooltip near top of chart
  const y = Math.max(10, Math.min(param.point.y, 60))
=======
  const chartWidth = chart.paneSize().width
  // Offset by Y_AXIS_LABEL_WIDTH since the tooltip is positioned inside ChartWrapper
  // but the chart pane starts after the Y-axis label area
  const x = param.point.x + CHART_DIMENSIONS.Y_AXIS_LABEL_WIDTH

  // Default: tooltip to the left of crosshair. Flip to right when near left edge.
  const flipThreshold = chartWidth * 0.4
  const flipLeft = param.point.x > flipThreshold

  // Vertical positioning - track close to the price point
  const y = Math.max(10, param.point.y)
>>>>>>> upstream/main

  onTooltipStateChange({
    x,
    y,
    flipLeft,
    data,
  })
}

export function calculateTooltipTransform(state: ClearingPriceTooltipState): string {
<<<<<<< HEAD
  const tooltipOffset = 12

  let transformX: string
  if (state.flipLeft) {
    // Position to the left of the crosshair
    transformX = `calc(${state.x - tooltipOffset}px - 100%)`
  } else {
    // Position to the right of the crosshair
    transformX = `calc(${state.x + tooltipOffset}px)`
  }

  const transformY = `${state.y}px`
=======
  const tooltipOffset = 8

  let transformX: string
  if (state.flipLeft) {
    // Default: position to the left of the crosshair
    transformX = `calc(${state.x - tooltipOffset}px - 100%)`
  } else {
    // Flipped: position to the right of the crosshair (near left edge)
    transformX = `calc(${state.x + tooltipOffset}px)`
  }

  // Offset upward so tooltip appears above the price point
  const transformY = `calc(${state.y}px - 100% - 8px)`
>>>>>>> upstream/main

  return `translate(${transformX}, ${transformY})`
}
