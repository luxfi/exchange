import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
import { ReportPortfolioDataModal } from '@l.x/lx/src/components/reporting/ReportPortfolioDataModal'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'

export const ReportPortfolioDataModalScreen = (
  props: AppStackScreenProp<typeof ModalName.ReportPortfolioData>,
): JSX.Element => {
  return <ReactNavigationModal {...props} modalComponent={ReportPortfolioDataModal} />
}
