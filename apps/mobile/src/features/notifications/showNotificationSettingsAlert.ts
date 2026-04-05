import { Alert } from 'react-native'
import { openNotificationSettings } from 'src/utils/linking'
<<<<<<< HEAD
import i18n from '@l.x/lx/src/i18n'
=======
import i18n from 'uniswap/src/i18n'
>>>>>>> upstream/main

export const showNotificationSettingsAlert = (): void => {
  Alert.alert(
    i18n.t('onboarding.notification.permission.title'),
    i18n.t('onboarding.notification.permission.message'),
    [
      { text: i18n.t('common.navigation.settings'), onPress: openNotificationSettings },
      {
        text: i18n.t('common.button.cancel'),
      },
    ],
  )
}
