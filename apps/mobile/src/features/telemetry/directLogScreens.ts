<<<<<<< HEAD
import { MobileScreens } from '@l.x/lx/src/types/screens/mobile'
=======
import { MobileScreens } from 'uniswap/src/types/screens/mobile'
>>>>>>> upstream/main

export const DIRECT_LOG_ONLY_SCREENS: string[] = [MobileScreens.TokenDetails, MobileScreens.ExternalProfile]

export function shouldLogScreen(directFromPage: boolean | undefined, screen: string | undefined): boolean {
  return directFromPage || screen === undefined || !DIRECT_LOG_ONLY_SCREENS.includes(screen)
}
