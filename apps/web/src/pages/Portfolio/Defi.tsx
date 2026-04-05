import { useTranslation } from 'react-i18next'
<<<<<<< HEAD
import { Flex, Text } from '@l.x/ui/src'
import { InterfacePageName } from '@l.x/lx/src/features/telemetry/constants'
import Trace from '@l.x/lx/src/features/telemetry/Trace'
=======
import { Flex, Text } from 'ui/src'
import { InterfacePageName } from 'uniswap/src/features/telemetry/constants'
import Trace from 'uniswap/src/features/telemetry/Trace'
>>>>>>> upstream/main

export function PortfolioDefi() {
  const { t } = useTranslation()

  return (
    <Trace logImpression page={InterfacePageName.PortfolioDefiPage}>
      <Flex gap="$spacing16">
        <Text variant="heading2">{t('portfolio.defi.title')}</Text>
        <Flex
          padding="$spacing24"
          centered
          gap="$gap16"
          borderRadius="$rounded12"
          borderColor="$surface3"
          borderWidth="$spacing1"
          borderStyle="solid"
        >
          <Text variant="subheading1">Coming Soon</Text>
          <Text variant="body2" color="$neutral2">
            This feature is under development and will be available soon.
          </Text>
        </Flex>
      </Flex>
    </Trace>
  )
}
