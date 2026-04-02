import { MobileScreens, UnitagScreens } from '@luxexchange/lx/src/types/screens/mobile'

export interface EditWalletSettingsModalState {
  address: Address
  accessPoint?: UnitagScreens.UnitagConfirmation | MobileScreens.SettingsWallet
}
