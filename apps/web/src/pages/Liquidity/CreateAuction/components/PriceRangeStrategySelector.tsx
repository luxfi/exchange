import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'ui/src'
import { useSporeColors } from 'ui/src/hooks/useSporeColors'
import { PriceRangeStrategyPopover } from '~/pages/Liquidity/CreateAuction/components/PriceRangeStrategyPopover'
import { AuctionType, PriceRangeStrategy } from '~/pages/Liquidity/CreateAuction/types'
import { getRecommendedStrategy } from '~/pages/Liquidity/CreateAuction/utils'

// Histogram: match Figma — thin bars, 5px gap, edge fade, center price indicator; bar count fits container
const HISTOGRAM_MAX_BAR_COUNT = 80
const HISTOGRAM_BAR_WIDTH = 4
const HISTOGRAM_BAR_GAP = 5
const CONTAINER_HEIGHT = 48
const PRICE_INDICATOR_TOP_OFFSET = 9 // triangle sits above bars, per Figma
const EDGE_OPACITIES = [0.12, 0.24, 0.54] as const
const MIN_BAR_COUNT = 7 // odd so price indicator is centered on a bar; keep at least 3 left fade + 1 center + 3 right fade

function getBarOpacity(index: number, total: number): number {
  if (index < EDGE_OPACITIES.length) {
    return EDGE_OPACITIES[index]
  }
  if (index >= total - EDGE_OPACITIES.length) {
    return EDGE_OPACITIES[total - 1 - index]
  }
  return 1
}

/** Concentrated full range: bar at price indicator is tallest; next 2 bars to the right are slightly shorter (liquidity starts at final price, spreads after). */
function getConcentratedHeights(count: number): number[] {
  const heights = Array(count).fill(0.5) // 24/48 = 0.5, same as full range
  const centerIndex = Math.floor((count - 1) / 2) // price indicator touches this bar
  // Center bar (touched by indicator) = tallest; then 2 bars to the right step down (33px, 29px, 26px per Figma)
  const CONCENTRATED_BUMP_HEIGHTS = [33 / 48, 29 / 48, 26 / 48] as const
  for (let i = 0; i < CONCENTRATED_BUMP_HEIGHTS.length; i++) {
    const idx = centerIndex + i
    if (idx < count) {
      heights[idx] = CONCENTRATED_BUMP_HEIGHTS[i]
    }
  }
  return heights
}

/** Max bars that fit in width; always odd so the price indicator is centered on a bar. */
function getBarCountForWidth(width: number): number {
  if (width <= 0) {
    return MIN_BAR_COUNT
  }
  const maxFit = Math.floor((width + HISTOGRAM_BAR_GAP) / (HISTOGRAM_BAR_WIDTH + HISTOGRAM_BAR_GAP))
  const clamped = Math.max(MIN_BAR_COUNT, Math.min(HISTOGRAM_MAX_BAR_COUNT, maxFit))
  return clamped % 2 === 1 ? clamped : Math.max(MIN_BAR_COUNT, clamped - 1)
}

interface PriceHistogramProps {
  strategy: PriceRangeStrategy
  /** Resolved color value (e.g. hex) for SVG fill */
  barColor: string
}

function PriceHistogram({ strategy, barColor }: PriceHistogramProps) {
  const colors = useSporeColors()
  const svgRef = useRef<SVGSVGElement>(null)
  const [svgWidth, setSvgWidth] = useState(0)

  useEffect(() => {
    const el = svgRef.current
    const observer = new ResizeObserver(([entry]) => {
      setSvgWidth(entry.contentRect.width)
    })
    if (el) {
      observer.observe(el)
    }
    return () => {
      observer.disconnect()
    }
  }, [])

  const barCount = useMemo(() => getBarCountForWidth(svgWidth), [svgWidth])
  const heights = useMemo(() => {
    if (strategy === PriceRangeStrategy.CONCENTRATED_FULL_RANGE) {
      return getConcentratedHeights(barCount)
    }
    return Array(barCount).fill(0.5)
  }, [strategy, barCount])

  const totalBarsWidth = barCount * HISTOGRAM_BAR_WIDTH + (barCount - 1) * HISTOGRAM_BAR_GAP
  const startX = (svgWidth - totalBarsWidth) / 2
  const centerIndex = Math.floor((barCount - 1) / 2)
  const centerX = startX + centerIndex * (HISTOGRAM_BAR_WIDTH + HISTOGRAM_BAR_GAP) + HISTOGRAM_BAR_WIDTH / 2

  return (
    <svg
      ref={svgRef}
      width="100%"
      height={PRICE_INDICATOR_TOP_OFFSET + CONTAINER_HEIGHT}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {heights.map((h, i) => (
        <rect
          key={i}
          x={startX + i * (HISTOGRAM_BAR_WIDTH + HISTOGRAM_BAR_GAP)}
          y={PRICE_INDICATOR_TOP_OFFSET + CONTAINER_HEIGHT - Math.round(h * CONTAINER_HEIGHT)}
          width={HISTOGRAM_BAR_WIDTH}
          height={Math.round(h * CONTAINER_HEIGHT)}
          rx={2}
          fill={barColor}
          opacity={getBarOpacity(i, heights.length)}
        />
      ))}
      <polygon
        points={`${centerX - 5},0 ${centerX + 5},0 ${centerX},${PRICE_INDICATOR_TOP_OFFSET}`}
        fill={colors.neutral1.val}
      />
      <line
        x1={centerX}
        y1={PRICE_INDICATOR_TOP_OFFSET}
        x2={centerX}
        y2={PRICE_INDICATOR_TOP_OFFSET + CONTAINER_HEIGHT}
        stroke={colors.neutral3.val}
        strokeWidth={1}
        strokeDasharray="2 2"
      />
    </svg>
  )
}

interface PriceRangeStrategySelectorProps {
  selectedStrategy: PriceRangeStrategy
  onStrategySelect: (strategy: PriceRangeStrategy) => void
  auctionType: AuctionType
  histogramBarColor: string
}

export function PriceRangeStrategySelector({
  selectedStrategy,
  onStrategySelect,
  auctionType,
  histogramBarColor,
}: PriceRangeStrategySelectorProps) {
  const { t } = useTranslation()
  const recommendedStrategy = getRecommendedStrategy(auctionType)
  const isRecommended = selectedStrategy === recommendedStrategy

  const title =
    selectedStrategy === PriceRangeStrategy.CONCENTRATED_FULL_RANGE
      ? t('toucan.createAuction.step.customizePool.priceRange.concentratedFullRange')
      : t('toucan.createAuction.step.customizePool.priceRange.fullRange')

  const description =
    selectedStrategy === PriceRangeStrategy.CONCENTRATED_FULL_RANGE
      ? t('toucan.createAuction.step.customizePool.priceRange.concentratedFullRange.description')
      : t('toucan.createAuction.step.customizePool.priceRange.fullRange.description')

  return (
    <Flex
      backgroundColor="$surface1"
      borderWidth="$spacing1"
      borderColor="$surface3"
      borderRadius="$rounded20"
      p="$spacing16"
      gap="$spacing16"
    >
      <Flex row alignItems="flex-start" gap="$spacing12">
        <Flex flex={1} gap="$spacing4">
          <Flex row alignItems="center" gap="$spacing8">
            <Text variant="subheading2" color="$neutral1">
              {title}
            </Text>
            {isRecommended && (
              <Flex backgroundColor="$surface3" borderRadius="$rounded6" px="$spacing6" py="$spacing2">
                <Text variant="buttonLabel4" color="$neutral1">
                  {t('toucan.createAuction.step.customizePool.priceRange.recommended')}
                </Text>
              </Flex>
            )}
          </Flex>
          <Text variant="body3" color="$neutral2">
            {description}
          </Text>
        </Flex>

        <PriceRangeStrategyPopover
          selectedStrategy={selectedStrategy}
          onStrategySelect={onStrategySelect}
          barColor={histogramBarColor}
        />
      </Flex>

      <PriceHistogram strategy={selectedStrategy} barColor={histogramBarColor} />
    </Flex>
  )
}
