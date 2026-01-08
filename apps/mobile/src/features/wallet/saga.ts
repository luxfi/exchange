import { CommonActions } from '@react-navigation/core'
import { dispatchNavigationAction } from 'src/app/navigation/rootNavigation'
import { call, put, takeEvery } from 'typed-redux-saga'
import { pushNotification } from 'lx/src/features/notifications/slice/slice'
import { AppNotificationType } from 'lx/src/features/notifications/slice/types'
import i18n from 'lx/src/i18n'
import { MobileScreens } from 'lx/src/types/screens/mobile'
import { restoreMnemonicComplete } from 'wallet/src/features/wallet/slice'

/**
 * Watch when we've restored a mnemonic (new phone migration)
 */
export function* restoreMnemonicCompleteWatcher() {
  yield* takeEvery(restoreMnemonicComplete, onRestoreMnemonicComplete)
}

function* onRestoreMnemonicComplete() {
  yield* put(
    pushNotification({
      type: AppNotificationType.Success,
      title: i18n.t('notification.restore.success'),
    }),
  )
  yield* call(
    dispatchNavigationAction,
    CommonActions.reset({
      index: 0,
      routes: [{ name: MobileScreens.Home }],
    }),
  )
}
