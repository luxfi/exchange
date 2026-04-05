import { curveCardinal, scaleLinear } from 'd3'
import { memo } from 'react'
<<<<<<< HEAD
import { Flex, useSporeColors } from '@l.x/ui/src'
import { normalizeTokenAddressForCache } from '@l.x/lx/src/data/cache'
import { getChainInfo } from '@l.x/lx/src/features/chains/chainInfo'
import { Platform } from '@l.x/lx/src/features/platforms/types/Platform'
import { areAddressesEqual } from '@l.x/lx/src/utils/addresses'
=======
import { Flex, useSporeColors } from 'ui/src'
>>>>>>> upstream/main
import { SparklineMap } from '~/appGraphql/data/types'
import { PricePoint } from '~/appGraphql/data/util'
import { getPriceBounds } from '~/components/Charts/PriceChart/utils'
import LineChart from '~/components/Charts/SparklineChart/LineChart'
import { LoadingBubble } from '~/components/Tokens/loading'
<<<<<<< HEAD
import { NATIVE_CHAIN_ID } from '~/constants/tokens'
import { TokenStat } from '~/state/explore/types'
import { getChainIdFromChainUrlParam } from '~/utils/chainParams'
=======
import { TokenStat } from '~/state/explore/types'
>>>>>>> upstream/main

interface SparklineChartProps {
  width: number
  height: number
  tokenData: TokenStat
  pricePercentChange?: number | null
  sparklineMap: SparklineMap
}

<<<<<<< HEAD
function _SparklineChart({ width, height, tokenData, pricePercentChange, sparklineMap }: SparklineChartProps) {
  const colors = useSporeColors()
  // for sparkline
  const chainId = getChainIdFromChainUrlParam(tokenData.chain.toLowerCase())
  const chainInfo = chainId && getChainInfo(chainId)
  const isNative = areAddressesEqual({
    addressInput1: { address: tokenData.address, platform: chainInfo?.platform ?? Platform.EVM },
    addressInput2: { address: chainInfo?.wrappedNativeCurrency.address, platform: chainInfo?.platform ?? Platform.EVM },
  })
  const pricePoints = tokenData.address
    ? sparklineMap[isNative ? NATIVE_CHAIN_ID : normalizeTokenAddressForCache(tokenData.address)]
    : null
=======
function SparklineChartInner({ width, height, tokenData, pricePercentChange, sparklineMap }: SparklineChartProps) {
  const colors = useSporeColors()
  const pricePoints = tokenData.id ? sparklineMap[tokenData.id] : null
>>>>>>> upstream/main

  // Don't display if there's one or less pricepoints
  if (!pricePoints || pricePoints.length <= 1) {
    return (
      <Flex height="100%" centered>
        <LoadingBubble height="4px" width="90%" />
      </Flex>
    )
  }

  const startingPrice = pricePoints[0]
  const endingPrice = pricePoints[pricePoints.length - 1]
  const widthScale = scaleLinear()
    .domain(
      // the range of possible input values
      [startingPrice.timestamp, endingPrice.timestamp],
    )
    .range(
      // the range of possible output values that the inputs should be transformed to (see https://www.d3indepth.com/scales/ for details)
      [0, 110],
    )

  const { min, max } = getPriceBounds(pricePoints)
  const rdScale = scaleLinear().domain([min, max]).range([height, 0])
  const curveTension = 0.9

  return (
    <LineChart
      data={pricePoints}
      getX={(p: PricePoint) => widthScale(p.timestamp)}
      getY={(p: PricePoint) => rdScale(p.value)}
      curve={curveCardinal.tension(curveTension)}
      color={pricePercentChange && pricePercentChange < 0 ? colors.statusCritical.val : colors.statusSuccess.val}
      strokeWidth={1.5}
      width={width}
      height={height}
    />
  )
}

<<<<<<< HEAD
export default memo(_SparklineChart)
=======
export default memo(SparklineChartInner)
>>>>>>> upstream/main
