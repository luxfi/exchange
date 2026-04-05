import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex } from 'ui/src'
import useResizeObserver from 'use-resize-observer'
import { adjustItemWidths, MIN_BAR_WIDTH } from '~/components/PercentageAllocationChart/chartUtils'
import { Legend } from '~/components/PercentageAllocationChart/Legend'
import { PercentageBars } from '~/components/PercentageAllocationChart/PercentageBars'
import type { PercentageAllocationItem } from '~/components/PercentageAllocationChart/types'
import { useChartHover } from '~/components/PercentageAllocationChart/useChartHover'

export type { PercentageAllocationItem } from '~/components/PercentageAllocationChart/types'

const DEFAULT_MAX_LEGEND_ITEMS = 5

interface PercentageAllocationChartProps {
  items: PercentageAllocationItem[]
  minBarWidth?: number
  maxLegendItems?: number
  className?: string
}

>>>>>>> upstream/main
export function PercentageAllocationChart({
  items,
  minBarWidth = MIN_BAR_WIDTH,
  maxLegendItems = DEFAULT_MAX_LEGEND_ITEMS,
  className,
}: PercentageAllocationChartProps): JSX.Element {
  const { t } = useTranslation()
  const { ref: chartRef, width: chartWidth } = useResizeObserver<HTMLElement>()
<<<<<<< HEAD
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [showAllItems, setShowAllItems] = useState(false)

  // Calculate adjusted widths for all items
  const adjustedItems = useMemo(() => {
    return adjustItemWidths({ items, chartWidth, minBarWidth })
  }, [items, chartWidth, minBarWidth])

  const handleItemHover = (itemId: string | null) => {
    setHoveredItem(itemId)
  }

  const displayItems = showAllItems ? adjustedItems : adjustedItems.slice(0, maxLegendItems)
  const hasMoreItems = items.length > maxLegendItems

  return (
    <Flex flexDirection="column" gap="$spacing16" ref={chartRef} className={className}>
      {/* Stacked Bar with Gaps */}
      <Flex position="relative" width="100%">
        {/* Visual Bar */}
        <Flex p="$spacing4" height="$spacing16" borderRadius="$roundedFull" backgroundColor="$surface2">
          <Flex row height="100%" gap="$spacing4" borderRadius="$roundedFull" overflow="hidden">
            {adjustedItems.map((item) => {
              const isHovered = hoveredItem === item.id

              return (
                <Flex
                  key={item.id}
                  height="100%"
                  borderRadius="$roundedFull"
                  transition="all 0.2s ease-in-out"
                  backgroundColor={isHovered ? item.color : '$surface3'}
                  {...item.style}
                  minWidth={minBarWidth}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                />
              )
            })}
          </Flex>
        </Flex>
      </Flex>

      {/* Legend */}
      <Flex row alignItems="center" flexWrap="wrap" gap="$spacing24" rowGap="$spacing16">
        {displayItems.map((item) => {
          const isSelected = hoveredItem === item.id
          const shouldFade = hoveredItem !== null && !isSelected

          return (
            <Flex
              key={item.id}
              row
              alignItems="center"
              gap="$spacing8"
              transition="opacity 0.2s ease-in-out"
              cursor="pointer"
              opacity={shouldFade ? 0.3 : 1}
              onMouseEnter={() => handleItemHover(item.id)}
              onMouseLeave={() => handleItemHover(null)}
            >
              <Flex
                width="$spacing12"
                height="$spacing12"
                borderRadius="$roundedFull"
                flexShrink={0}
                backgroundColor={item.color}
              />
              <Flex row alignItems="center" gap="$spacing4">
                <Text variant="body4" color="$neutral1" whiteSpace="nowrap">
                  {item.label}
                </Text>
                {item.icon}
              </Flex>
              <Text variant="body4" color="$neutral2">
                {item.percentage.toFixed(1)}%
              </Text>
            </Flex>
          )
        })}

        {/* More/Less Toggle */}
        {hasMoreItems && (
          <Flex
            row
            alignItems="center"
            gap="$spacing4"
            cursor="pointer"
            onPress={() => setShowAllItems(!showAllItems)}
            hoverStyle={{ opacity: 0.8 }}
          >
            <Text variant="body3" color="$neutral2">
              {showAllItems ? t('common.less') : `+${items.length - maxLegendItems} ${t('common.more').toLowerCase()}`}
            </Text>
          </Flex>
        )}
      </Flex>
=======
  const { hoveredItemId, onHover } = useChartHover()
  const [showAllItems, setShowAllItems] = useState(false)

  const adjustedItems = useMemo(
    () => adjustItemWidths({ t, items, chartWidth, minBarWidth }),
    [t, items, chartWidth, minBarWidth],
  )

  const displayItems = showAllItems ? adjustedItems : adjustedItems.slice(0, maxLegendItems)
  const hasMoreItems = adjustedItems.length > maxLegendItems

  return (
    <Flex flexDirection="column" gap="$spacing16" ref={chartRef} className={className}>
      <PercentageBars
        adjustedItems={adjustedItems}
        hoveredItemId={hoveredItemId}
        onHover={onHover}
        minBarWidth={minBarWidth}
      />
      <Legend
        items={displayItems}
        hoveredItemId={hoveredItemId}
        onItemHover={onHover}
        hasMoreItems={hasMoreItems}
        showAllItems={showAllItems}
        onShowAllToggle={() => setShowAllItems((prev) => !prev)}
        totalItemsCount={adjustedItems.length}
        maxLegendItems={maxLegendItems}
      />
    </Flex>
  )
}
