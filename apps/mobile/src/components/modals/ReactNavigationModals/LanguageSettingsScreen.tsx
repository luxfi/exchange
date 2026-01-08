import { AppStackScreenProp } from 'src/app/navigation/types'
import { ReactNavigationModal } from 'src/components/modals/ReactNavigationModals/ReactNavigationModal'
import { ModalName } from 'lx/src/features/telemetry/constants'
import { SettingsLanguageModal } from 'wallet/src/components/settings/language/SettingsLanguageModal'

export const LanguageSettingsScreen = (props: AppStackScreenProp<typeof ModalName.LanguageSelector>): JSX.Element => {
  return <ReactNavigationModal {...props} modalComponent={SettingsLanguageModal} />
}
