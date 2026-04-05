<<<<<<< HEAD
import { MobileScreens, UnitagScreens } from '@l.x/lx/src/types/screens/mobile'
=======
import { MobileScreens, UnitagScreens } from 'uniswap/src/types/screens/mobile'
>>>>>>> upstream/main

export interface EditWalletSettingsModalState {
  address: Address
  accessPoint?: UnitagScreens.UnitagConfirmation | MobileScreens.SettingsWallet
}
