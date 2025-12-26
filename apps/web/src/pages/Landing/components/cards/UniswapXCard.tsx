import { CardContents } from 'pages/Landing/components/cards/CardContents'
import { PillButton } from 'pages/Landing/components/cards/PillButton'
import ValuePropCard from 'pages/Landing/components/cards/ValuePropCard'
import { useTranslation } from 'react-i18next'
import { Image } from 'ui/src'
import { LuxLogo } from 'ui/src/components/icons/LuxLogo'
import { opacify } from 'ui/src/theme'
import { uniswapUrls } from 'uniswap/src/constants/urls'

const primary = '#FFFFFF'

export function UniswapXCard() {
  const { t } = useTranslation()

  return (
    <ValuePropCard
      href={uniswapUrls.uniswapXUrl}
      smaller
      color={primary}
      backgroundColor={opacify(6, primary)}
      title={
        <PillButton color={primary} label={t('common.uniswapX')} icon={<LuxLogo size="$icon.24" color={primary} />} />
      }
      bodyText={t('landing.uniswapX.body')}
      subtitle={t('landing.uniswapX.subtitle')}
      button={<PillButton color={primary} label={t('landing.uniswapX.button')} backgroundColor="$surface1" />}
      alignTextToBottom
    >
      <CardContents alignItems="flex-end">
        <Image src="/images/lux-logo.svg" width="45%" height="30%" position="absolute" bottom="8%" />
      </CardContents>
    </ValuePropCard>
  )
}
