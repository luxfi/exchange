import { useTranslation } from 'react-i18next'
import { Button, Flex, Text } from 'ui/src'
import { ExternalLink } from '~/theme/components/Links'

export function KycCard() {
  const { t } = useTranslation()

  return (
    <Flex borderWidth={1} borderColor="$surface3" borderRadius="$rounded12" p="$spacing12" gap="$spacing8">
      <Flex row alignItems="center">
        <Text variant="buttonLabel3" color="$neutral1">
          {t('toucan.createAuction.step.configureAuction.kyc.title')}
        </Text>
        <Text variant="buttonLabel3" color="$neutral2">
          {` ${t('toucan.createAuction.step.configureAuction.kyc.advanced')}`}
        </Text>
      </Flex>

      <Flex gap="$spacing8" flex={1}>
        <Text variant="body4" color="$neutral1">
          {t('toucan.createAuction.step.configureAuction.kyc.description')}
        </Text>
        <ExternalLink href="https://support.uniswap.org/hc/en-us">
          <Text variant="buttonLabel4" color="$neutral2">
            {t('toucan.createAuction.step.configureAuction.kyc.learnMore')}
          </Text>
        </ExternalLink>
      </Flex>

      <Flex row>
        <Button size="small" emphasis="secondary" fill>
          {t('toucan.createAuction.step.configureAuction.kyc.setUp')}
        </Button>
      </Flex>
    </Flex>
  )
}
