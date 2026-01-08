import { ExploreStackNavigator } from 'src/app/navigation/ExploreStackNavigator'
import { AppStackScreenProp } from 'src/app/navigation/types'
import { useReactNavigationModal } from 'src/components/modals/useReactNavigationModal'
import { useSporeColors } from 'ui/src'
import { Modal } from 'lx/src/components/modals/Modal'
import { ModalName } from 'lx/src/features/telemetry/constants'
import { MobileScreens } from 'lx/src/types/screens/mobile'

/**
 * Component for the main BSM that contains the ExploreStackNavigator.
 *
 * This screen shows search, favorite tokens, wallets, and filterable top tokens.
 */
export function ExploreModal({ route }: AppStackScreenProp<typeof ModalName.Explore>): JSX.Element {
  const { onClose } = useReactNavigationModal()
  const colors = useSporeColors()

  // Extract the params that should be passed to the initial screen
  const initialParams = route.params?.screen === MobileScreens.Explore ? route.params.params : undefined

  return (
    <Modal
      fullScreen
      hideHandlebar
      renderBehindBottomInset
      renderBehindTopInset
      backgroundColor={colors.surface1.val}
      name={ModalName.Explore}
      onClose={onClose}
    >
      <ExploreStackNavigator initialParams={initialParams} />
    </Modal>
  )
}
