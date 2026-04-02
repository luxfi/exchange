import { useTranslation } from 'react-i18next'
import { Flex, Text } from '@luxfi/ui/src'
import { opacify } from '@luxfi/ui/src/theme'
import { brand, getBrandUrl } from '@luxexchange/config'
import { CardContents } from '~/pages/Landing/components/cards/CardContents'
import { PillButton } from '~/pages/Landing/components/cards/PillButton'
import ValuePropCard from '~/pages/Landing/components/cards/ValuePropCard'

export function NetworkCard() {
  const { t } = useTranslation()
  const primary = brand.primaryColor || '#FC72FF'

  return (
    <ValuePropCard
      href={getBrandUrl('/network')}
      color={primary}
      backgroundColor={opacify(6, primary)}
      $theme-dark={{ backgroundColor: opacify(12, primary) }}
      title={
        <PillButton color={primary} label={brand.name} />
      }
      bodyText={t('landing.network.body', { name: brand.name })}
      subtitle={t('landing.network.subtitle')}
      button={<PillButton color={primary} label={t('landing.network.button')} backgroundColor="$surface1" />}
      alignTextToBottom
    >
      <CardContents>
        <Flex
          width="100%"
          height="100%"
          position="absolute"
          bottom={0}
          justifyContent="center"
          alignItems="center"
          opacity={0.1}
        >
          <Text fontSize={200} fontWeight="900" color={primary}>
            {brand.name.charAt(0)}
          </Text>
        </Flex>
      </CardContents>
    </ValuePropCard>
  )
}
