import { helpUrl } from '@universe/api'
import { useTranslation } from 'react-i18next'
import { Flex, Switch, Text } from 'ui/src'
import { ExternalLink } from '~/theme/components/Links'

export function BuybackAndBurnSection({
  enabled,
  onEnabledChange,
}: {
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
}) {
  const { t } = useTranslation()

  return (
    <Flex row alignItems="flex-start" justifyContent="space-between" gap="$spacing12">
      <Flex flex={1}>
        <Text variant="subheading1" color="$neutral1">
          {t('toucan.createAuction.step.customizePool.buybackAndBurn')}
        </Text>
        <Text variant="body3" color="$neutral2">
          {t('toucan.createAuction.step.customizePool.buybackAndBurn.description.beforeLink')}
          <ExternalLink href={helpUrl} style={{ color: 'inherit', fontWeight: '500' }}>
            {t('toucan.createAuction.step.customizePool.buybackAndBurn.description.link')}
          </ExternalLink>
          .
        </Text>
      </Flex>
      <Switch checked={enabled} variant="default" onCheckedChange={onEnabledChange} />
    </Flex>
  )
}
