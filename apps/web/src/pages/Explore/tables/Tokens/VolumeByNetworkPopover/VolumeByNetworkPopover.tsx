import type { MultichainToken } from '@uniswap/client-data-api/dist/data/v1/types_pb'
import { ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Popover, Text, useIsTouchDevice, useShadowPropsMedium } from 'ui/src'
import { iconSizes, zIndexes } from 'ui/src/theme'
import { NetworkLogo } from 'uniswap/src/components/CurrencyLogo/NetworkLogo'
import { NetworkPile } from 'uniswap/src/components/network/NetworkPile/NetworkPile'
import { getChainInfo } from 'uniswap/src/features/chains/chainInfo'
import { useLocalizationContext } from 'uniswap/src/features/language/LocalizationContext'
import useResizeObserver from 'use-resize-observer'
import { NumberType } from 'utilities/src/format/types'
import { TimePeriod } from '~/appGraphql/data/util'
import { adjustItemWidths, MIN_BAR_WIDTH } from '~/components/PercentageAllocationChart/chartUtils'
import { PercentageBars } from '~/components/PercentageAllocationChart/PercentageBars'
import type { PercentageAllocationItem } from '~/components/PercentageAllocationChart/types'
import { useChartHover } from '~/components/PercentageAllocationChart/useChartHover'
import { useTopNetworkBarColors } from '~/pages/Explore/tables/Tokens/VolumeByNetworkPopover/useTopNetworkBarColors'
import {
  getPercentageDisplay,
  getVolumeBreakdownForPeriod,
  getVolumeLabelForTimePeriod,
} from '~/pages/Explore/tables/Tokens/VolumeByNetworkPopover/utils'

const MAX_VISIBLE_NETWORKS = 3
const POPOVER_MIN_WIDTH = 280
const COLOR_DOT_SIZE = 6

interface VolumeByNetworkPopoverProps {
  mcToken: MultichainToken | undefined
  timePeriod: TimePeriod
  volumeFormatted: string
  children: ReactNode
  minBarWidth?: number
}

export function VolumeByNetworkPopover({
  mcToken,
  timePeriod,
  volumeFormatted,
  children,
  minBarWidth = MIN_BAR_WIDTH,
}: VolumeByNetworkPopoverProps): JSX.Element {
  const { t } = useTranslation()
  const shadowProps = useShadowPropsMedium()
  const isTouchDevice = useIsTouchDevice()
  const { convertFiatAmountFormatted } = useLocalizationContext()
  const { hoveredItemId, onHover } = useChartHover()
  const { ref: barContainerRef, width: chartWidth } = useResizeObserver<HTMLElement>()

  const breakdown = useMemo(() => getVolumeBreakdownForPeriod(mcToken, timePeriod), [mcToken, timePeriod])
  const totalVolume = useMemo(() => breakdown.reduce((sum, { volume }) => sum + volume, 0), [breakdown])

  const topChains = useMemo(
    () =>
      breakdown.slice(0, MAX_VISIBLE_NETWORKS).map((b) => ({ chainId: b.chainId, name: getChainInfo(b.chainId).name })),
    [breakdown],
  )
  const networkColors = useTopNetworkBarColors(topChains)

  const chartItems: PercentageAllocationItem[] = useMemo(() => {
    if (totalVolume <= 0 || breakdown.length === 0) {
      return []
    }
    const top = breakdown.slice(0, MAX_VISIBLE_NETWORKS)
    const rest = breakdown.slice(MAX_VISIBLE_NETWORKS)
    const items: PercentageAllocationItem[] = top.map(({ chainId, volume }, i) => {
      const info = getChainInfo(chainId)
      const percentage = totalVolume === 0 ? 0 : (volume / totalVolume) * 100
      return {
        id: `chain-${chainId}`,
        percentage,
        color: networkColors[i],
        label: info.name,
        icon: <NetworkLogo chainId={chainId} size={iconSizes.icon12} />,
      }
    })
    if (rest.length > 0) {
      const otherVolume = rest.reduce((sum, { volume }) => sum + volume, 0)
      items.push({
        id: 'other',
        percentage: (otherVolume / totalVolume) * 100,
        color: '$neutral3',
        label: t('common.others'),
      })
    }
    return items
  }, [t, breakdown, totalVolume, networkColors])

  const adjustedItems = useMemo(
    () => adjustItemWidths({ t, items: chartItems, chartWidth, minBarWidth }),
    [t, chartItems, chartWidth, minBarWidth],
  )

  const otherVolumeSum = useMemo(
    () =>
      breakdown.length > MAX_VISIBLE_NETWORKS
        ? breakdown.slice(MAX_VISIBLE_NETWORKS).reduce((sum, { volume }) => sum + volume, 0)
        : 0,
    [breakdown],
  )

  const showPopover = chartItems.length > 0 && !isTouchDevice && breakdown.length > 1

  if (!showPopover) {
    return <>{children}</>
  }

  return (
    <Popover
      hoverable={{ delay: { open: 200 }, restMs: 100 }}
      placement="bottom-start"
      stayInFrame
      allowFlip
      offset={{ mainAxis: 10 }}
    >
      <Popover.Trigger>
        <Flex
          cursor="default"
          display="inline-flex"
          onPressIn={(e) => e.stopPropagation()}
          onPressOut={(e) => e.stopPropagation()}
          onPress={(e) => e.stopPropagation()}
        >
          {children}
        </Flex>
      </Popover.Trigger>
      <Popover.Content
        zIndex={zIndexes.popover}
        backgroundColor="$surface4"
        borderColor="$surface3"
        borderRadius="$rounded20"
        borderWidth="$spacing1"
        enterStyle={{ y: -10, opacity: 0 }}
        exitStyle={{ y: -10, opacity: 0 }}
        animation="quick"
        animateOnly={['transform', 'opacity']}
        p="$spacing16"
        minWidth={POPOVER_MIN_WIDTH}
        {...shadowProps}
        $platform-web={{
          ...shadowProps['$platform-web'],
          backdropFilter: 'blur(12px)',
        }}
      >
        <Flex gap="$spacing16" width="100%">
          <Flex row justifyContent="space-between" alignItems="baseline">
            <Text variant="body2" color="$neutral2">
              {getVolumeLabelForTimePeriod(t, timePeriod)}
            </Text>
            <Text variant="body2" color="$neutral1">
              {volumeFormatted}
            </Text>
          </Flex>

          <Flex ref={barContainerRef} width="100%">
            <PercentageBars
              adjustedItems={adjustedItems}
              hoveredItemId={hoveredItemId}
              onHover={onHover}
              minBarWidth={minBarWidth}
              colorSegments
            />
          </Flex>

          {breakdown.length > 0 && (
            <Flex gap="$spacing8">
              {breakdown.slice(0, MAX_VISIBLE_NETWORKS).map(({ chainId, volume }, i) => {
                const itemId = `chain-${chainId}`
                const isSelected = hoveredItemId === itemId
                const shouldFade = hoveredItemId !== null && !isSelected

                return (
                  <Flex
                    key={chainId}
                    row
                    alignItems="center"
                    justifyContent="space-between"
                    gap="$spacing8"
                    opacity={shouldFade ? 0.3 : 1}
                    transition="opacity 0.2s ease-in-out"
                    cursor="pointer"
                    onMouseEnter={() => onHover(itemId)}
                    onMouseLeave={() => onHover(null)}
                  >
                    <Flex row alignItems="center" gap="$spacing8" flex={1} minWidth={0}>
                      <NetworkLogo chainId={chainId} size={iconSizes.icon20} />
                      <Text variant="body3">{convertFiatAmountFormatted(volume, NumberType.FiatTokenStats)}</Text>
                    </Flex>
                    <Flex row alignItems="center" gap="$spacing8">
                      <Text variant="body3" color="$neutral2">
                        {getPercentageDisplay(volume, totalVolume)}
                      </Text>
                      <Flex
                        width={COLOR_DOT_SIZE}
                        height={COLOR_DOT_SIZE}
                        borderRadius="$roundedFull"
                        backgroundColor={networkColors[i]}
                        flexShrink={0}
                      />
                    </Flex>
                  </Flex>
                )
              })}
              {breakdown.length > MAX_VISIBLE_NETWORKS && (
                <Flex
                  row
                  alignItems="center"
                  justifyContent="space-between"
                  gap="$spacing8"
                  opacity={hoveredItemId === 'other' ? 1 : hoveredItemId !== null ? 0.3 : 1}
                  transition="opacity 0.2s ease-in-out"
                  cursor="pointer"
                  onMouseEnter={() => onHover('other')}
                  onMouseLeave={() => onHover(null)}
                >
                  <Flex row alignItems="center" gap="$spacing8" flex={1} minWidth={0}>
                    <NetworkPile
                      chainIds={breakdown.slice(MAX_VISIBLE_NETWORKS).map(({ chainId }) => chainId)}
                      size="small"
                    />
                    <Text variant="body3" color="$neutral2">
                      {convertFiatAmountFormatted(otherVolumeSum, NumberType.FiatTokenStats)}
                    </Text>
                  </Flex>
                  <Flex row alignItems="center" gap="$spacing8">
                    <Text variant="body3" color="$neutral2">
                      {getPercentageDisplay(otherVolumeSum, totalVolume)}
                    </Text>
                    <Flex
                      width={COLOR_DOT_SIZE}
                      height={COLOR_DOT_SIZE}
                      borderRadius="$roundedFull"
                      backgroundColor="$neutral3"
                      flexShrink={0}
                    />
                  </Flex>
                </Flex>
              )}
            </Flex>
          )}
        </Flex>
      </Popover.Content>
    </Popover>
  )
}
