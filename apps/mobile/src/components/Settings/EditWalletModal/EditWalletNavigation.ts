import { navigate } from 'src/app/navigation/rootNavigation'
import { ModalName } from '@luxexchange/lx/src/features/telemetry/constants'
import { MobileScreens, UnitagScreens } from '@luxexchange/lx/src/types/screens/mobile'

export const navigateBackFromEditingWallet = (
  entryPoint: UnitagScreens.UnitagConfirmation | MobileScreens.SettingsWallet,
  address: string,
): void => {
  if (entryPoint === UnitagScreens.UnitagConfirmation) {
    navigate(ModalName.AccountSwitcher)
  } else {
    navigate(ModalName.ManageWalletsModal, {
      address,
    })
  }
}
