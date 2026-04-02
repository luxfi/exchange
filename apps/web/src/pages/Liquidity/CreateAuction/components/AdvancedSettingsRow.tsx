import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, TouchableArea } from '@luxfi/ui/src'
import { ChevronsIn } from '@luxfi/ui/src/components/icons/ChevronsIn'
import { ChevronsOut } from '@luxfi/ui/src/components/icons/ChevronsOut'
import { KycCard } from '~/pages/Liquidity/CreateAuction/components/KycCard'

export function AdvancedSettingsRow() {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Flex gap="$spacing24">
      <Flex row alignItems="center" gap="$spacing16">
        <Flex flex={1} height={1} backgroundColor="$surface3" />
        <TouchableArea
          flexDirection="row"
          alignItems="center"
          py="$spacing4"
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <Text variant="buttonLabel4" color="$neutral2">
            {isExpanded
              ? t('toucan.createAuction.step.configureAuction.hideAdvancedSettings')
              : t('toucan.createAuction.step.configureAuction.showAdvancedSettings')}
          </Text>
          {isExpanded ? (
            <ChevronsIn size="$icon.16" color="$neutral2" />
          ) : (
            <ChevronsOut size="$icon.16" color="$neutral2" />
          )}
        </TouchableArea>
        <Flex flex={1} height={1} backgroundColor="$surface3" />
      </Flex>

      {isExpanded && (
        <Flex gap="$spacing12">
          <Flex gap="$spacing4">
            <Text variant="subheading1" color="$neutral1">
              {t('toucan.createAuction.step.configureAuction.participation')}
            </Text>
            <Text variant="body3" color="$neutral2">
              {t('toucan.createAuction.step.configureAuction.participation.description')}
            </Text>
          </Flex>

          <Flex row>
            <Flex width="50%">
              <KycCard />
            </Flex>
          </Flex>
        </Flex>
      )}
    </Flex>
  )
}
