import { CardContents } from 'pages/Landing/components/cards/CardContents'
import { PillButton } from 'pages/Landing/components/cards/PillButton'
import ValuePropCard from 'pages/Landing/components/cards/ValuePropCard'
import { useTranslation } from 'react-i18next'
import { Image } from 'ui/src'
import { LuxLogo } from 'ui/src/components/icons/LuxLogo'
import { opacify } from 'ui/src/theme'
import { uniswapUrls } from 'uniswap/src/constants/urls'

const primary = '#FFFFFF'

export function LuxDexCard() {
  const { t } = useTranslation()

  return (
    <ValuePropCard
      href={uniswapUrls.luxDexUrl}
      smaller
      color={primary}
      backgroundColor={opacify(6, primary)}
      title={
        <PillButton color={primary} label={t('common.luxDex')} icon={<LuxLogo size="$icon.24" color={primary} />} />
      }
      bodyText={t('landing.luxDex.body')}
      subtitle={t('landing.luxDex.subtitle')}
      button={<PillButton color={primary} label={t('landing.luxDex.button')} backgroundColor="$surface1" />}
      alignTextToBottom
    >
      <CardContents alignItems="flex-end">
        <Image src="/images/lux-logo.svg" width="45%" height="30%" position="absolute" bottom="8%" />
      </CardContents>
    </ValuePropCard>
  )
}
