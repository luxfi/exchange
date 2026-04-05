import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AnimatePresence,
  ElementAfterText,
  Flex,
  Text,
  TouchableArea,
  TouchableAreaEvent,
  useIsDarkMode,
  useSporeColors,
<<<<<<< HEAD
} from '@l.x/ui/src'
import { ArrowUpRight } from '@l.x/ui/src/components/icons/ArrowUpRight'
import { X } from '@l.x/ui/src/components/icons/X'
import { opacify } from '@l.x/ui/src/theme'
import { CardImage } from '@l.x/lx/src/components/cards/image'
import { NewTag } from '@l.x/lx/src/components/pill/NewTag'
import { useLuxContext } from '@l.x/lx/src/contexts/LuxContext'
import { useIsBridgingChain } from '@l.x/lx/src/features/bridging/hooks/chains'
import { getChainInfo } from '@l.x/lx/src/features/chains/chainInfo'
import { useIsSupportedChainId } from '@l.x/lx/src/features/chains/hooks/useSupportedChainId'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { useIsShowingWebFORNudge } from '@l.x/lx/src/features/providers/webForNudgeProvider'
import { ElementName } from '@l.x/lx/src/features/telemetry/constants'
=======
} from 'ui/src'
import { ArrowUpRight } from 'ui/src/components/icons/ArrowUpRight'
import { X } from 'ui/src/components/icons/X'
import { opacify } from 'ui/src/theme'
import { CardImage } from 'uniswap/src/components/cards/image'
import { NewTag } from 'uniswap/src/components/pill/NewTag'
import { useUniswapContext } from 'uniswap/src/contexts/UniswapContext'
import { useIsBridgingChain } from 'uniswap/src/features/bridging/hooks/chains'
import { getChainInfo } from 'uniswap/src/features/chains/chainInfo'
import { useIsSupportedChainId } from 'uniswap/src/features/chains/hooks/useSupportedChainId'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { useIsShowingWebFORNudge } from 'uniswap/src/features/providers/webForNudgeProvider'
import { ElementName } from 'uniswap/src/features/telemetry/constants'
>>>>>>> upstream/main
import { EmptyWalletCards } from '~/components/emptyWallet/EmptyWalletCards'
import { PageType, useIsPage } from '~/hooks/useIsPage'
import { useMultichainContext } from '~/state/multichain/useMultichainContext'
import { ExternalLink } from '~/theme/components/Links'
<<<<<<< HEAD
import { ClickableGuiStyle } from '~/theme/components/styles'

export function SwapBottomCard() {
  const { chainId: oldFlowChainId } = useMultichainContext()
  const { swapInputChainId: newFlowChainId } = useLuxContext()
=======
import { ClickableTamaguiStyle } from '~/theme/components/styles'

export function SwapBottomCard() {
  const { chainId: oldFlowChainId } = useMultichainContext()
  const { swapInputChainId: newFlowChainId } = useUniswapContext()
>>>>>>> upstream/main
  const chainId = newFlowChainId ?? oldFlowChainId

  const isSupportedChain = useIsSupportedChainId(chainId)

  const isBridgingSupportedChain = useIsBridgingChain(chainId ?? UniverseChainId.Mainnet)

  const isSwapPage = useIsPage(PageType.SWAP)
  const isSendPage = useIsPage(PageType.SEND)
  const shouldShowWebFORNudge = useIsShowingWebFORNudge() && isSwapPage

  const hideCard = !isSupportedChain || !(isSwapPage || isSendPage || shouldShowWebFORNudge)

  const card = useMemo(() => {
    if (hideCard) {
      return null
    }

    if (shouldShowWebFORNudge) {
      return (
        <AnimatePresence>
          <EmptyWalletCards
            horizontalLayout
            buyElementName={ElementName.ForEmptyStateBuy}
            receiveElementName={ElementName.ForEmptyStateReceive}
            cexTransferElementName={ElementName.ForEmptyStateCEXTransfer}
          />
        </AnimatePresence>
      )
    }

    if (!isBridgingSupportedChain) {
      return <MaybeExternalBridgeCard chainId={chainId} />
    } else {
      return null
    }
  }, [chainId, hideCard, isBridgingSupportedChain, shouldShowWebFORNudge])

  return <>{card}</>
}

// keeping this code for any future web banners
<<<<<<< HEAD
// eslint-disable-next-line import/no-unused-modules
=======
// oxlint-disable-next-line import/no-unused-modules
>>>>>>> upstream/main
export function ImagePromoBanner({
  title,
  subtitle,
  image,
  isNew = false,
  onDismiss,
  onPress,
}: {
  title: string
  subtitle: string
  image: any
  isNew?: boolean
  onDismiss: () => void
  onPress: () => void
}): JSX.Element {
  return (
<<<<<<< HEAD
    <TouchableArea {...ClickableGuiStyle} onPress={onPress}>
=======
    <TouchableArea {...ClickableTamaguiStyle} onPress={onPress}>
>>>>>>> upstream/main
      <CardInner
        isAbsoluteImage
        image={
          <Flex height="100%">
            <CardImage uri={image} />
          </Flex>
        }
        title={title}
        onDismiss={onDismiss}
        subtitle={subtitle}
        isNew={isNew}
      />
    </TouchableArea>
  )
}

interface ChainTheme {
  bgColor: string
  textColor: string
}

<<<<<<< HEAD
const CHAIN_THEME_LIGHT: Partial<Record<UniverseChainId, ChainTheme>> = {
=======
const CHAIN_THEME_LIGHT: Record<UniverseChainId, ChainTheme> = {
>>>>>>> upstream/main
  [UniverseChainId.Mainnet]: { bgColor: '#6B8AFF33', textColor: '#6B8AFF' },
  [UniverseChainId.ArbitrumOne]: { bgColor: '#00A3FF33', textColor: '#00A3FF' },
  [UniverseChainId.Avalanche]: { bgColor: '#E8414233', textColor: '#E84142' },
  [UniverseChainId.Base]: { bgColor: '#0052FF33', textColor: '#0052FF' },
  [UniverseChainId.Blast]: { bgColor: 'rgba(252, 252, 3, 0.16)', textColor: 'rgba(17, 20, 12, 1)' },
  [UniverseChainId.Bnb]: { bgColor: '#EAB20033', textColor: '#EAB200' },
  [UniverseChainId.Celo]: { bgColor: '#FCFF5233', textColor: '#FCFF52' },
<<<<<<< HEAD
=======
  [UniverseChainId.Linea]: { bgColor: 'rgba(97, 223, 255, 0.12)', textColor: '#121212' },
>>>>>>> upstream/main
  [UniverseChainId.Monad]: { bgColor: 'rgba(115, 91, 248, 0.08)', textColor: '#735BF8' },
  [UniverseChainId.Optimism]: { bgColor: '#FF042033', textColor: '#FF0420' },
  [UniverseChainId.Polygon]: { bgColor: '#9558FF33', textColor: '#9558FF' },
  [UniverseChainId.Sepolia]: { bgColor: '#6B8AFF33', textColor: '#6B8AFF' },
  [UniverseChainId.Solana]: { bgColor: '#9945FF33', textColor: '#000000' },
  [UniverseChainId.Soneium]: { bgColor: '#FFFFFF', textColor: '#000000' },
  [UniverseChainId.Tempo]: { bgColor: 'rgba(26, 26, 46, 0.08)', textColor: '#1A1A2E' },
  [UniverseChainId.XLayer]: { bgColor: '#A7A7A724', textColor: '#FFFFFF' },
<<<<<<< HEAD
  [UniverseChainId.Unichain]: { bgColor: '#CCCCCC33', textColor: '#CCCCCC' },
  [UniverseChainId.UnichainSepolia]: { bgColor: '#CCCCCC33', textColor: '#CCCCCC' },
  [UniverseChainId.WorldChain]: { bgColor: 'rgba(0, 0, 0, 0.12)', textColor: '#000000' },
  [UniverseChainId.Zksync]: { bgColor: 'rgba(54, 103, 246, 0.12)', textColor: '#3667F6' },
  [UniverseChainId.Zora]: { bgColor: 'rgba(0, 0, 0, 0.12)', textColor: '#000000' },
  // Lux ecosystem
  [UniverseChainId.Lux]: { bgColor: '#F5456233', textColor: '#F54562' },
  [UniverseChainId.LuxTestnet]: { bgColor: '#F5456233', textColor: '#F54562' },
  [UniverseChainId.LuxDev]: { bgColor: '#F5456233', textColor: '#F54562' },
  [UniverseChainId.Zoo]: { bgColor: '#10B98133', textColor: '#10B981' },
  [UniverseChainId.ZooTestnet]: { bgColor: '#10B98133', textColor: '#10B981' },
  [UniverseChainId.Hanzo]: { bgColor: '#00D4AA33', textColor: '#00D4AA' },
  [UniverseChainId.SPC]: { bgColor: '#FF69B433', textColor: '#FF69B4' },
  [UniverseChainId.Pars]: { bgColor: '#FFB80033', textColor: '#FFB800' },
}

const CHAIN_THEME_DARK: Partial<Record<UniverseChainId, ChainTheme>> = {
=======
  [UniverseChainId.Unichain]: { bgColor: '#F50DB433', textColor: '#F50DB4' },
  [UniverseChainId.UnichainSepolia]: { bgColor: '#F50DB433', textColor: '#F50DB4' },
  [UniverseChainId.WorldChain]: { bgColor: 'rgba(0, 0, 0, 0.12)', textColor: '#000000' },
  [UniverseChainId.Zksync]: { bgColor: 'rgba(54, 103, 246, 0.12)', textColor: '#3667F6' },
  [UniverseChainId.Zora]: { bgColor: 'rgba(0, 0, 0, 0.12)', textColor: '#000000' },
}

const CHAIN_THEME_DARK: Record<UniverseChainId, ChainTheme> = {
>>>>>>> upstream/main
  ...CHAIN_THEME_LIGHT,
  [UniverseChainId.Blast]: { bgColor: 'rgba(252, 252, 3, 0.12)', textColor: 'rgba(252, 252, 3, 1) ' },
  [UniverseChainId.Celo]: { bgColor: '#FCFF5299', textColor: '#655947' },
  [UniverseChainId.Monad]: { bgColor: 'rgba(131, 110, 249, 0.14)', textColor: '#836EF9' },
<<<<<<< HEAD
=======
  [UniverseChainId.Linea]: { bgColor: 'rgba(97, 223, 255, 0.12)', textColor: '#61DFFF' },
>>>>>>> upstream/main
  [UniverseChainId.Soneium]: { bgColor: '#000000', textColor: '#FFFFFF' },
  [UniverseChainId.Tempo]: { bgColor: 'rgba(232, 232, 240, 0.14)', textColor: '#E8E8F0' },
  [UniverseChainId.XLayer]: { bgColor: '#A7A7A747', textColor: '#121212' },
  [UniverseChainId.WorldChain]: { bgColor: 'rgba(255, 255, 255, 0.12)', textColor: '#FFFFFF' },
  [UniverseChainId.Zksync]: { bgColor: 'rgba(97, 137, 255, 0.12)', textColor: '#6189FF' },
  [UniverseChainId.Zora]: { bgColor: 'rgba(255, 255, 255, 0.12)', textColor: '#FFFFFF' },
}

<<<<<<< HEAD
const DEFAULT_CHAIN_THEME: ChainTheme = { bgColor: 'rgba(0, 0, 0, 0.12)', textColor: '#000000' }
const DEFAULT_CHAIN_THEME_DARK: ChainTheme = { bgColor: 'rgba(255, 255, 255, 0.12)', textColor: '#FFFFFF' }

function useChainTheme(chainId: UniverseChainId): ChainTheme {
  const isDarkMode = useIsDarkMode()
  if (isDarkMode) {
    return CHAIN_THEME_DARK[chainId] ?? DEFAULT_CHAIN_THEME_DARK
  }
  return CHAIN_THEME_LIGHT[chainId] ?? DEFAULT_CHAIN_THEME
=======
function useChainTheme(chainId: UniverseChainId): ChainTheme {
  const isDarkMode = useIsDarkMode()
  return isDarkMode ? CHAIN_THEME_DARK[chainId] : CHAIN_THEME_LIGHT[chainId]
>>>>>>> upstream/main
}

function MaybeExternalBridgeCard({ chainId }: { chainId: UniverseChainId }) {
  const { t } = useTranslation()

  const { bgColor, textColor } = useChainTheme(chainId)
  const chainInfo = getChainInfo(chainId)
  const logoUri = chainInfo.logo as string

  return chainInfo.bridge ? (
    <ExternalLink href={chainInfo.bridge}>
      <CardInner
        image={<img width="40px" height="40px" style={{ borderRadius: '12px' }} src={logoUri} />}
        title={t('token.bridge', { label: chainInfo.label })}
        subtitle={t('common.deposit.toNetwork', { label: chainInfo.label })}
        textColor={textColor}
        backgroundColor={bgColor}
      />
    </ExternalLink>
  ) : null
}

const ICON_SIZE = 20
const ICON_SIZE_TOKEN = `$icon.20`

function CardInner({
  image,
  isAbsoluteImage = false,
  backgroundColor,
  textColor,
  title,
  subtitle,
  onDismiss,
  isNew = false,
}: {
  title: string
  subtitle: string
  image: JSX.Element | null
  isAbsoluteImage?: boolean
  backgroundColor?: string
  textColor?: string
  isNew?: boolean
  onDismiss?: () => void
}) {
  const colors = useSporeColors()

  return (
    <Flex
      row
      grow
      overflow="hidden"
      borderWidth="$spacing1"
      borderColor={backgroundColor ?? opacify(0.05, colors.surface3.val)}
      backgroundColor={backgroundColor ?? '$surface1'}
      alignItems="center"
      pl={isAbsoluteImage ? '$none' : '$spacing12'}
      borderRadius="$rounded20"
      justifyContent="space-between"
      width="100%"
    >
      {image}
      <Flex row fill alignItems="center" p="$spacing12" pl={isAbsoluteImage ? '$spacing48' : '$spacing12'}>
        <Flex fill alignContent="center">
          <ElementAfterText
            text={title}
            textProps={{ color: textColor ?? '$neutral1', variant: 'subheading2' }}
            element={isNew ? <NewTag /> : undefined}
          />
          <Flex $md={{ display: 'none' }}>
            <Text variant="body4" color={textColor ?? '$neutral2'}>
              {subtitle}
            </Text>
          </Flex>
        </Flex>
        {onDismiss ? (
          <TouchableArea
            alignSelf="flex-start"
            $md={{ alignSelf: 'center' }}
            hitSlop={ICON_SIZE}
            onPress={(e: TouchableAreaEvent) => {
              e.stopPropagation()
              onDismiss()
            }}
          >
            <X color="$neutral3" size={ICON_SIZE_TOKEN} />
          </TouchableArea>
        ) : (
          <TouchableArea alignSelf="flex-start" $md={{ alignSelf: 'center' }}>
            <ArrowUpRight size="$icon.20" color={textColor} strokeWidth={0} />
          </TouchableArea>
        )}
      </Flex>
    </Flex>
  )
}
