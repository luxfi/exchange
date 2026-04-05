import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
<<<<<<< HEAD
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { PortfolioBalanceModal } from '@luxfi/wallet/src/components/settings/portfolioBalance/PortfolioBalanceModal'
=======
import { ModalName } from 'uniswap/src/features/telemetry/constants'
import { PortfolioBalanceModal } from 'wallet/src/components/settings/portfolioBalance/PortfolioBalanceModal'
>>>>>>> upstream/main

export const PortfolioBalanceSettingsScreen = (
  props: AppStackScreenProp<typeof ModalName.PortfolioBalanceModal>,
): JSX.Element => {
  return <ReactNavigationModal {...props} modalComponent={PortfolioBalanceModal} />
}
