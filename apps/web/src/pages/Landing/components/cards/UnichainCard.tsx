import { CardContents } from 'pages/Landing/components/cards/CardContents'
import { PillButton } from 'pages/Landing/components/cards/PillButton'
import ValuePropCard from 'pages/Landing/components/cards/ValuePropCard'
import { useTranslation } from 'react-i18next'
import { Image } from 'ui/src'
import { LuxLogo } from 'ui/src/components/icons/LuxLogo'
import { opacify } from 'ui/src/theme'
import { uniswapUrls } from 'uniswap/src/constants/urls'

const primary = '#FFFFFF'

export function UnichainCard() {
  const { t } = useTranslation()

  return (
    <ValuePropCard
      href={uniswapUrls.unichainUrl}
      smaller
      color={primary}
      backgroundColor={opacify(6, primary)}
      $theme-dark={{ backgroundColor: opacify(12, primary) }}
      title={
        <PillButton color={primary} label={t('common.unichain')} icon={<LuxLogo size="$icon.24" color={primary} />} />
      }
      bodyText={t('landing.unichain.body')}
      subtitle={t('landing.unichain.subtitle')}
      button={<PillButton color={primary} label={t('landing.unichain.button')} backgroundColor="$surface1" />}
      alignTextToBottom
    >
      <CardContents>
        <Image src="/images/lux-logo.svg" width="60%" height="60%" position="absolute" bottom="10%" opacity={0.1} />
      </CardContents>
    </ValuePropCard>
  )
}
