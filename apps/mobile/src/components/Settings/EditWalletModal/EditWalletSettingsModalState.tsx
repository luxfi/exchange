import { MobileScreens, UnitagScreens } from '@l.x/lx/src/types/screens/mobile'

export interface EditWalletSettingsModalState {
  address: Address
  accessPoint?: UnitagScreens.UnitagConfirmation | MobileScreens.SettingsWallet
}
