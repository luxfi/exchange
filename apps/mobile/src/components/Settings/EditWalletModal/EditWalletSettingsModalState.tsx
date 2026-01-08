import { MobileScreens, UnitagScreens } from 'lx/src/types/screens/mobile'

export interface EditWalletSettingsModalState {
  address: Address
  accessPoint?: UnitagScreens.UnitagConfirmation | MobileScreens.SettingsWallet
}
