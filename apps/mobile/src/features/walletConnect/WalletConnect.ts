<<<<<<< HEAD
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { NativeModules } from 'react-native'
import { isAndroid } from '@l.x/utils/src/platform'
=======
/* oxlint-disable typescript/no-unsafe-return */
import { NativeModules } from 'react-native'
import { isAndroid } from 'utilities/src/platform'
>>>>>>> upstream/main

const { RNWalletConnect, RedirectToSourceApp } = NativeModules

export const returnToPreviousApp = async (): Promise<boolean> => {
  if (isAndroid) {
    return RedirectToSourceApp.moveAppToBackground()
  }
  return RNWalletConnect.returnToPreviousApp()
}
