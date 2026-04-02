import { FeatureFlags, useFeatureFlag } from '@luxexchange/gating'
import { memo, useState } from 'react'
import {
  Flex,
  FlexProps,
  Loader,
  styled,
  Text,
  TextProps,
  UniversalImage,
  useColorSchemeFromSeed,
  useSporeColors,
} from 'ui/src'
import { iconSizes, validColor, zIndexes } from 'ui/src/theme'
import { getBadgeBorderRadius, getBadgeOuterSize } from 'lx/src/components/CurrencyLogo/badgeSizeUtils'
import { STATUS_RATIO } from 'lx/src/components/CurrencyLogo/CurrencyLogo'
import { NetworkLogo } from 'lx/src/components/CurrencyLogo/NetworkLogo'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { isTestnetChain } from 'lx/src/features/chains/utils'
import { isMobileApp } from 'utilities/src/platform'

interface TokenLogoProps {
  url?: string | null
  symbol?: string
  name?: string | null
  chainId?: UniverseChainId | null
  size?: number
  hideNetworkLogo?: boolean
  alwaysShowNetworkLogo?: boolean
  /** When > 1, show a gray badge with this number instead of the network logo (for multichain tokens). */
  networkCount?: number
  networkLogoBorderWidth?: number
  loading?: boolean
  webFontSize?: number
  lineHeight?: TextProps['lineHeight']
  transition?: FlexProps['transition']
}

const Badge = styled(Flex, {
  bottom: -2,
  position: 'absolute',
  right: -3,
  zIndex: zIndexes.mask,
})

const TESTNET_BORDER_DIVISOR = 15
const BORDER_OFFSET = 4

/** Gray circular badge showing network count; same size and shape as NetworkLogo for consistency. */
function MultichainCountBadge({
  count,
  sizeWithoutBorder,
  borderWidth,
}: {
  count: number
  sizeWithoutBorder: number
  borderWidth: number
}): JSX.Element {
  const colors = useSporeColors()
  const outerSize = getBadgeOuterSize(sizeWithoutBorder, borderWidth)
  const borderRadius = getBadgeBorderRadius(outerSize, 'square')

  return (
    <Badge>
      <Flex
        centered
        width={outerSize}
        height={outerSize}
        borderRadius={borderRadius}
        backgroundColor="$surface3Solid"
        borderWidth={borderWidth}
        borderColor={colors.surface1.val}
        testID="multichain-count-badge"
      >
        <Text
          allowFontScaling={false}
          color="$neutral1"
          fontFamily="$button"
          fontSize={10}
          fontWeight="$book"
          numberOfLines={1}
          lineHeight={8}
        >
          {count > 99 ? '99+' : String(count)}
        </Text>
      </Flex>
    </Badge>
  )
}

function NetworkLogoBadge({
  chainId,
  size,
  borderWidth,
}: {
  chainId: UniverseChainId | null
  size: number
  borderWidth: number
}): JSX.Element {
  return (
    <Badge>
      <NetworkLogo borderWidth={borderWidth} chainId={chainId} size={size} />
    </Badge>
  )
}

function shouldShowNetworkLogo({
  alwaysShowNetworkLogo,
  hideNetworkLogo,
  chainId,
}: {
  alwaysShowNetworkLogo: boolean | undefined
  hideNetworkLogo: boolean | undefined
  chainId: UniverseChainId | null | undefined
}): boolean {
  if (alwaysShowNetworkLogo && chainId) {
    return true
  }
  if (!hideNetworkLogo && !!chainId && chainId !== UniverseChainId.Mainnet) {
    return true
  }
  return false
}

export const TokenLogo = memo(function _TokenLogo({
  url,
  symbol,
  name,
  chainId,
  size = iconSizes.icon40,
  hideNetworkLogo,
  alwaysShowNetworkLogo,
  networkCount,
  networkLogoBorderWidth = isMobileApp ? 2 : 1.5,
  loading,
  webFontSize = 10,
  lineHeight = 14,
  transition,
}: TokenLogoProps): JSX.Element {
  const isMultichainUxEnabled = useFeatureFlag(FeatureFlags.MultichainTokenUx)
  const isTestnetToken = !!chainId && isTestnetChain(chainId)

  // We want to avoid the extra render on mobile when updating the state, so we set this to `true` from the start.
  const [showBackground, setShowBackground] = useState(isMobileApp ? true : false)

  const colors = useSporeColors()
  const { foreground, background } = useColorSchemeFromSeed(name ?? symbol ?? '')

  const borderWidth = isTestnetToken ? size / TESTNET_BORDER_DIVISOR : 0

  const showMultichainCountBadge = isMultichainUxEnabled && networkCount !== undefined && networkCount > 1
  const showNetworkLogo = shouldShowNetworkLogo({
    alwaysShowNetworkLogo,
    hideNetworkLogo,
    chainId,
  })
  const networkLogoSize = Math.round(size * STATUS_RATIO)

  const borderOffset = isTestnetToken ? BORDER_OFFSET : 0

  const tokenSize = size - borderWidth - borderOffset

  if (loading) {
    return <Loader.Box borderRadius="$roundedFull" height={size} width={size} />
  }

  const fallback = (
    <Flex
      alignItems="center"
      borderRadius="$roundedFull"
      height={tokenSize}
      justifyContent="center"
      px="$spacing8"
      style={{ backgroundColor: background }}
      width={tokenSize}
    >
      <Text
        adjustsFontSizeToFit
        $platform-web={{
          // adjustFontSizeToFit is a react-native-only prop
          fontSize: webFontSize,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'clip',
        }}
        allowFontScaling={false}
        color={validColor(foreground)}
        fontFamily="$button"
        fontSize={17}
        fontWeight="500"
        lineHeight={lineHeight}
        minimumFontScale={0.5}
        numberOfLines={1}
      >
        {symbol?.slice(0, 3)}
      </Text>
    </Flex>
  )

  return (
    <Flex
      alignItems="center"
      height={size}
      justifyContent="center"
      testID="token-logo"
      pointerEvents="auto"
      width={size}
      position="relative"
      transition={transition}
    >
      {!isTestnetToken && (
        <Flex
          opacity={showBackground ? 1 : 0}
          height="96%"
          width="96%"
          zIndex={zIndexes.background}
          backgroundColor={colors.white.val}
          position="absolute"
          top="2%"
          left="2%"
          borderRadius={size / 2}
        />
      )}

      <UniversalImage
        allowLocalUri
        fallback={fallback}
        size={{ height: tokenSize, width: tokenSize }}
        style={{
          image: {
            borderRadius: size / 2,
            zIndex: zIndexes.default,
            ...(transition && { transition }),
          },
        }}
        testID="token-image"
        uri={url ?? undefined}
        onLoad={() => setShowBackground(true)}
      />

      {isTestnetToken && (
        <Flex
          borderRadius={size / 2}
          borderStyle="dashed"
          borderColor="$neutral3"
          borderWidth={borderWidth}
          height={size}
          width={size}
          style={{ boxSizing: 'border-box' }}
          position="absolute"
        />
      )}

      {showMultichainCountBadge ? (
        <MultichainCountBadge
          count={networkCount}
          sizeWithoutBorder={networkLogoSize}
          borderWidth={networkLogoBorderWidth}
        />
      ) : (
        showNetworkLogo && (
          <NetworkLogoBadge borderWidth={networkLogoBorderWidth} chainId={chainId ?? null} size={networkLogoSize} />
        )
      )}
    </Flex>
  )
})
