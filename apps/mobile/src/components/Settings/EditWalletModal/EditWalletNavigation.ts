import { navigate } from 'src/app/navigation/rootNavigation'
<<<<<<< HEAD
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { MobileScreens, UnitagScreens } from '@l.x/lx/src/types/screens/mobile'
=======
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { MobileScreens, UnitagScreens } from 'uniswap/src/types/screens/mobile'
>>>>>>> upstream/main

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
