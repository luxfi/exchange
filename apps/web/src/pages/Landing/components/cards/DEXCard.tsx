import { useTranslation } from 'react-i18next'
import { Image } from '@luxfi/ui/src'
import { DEX } from '@luxfi/ui/src/components/icons/DEX'
import { opacify } from '@luxfi/ui/src/theme'
import { lxUrls } from '@luxexchange/lx/src/constants/urls'
import { CardContents } from '~/pages/Landing/components/cards/CardContents'
import { PillButton } from '~/pages/Landing/components/cards/PillButton'
import ValuePropCard from '~/pages/Landing/components/cards/ValuePropCard'

const primary = '#8251FB'

export function DEXCard() {
  const { t } = useTranslation()

  return (
    <ValuePropCard
      href={lxUrls.dexUrl}
      color={primary}
      backgroundColor={opacify(6, primary)}
      title={
        <PillButton color={primary} label={t('common.dex')} icon={<DEX size="$icon.24" fill={primary} />} />
      }
      bodyText={t('landing.dex.body')}
      subtitle={t('landing.dex.subtitle')}
      button={<PillButton color={primary} label={t('landing.dex.button')} backgroundColor="$surface1" />}
      alignTextToBottom
    >
      <CardContents alignItems="flex-end">
        <Image src="/images/landing_page/DEX-bg.svg" width="55%" height="100%" position="absolute" bottom="0" />
        <img
          src="/images/landing_page/DEX.svg"
          width="45%"
          height="30%"
          style={{ objectFit: 'contain', transform: 'translateX(5%)', marginBottom: '8%' }}
          alt={t('common.dex')}
        />
      </CardContents>
    </ValuePropCard>
  )
}
