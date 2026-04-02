import { useTranslation } from 'react-i18next'
import { Image } from 'ui/src'
import { LX } from 'ui/src/components/icons/LX'
import { opacify } from 'ui/src/theme'
import { lxUrls } from 'lx/src/constants/urls'
import { CardContents } from '~/pages/Landing/components/cards/CardContents'
import { PillButton } from '~/pages/Landing/components/cards/PillButton'
import ValuePropCard from '~/pages/Landing/components/cards/ValuePropCard'

const primary = '#8251FB'

export function LXCard() {
  const { t } = useTranslation()

  return (
    <ValuePropCard
      href={lxUrls.lxSwapUrl}
      color={primary}
      backgroundColor={opacify(6, primary)}
      title={
        <PillButton color={primary} label={t('common.lxSwap')} icon={<LX size="$icon.24" fill={primary} />} />
      }
      bodyText={t('landing.lxSwap.body')}
      subtitle={t('landing.lxSwap.subtitle')}
      button={<PillButton color={primary} label={t('landing.lxSwap.button')} backgroundColor="$surface1" />}
      alignTextToBottom
    >
      <CardContents alignItems="flex-end">
        <Image src="/images/landing_page/LX-bg.svg" width="55%" height="100%" position="absolute" bottom="0" />
        <img
          src="/images/landing_page/LX.svg"
          width="45%"
          height="30%"
          style={{ objectFit: 'contain', transform: 'translateX(5%)', marginBottom: '8%' }}
          alt={t('common.lxSwap')}
        />
      </CardContents>
    </ValuePropCard>
  )
}
