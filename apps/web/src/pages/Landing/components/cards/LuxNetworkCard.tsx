import { CardContents } from 'pages/Landing/components/cards/CardContents'
import { PillButton } from 'pages/Landing/components/cards/PillButton'
import ValuePropCard from 'pages/Landing/components/cards/ValuePropCard'
import { useTranslation } from 'react-i18next'
import { Image } from '@luxfi/ui/src'
import { LuxLogo } from '@luxfi/ui/src/components/icons/LuxLogo'
import { opacify } from '@luxfi/ui/src/theme'
import { lxUrls } from '@l.x/lx/src/constants/urls'

const primary = '#FFFFFF'

export function LuxNetworkCard() {
  const { t } = useTranslation()

  return (
    <ValuePropCard
      href={lxUrls.luxNetworkUrl}
      smaller
      color={primary}
      backgroundColor={opacify(6, primary)}
      $theme-dark={{ backgroundColor: opacify(12, primary) }}
      title={
        <PillButton color={primary} label={t('common.luxNetwork')} icon={<LuxLogo size="$icon.24" color={primary} />} />
      }
      bodyText={t('landing.luxNetwork.body')}
      subtitle={t('landing.luxNetwork.subtitle')}
      button={<PillButton color="$neutral1" label={t('landing.luxNetwork.button')} backgroundColor="$surface1" />}
      alignTextToBottom
    >
      <CardContents>
        <Image src="/images/lux-logo.svg" width="60%" height="60%" position="absolute" bottom="10%" opacity={0.1} />
      </CardContents>
    </ValuePropCard>
  )
}
