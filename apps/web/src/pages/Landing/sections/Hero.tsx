import { ColumnCenter } from 'components/deprecated/Column'
import { useCurrency } from 'hooks/Tokens'
import { useScroll } from 'hooks/useScroll'
import { Hover, RiseIn, RiseInText } from 'pages/Landing/components/animations'
import { TokenCloud } from 'pages/Landing/components/TokenCloud'
import { Swap } from 'pages/Swap'
import { Fragment, useCallback, useMemo } from 'react'
import { ChevronDown } from 'react-feather'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { serializeSwapStateToURLParameters } from 'state/swap/hooks'
import styled from 'styled-components'
import { ForceDarkThemeProvider } from 'theme'
import { Flex, Text, Theme, useMedia } from 'ui/src'
import { INTERFACE_NAV_HEIGHT } from 'ui/src/theme'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { SwapRedirectFn } from 'lx/src/features/transactions/components/TransactionModal/TransactionModalContext'

const HeroVideo = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
  opacity: 0.6;
`

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%);
`

const HeroTitle = styled.h1`
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 64px;
  line-height: 76px;
  font-weight: 400;
  text-align: center;
  color: #FFFFFF !important;
  margin: 0;
  
  & * {
    color: inherit !important;
  }
  
  @media (max-width: 1024px) {
    font-size: 52px;
  }
  
  @media (max-width: 640px) {
    font-size: 36px;
    line-height: 44px;
  }
`

interface HeroProps {
  scrollToRef: () => void
  transition?: boolean
}

export function Hero({ scrollToRef, transition }: HeroProps) {
  const media = useMedia()
  const { height: scrollPosition } = useScroll({ enabled: !media.sm })
  const { defaultChainId, chains } = useEnabledChains()
  const showVideoBackground = useSelector(
    (state: { userSettings?: { showVideoBackground?: boolean } }) => state.userSettings?.showVideoBackground ?? true,
  )
  const initialInputCurrency = useCurrency({
    address: 'ETH',
    chainId: defaultChainId,
  })
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { translateY, opacityY } = useMemo(
    () => ({
      translateY: !media.sm ? -scrollPosition / 7 : 0,
      opacityY: !media.sm ? 1 - scrollPosition / 1000 : 1,
    }),
    [media.sm, scrollPosition],
  )

  const swapRedirectCallback = useCallback(
    ({ inputCurrency, outputCurrency, typedValue, independentField, chainId }: Parameters<SwapRedirectFn>[0]) => {
      navigate(
        `/swap${serializeSwapStateToURLParameters({
          inputCurrency,
          outputCurrency,
          typedValue,
          independentField,
          chainId,
        })}`,
      )
    },
    [navigate],
  )

  const renderRiseInText = useMemo(() => {
    return t('hero.swap.title')
      .split(/(<br\/>)|\s+/)
      .filter(Boolean) // splits the string by spaces but also captures "<br/>" as a separate element in the array
      .map((word, index) => {
        if (word === '<br/>') {
          return <br key={`${index}-${word}-br`} />
        } else {
          return (
            <Fragment key={`${index}-${word}`}>
              <span 
                style={{ 
                  display: 'inline-block',
                  color: '#FFFFFF',
                  opacity: 0,
                  animation: `riseIn 1s cubic-bezier(0.19, 1, 0.22, 1) ${index * 0.1}s forwards`
                }}
              >
                {word}
              </span>
              {' '}
            </Fragment>
          )
        }
      })
  }, [t])

  return (
    <Flex
      position="relative"
      justifyContent="center"
      y={translateY}
      opacity={opacityY}
      minWidth="100%"
      height="100vh"
      maxHeight="100vh"
      overflow="hidden"
      pt={INTERFACE_NAV_HEIGHT}
      pointerEvents="none"
    >
      {showVideoBackground && (
        <>
          <HeroVideo autoPlay muted loop playsInline>
            <source src="/videos/lux-hero.mp4" type="video/mp4" />
          </HeroVideo>
          <HeroOverlay />
        </>
      )}
      {/* TokenCloud (floating icons) disabled for cleaner design */}
      {/* {!media.sm && <TokenCloud />} */}

      {/* Force dark theme for entire hero section - keeps dark heading/colors even in light mode */}
      <ForceDarkThemeProvider>
        <Theme name="dark">
          <Flex
            alignSelf="center"
            maxWidth="85vw"
            pointerEvents="none"
            pt={48}
            gap="$gap20"
            transform={`translate(0px, ${translateY}px)`}
            opacity={opacityY}
            $lg={{ pt: 24 }}
            $sm={{ pt: 8 }}
            $platform-web={{
              transition: transition ? 'shrinkAndFade 1s ease-in-out forwards' : undefined,
            }}
          >
            <Flex maxWidth={920} alignItems="center" pointerEvents="none">
              <HeroTitle className="hero-title-white">
                {renderRiseInText}
              </HeroTitle>
            </Flex>

            <RiseIn delay={0.4}>
              <Flex
                pointerEvents="auto"
                width={480}
                p="$padding8"
                borderRadius="$rounded24"
                backgroundColor="rgba(13, 14, 14, 0.85)"
                maxWidth="100%"
                enterStyle={{ opacity: 0 }}
                style={{ backdropFilter: 'blur(20px)' }}
              >
                <Swap
                  hideHeader
                  hideFooter
                  syncTabToUrl={false}
                  initialInputChainId={defaultChainId}
                  initialInputCurrency={initialInputCurrency}
                  swapRedirectCallback={swapRedirectCallback}
                  usePersistedFilteredChainIds
                />
              </Flex>
            </RiseIn>

            <RiseIn delay={0.3}>
              <Text variant="body1" textAlign="center" maxWidth={430} color="rgba(255, 255, 255, 0.7)" $short={{ variant: 'body2' }}>
                <Trans i18nKey="hero.subtitle" values={{ amount: chains.length }} />
              </Text>
            </RiseIn>
          </Flex>
        </Theme>
      </ForceDarkThemeProvider>

      <Flex flex={1} />

      {/* Scroll indicator also in dark theme */}
      <ForceDarkThemeProvider>
        <Theme name="dark">
          <Flex
            position="absolute"
            width="100%"
            centered
            pointerEvents="none"
            bottom={48}
            style={{ transform: `translate(0px, ${translateY}px)`, opacity: opacityY }}
            $lgHeight={{ display: 'none' }}
          >
            <RiseIn delay={0.3}>
              <Flex
                alignItems="center"
                justifyContent="flex-start"
                onPress={() => scrollToRef()}
                cursor="pointer"
                width={500}
              >
                <Hover>
                  <ColumnCenter>
                    <Text variant="body2" color="#FFFFFF">
                      <Trans i18nKey="hero.scroll" />
                    </Text>
                    <ChevronDown color="white" />
                  </ColumnCenter>
                </Hover>
              </Flex>
            </RiseIn>
          </Flex>
        </Theme>
      </ForceDarkThemeProvider>
    </Flex>
  )
}
