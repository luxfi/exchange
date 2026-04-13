import type { UTCTimestamp } from 'lightweight-charts'
import type { UseSporeColorsReturn } from 'ui/src/hooks/useSporeColors'
import type { BidTokenInfo } from '~/components/Toucan/Auction/store/types'

export interface ClearingPriceChartPoint {
  time: UTCTimestamp
  value: number
  q96: string
}

export interface ChartCoordinates {
  x: number
  y: number
}

/**
 * Normalized series data with computed metadata for chart rendering.
 */
export interface NormalizedClearingPriceSeries {
  /** Scaled data points for lightweight-charts (values multiplied by scaleFactor) */
  data: ClearingPriceChartPoint[]
  /** Original unscaled data points */
  originalData: ClearingPriceChartPoint[]
  /** Start time of the series */
  startTime: UTCTimestamp | undefined
  /** End time of the series */
  endTime: UTCTimestamp | undefined
  /** Minimum Y value (unscaled) */
  yMin: number
  /** Maximum Y value (unscaled) */
  yMax: number
  /** Minimum Y value after scaling */
  scaledYMin: number
  /** Maximum Y value after scaling */
  scaledYMax: number
  /** Scale factor applied to values for Y-axis display */
  scaleFactor: number
  /** Time span of the data in days (for x-axis format decisions) */
  timeSpanDays: number
  /** Visible range start time (auction start) for setting chart bounds */
  visibleRangeStart: UTCTimestamp | undefined
  /** Visible range end time (data end) for setting chart bounds */
  visibleRangeEnd: UTCTimestamp | undefined
  /** Whether the auction is currently in progress (not ended) */
  isAuctionInProgress: boolean
  /** Auction end time (for x-axis extension in in-progress auctions) */
  auctionEndTime: UTCTimestamp | undefined
}

export interface ClearingPriceZoomState {
  visibleRange: { from: number; to: number } | null
  isZoomed: boolean
}

/**
 * Callbacks from the controller to React layer for state synchronization.
 */
interface ClearingPriceChartControllerCallbacks {
  /** Called when tooltip data changes (hovered point or hide) */
  onTooltipStateChange: (state: ClearingPriceTooltipState | null) => void
  /** Called when hover coordinates change (hovered point or hide) */
  onHoverCoordinatesChange?: (coordinates: ChartCoordinates | null) => void
  /** Called when visible range / zoom state changes */
  onZoomStateChange?: (state: ClearingPriceZoomState) => void
  /** Called when y-axis labels are computed (for custom overlay rendering) */
  onYAxisLabelsChange?: (labels: YAxisLabel[]) => void
  /** When true, disables mouse wheel scroll/scale so an external handler can manage Y-axis pan/zoom */
  disableMouseWheelInteractions?: boolean
}

export interface YAxisLabel {
  label: string
  y: number
}

export interface ClearingPriceTooltipState {
  /** X position in pixels relative to chart container */
  x: number
  /** Y position in pixels relative to chart container */
  y: number
  /** Whether tooltip should appear on the left side of crosshair */
  flipLeft: boolean
  /** The hovered data point */
  data: ClearingPriceChartPoint
}
