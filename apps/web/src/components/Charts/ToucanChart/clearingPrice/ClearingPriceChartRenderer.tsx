/* oxlint-disable max-lines */
import { createChart, type IChartApi, type UTCTimestamp } from 'lightweight-charts'
import { useEffect, useRef, useState } from 'react'
import { Flex, useSporeColors } from 'ui/src'
import { useEvent } from 'utilities/src/react/hooks'
import { LiveDotRenderer } from '~/components/Charts/LiveDotRenderer'
import { ClearingPriceTooltipBody } from '~/components/Charts/ToucanChart/clearingPrice/components/ClearingPriceTooltipBody'
import { createTimeScaleOptions } from '~/components/Charts/ToucanChart/clearingPrice/controller/chartOptions'
import { calculateTooltipTransform } from '~/components/Charts/ToucanChart/clearingPrice/controller/logic/crosshairMove'
import { ToucanClearingPriceChartController } from '~/components/Charts/ToucanChart/clearingPrice/ToucanClearingPriceChartController'
import type {
  ChartCoordinates,
  ClearingPriceTooltipState,
  NormalizedClearingPriceSeries,
  YAxisLabel,
} from '~/components/Charts/ToucanChart/clearingPrice/types'
import { formatTickMarks } from '~/components/Charts/utils'
import { CHART_DIMENSIONS } from '~/components/Toucan/Auction/BidDistributionChart/constants'
import type { BidTokenInfo, ChartZoomState } from '~/components/Toucan/Auction/store/types'
import { useAuctionStore, useAuctionStoreActions } from '~/components/Toucan/Auction/store/useAuctionStore'
const ChartContainer = deprecatedStyled.div<{ height: number }>`
  width: calc(100% - ${CHART_DIMENSIONS.Y_AXIS_LABEL_WIDTH}px);
  height: 100%;
  margin-left: ${CHART_DIMENSIONS.Y_AXIS_LABEL_WIDTH}px;

  /* Override lightweight-charts inline overflow:hidden to prevent x-axis label cutoff */
  .tv-lightweight-charts {
    overflow: visible !important;
  }

  /* Clip the main plot area to prevent chart line from overflowing into X-axis */
  .tv-lightweight-charts table tr:first-child td:nth-child(2) {
    overflow: hidden;
  }

  /* Match x-axis background to app surface color */
  .tv-lightweight-charts table tr:last-child td {
    background-color: ${({ theme }) => theme.surface1};
  }
`

const ChartWrapper = deprecatedStyled.div<{ height: number }>`
  position: relative;
  width: 100%;
  height: ${({ height }) => height}px;
  overflow: visible;
`

/** Container for the x-axis background chart (full width, x-axis only) */
const XAxisChartContainer = deprecatedStyled.div<{ height: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: ${({ height }) => height}px;
  pointer-events: none;

  .tv-lightweight-charts {
    overflow: visible !important;
  }

  /* Clip the main plot area to prevent chart content from overflowing into X-axis */
  .tv-lightweight-charts table tr:first-child td:nth-child(2) {
    overflow: hidden;
  }

  /* Match x-axis background to app surface color */
  .tv-lightweight-charts table tr:last-child td {
    background-color: ${({ theme }) => theme.surface1};
  }
`

/** Container for the data chart (partial width for in-progress auctions) */
const DataChartContainer = deprecatedStyled.div<{ height: number; $widthPercent: number }>`
  position: absolute;
  top: 0;
  left: ${Y_AXIS_LABEL_WIDTH}px;
  width: calc(${({ $widthPercent }) => $widthPercent}% - ${Y_AXIS_LABEL_WIDTH}px);
