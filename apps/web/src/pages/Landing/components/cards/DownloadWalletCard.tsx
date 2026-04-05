import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'
<<<<<<< HEAD
import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { Trans, useTranslation } from 'react-i18next'
import { Flex, useIsDarkMode, useSporeColors } from '@l.x/ui/src'
import { Star } from '@l.x/ui/src/components/icons/Star'
import { lxUrls } from '@l.x/lx/src/constants/urls'
=======
import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { Trans, useTranslation } from 'react-i18next'
import { Flex, useIsDarkMode, useSporeColors } from 'ui/src'
import { Star } from 'ui/src/components/icons/Star'
import { uniswapUrls } from 'uniswap/src/constants/urls'
>>>>>>> upstream/main
import { PillButton } from '~/pages/Landing/components/cards/PillButton'
import ValuePropCard from '~/pages/Landing/components/cards/ValuePropCard'
import { Wallet } from '~/pages/Landing/components/Icons'

export function DownloadWalletCard() {
  const theme = useSporeColors()
  const isDarkMode = useIsDarkMode()
  const { t } = useTranslation()
  const isUnificationCopyEnabled = useFeatureFlag(FeatureFlags.UnificationCopy)

  const { rive: lightAnimation, RiveComponent: LightAnimation } = useRive({
    src: '/rive/landing-page.riv',
    artboard: 'Mobile-Light',
    stateMachines: 'Animation',
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.BottomCenter }),
  })

  const { rive: darkAnimation, RiveComponent: DarkAnimation } = useRive({
    src: '/rive/landing-page.riv',
    artboard: 'Mobile-Dark',
    stateMachines: 'Animation',
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.BottomCenter }),
  })

  return (
    <ValuePropCard
<<<<<<< HEAD
      href={lxUrls.downloadWalletUrl}
=======
      href={uniswapUrls.downloadWalletUrl}
>>>>>>> upstream/main
      minHeight={500}
      color="$accent1"
      backgroundColor="rgba(252, 114, 255, 0.12)"
      title={
        <PillButton
          color={theme.accent1.val}
<<<<<<< HEAD
          label={t('common.luxWallet')}
=======
          label={t('common.uniswapWallet')}
>>>>>>> upstream/main
          icon={<Wallet size="24px" fill={theme.accent1.val} />}
        />
      }
      subtitle={t('landing.walletSubtitle')}
      bodyText={
        isUnificationCopyEnabled ? (
          <Trans
            i18nKey="landing.walletBody"
            components={{
              Star: <Star color="$accent1" size="$icon.24" mb={-4} />,
            }}
          />
        ) : (
          <Trans
            i18nKey="landing.walletBody.old"
            components={{
              Star: <Star color="$accent1" size="$icon.24" mb={-4} />,
            }}
          />
        )
      }
      button={
<<<<<<< HEAD
        <PillButton color={theme.accent1.val} label={t('common.downloadLuxWallet')} backgroundColor="$surface1" />
=======
        <PillButton color={theme.accent1.val} label={t('common.downloadUniswapWallet')} backgroundColor="$surface1" />
>>>>>>> upstream/main
      }
      $lg={{
        minHeight: 750,
        maxWidth: '100%',
      }}
      $sm={{
        minHeight: 700,
      }}
      $xs={{
        minHeight: 540,
      }}
    >
      <Flex width="100%" height="60%" position="absolute" m="auto" bottom={0} zIndex={1}>
        {isDarkMode ? (
          <DarkAnimation onMouseEnter={() => darkAnimation?.play()} />
        ) : (
          <LightAnimation onMouseEnter={() => lightAnimation?.play()} />
        )}
      </Flex>
    </ValuePropCard>
  )
}
