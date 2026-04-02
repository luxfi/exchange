import { AppState } from 'react-native'
import { EventChannel, eventChannel } from 'redux-saga'
import { call, put, select, takeLatest } from 'typed-redux-saga'
import { selectCurrentLanguage } from '@l.x/lx/src/features/settings/selectors'
import { setCurrentLanguage } from '@l.x/lx/src/features/settings/slice'
import i18n from '@l.x/lx/src/i18n'
import { getWalletDeviceLanguage, getWalletDeviceLocale } from '@l.x/lx/src/i18n/utils'
import { logger } from '@l.x/utils/src/logger/logger'
import { isMobileApp } from '@l.x/utils/src/platform'
import { restartApp } from '@luxfi/wallet/src/components/ErrorBoundary/restartApp'

function createAppStateChannel(): EventChannel<string> {
  return eventChannel((emit) => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        emit(nextAppState)
      }
    })

    return () => subscription.remove()
  })
}

export function* deviceLocaleWatcher(): Generator {
  // Sync language on app start
  yield* call(syncAppWithDeviceLanguage)

  // Listen for app state changes and sync language when app becomes active
  const appStateChannel = yield* call(createAppStateChannel)
  yield* takeLatest(appStateChannel, syncAppWithDeviceLanguage)
}

function* syncAppWithDeviceLanguage(): Generator {
  const currentAppLanguage = yield* select(selectCurrentLanguage)
  const deviceLanguage = getWalletDeviceLanguage()
  const deviceLocale = getWalletDeviceLocale()

  if (currentAppLanguage !== deviceLanguage) {
    // Syncs language with Firestore every app start to make sure language is up to date
    yield* put(setCurrentLanguage(deviceLanguage))
  }

  if (isMobileApp && currentAppLanguage !== deviceLanguage) {
    // We force a restart of the mobile app when the language changes
    logger.info(
      'syncAppWithDeviceLanguage.ts',
      'syncAppWithDeviceLanguage',
      `Restarting app because of locale change: ${currentAppLanguage} -> ${deviceLanguage}, ${i18n.language} -> ${deviceLocale}`,
    )
    yield* call(restartApp)
  }
}
