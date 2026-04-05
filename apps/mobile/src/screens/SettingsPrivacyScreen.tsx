import React from 'react'
import { useTranslation } from 'react-i18next'
import { BackHeader } from 'src/components/layout/BackHeader'
import { Screen } from 'src/components/layout/Screen'
<<<<<<< HEAD
import { Text } from '@l.x/ui/src'
import { AnalyticsToggleLineSwitch } from '@luxfi/wallet/src/components/settings/AnalyticsToggleLineSwitch'
=======
import { Text } from 'ui/src'
import { AnalyticsToggleLineSwitch } from 'wallet/src/components/settings/AnalyticsToggleLineSwitch'
>>>>>>> upstream/main

export function SettingsPrivacyScreen(): JSX.Element {
  const { t } = useTranslation()

  return (
    <Screen>
      <BackHeader alignment="center" mx="$spacing16" pt="$spacing16">
        <Text variant="body1">{t('settings.setting.permissions.title')}</Text>
      </BackHeader>
      <AnalyticsToggleLineSwitch m="$spacing24" />
    </Screen>
  )
}
