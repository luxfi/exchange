import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { useLocation, useNavigate } from 'react-router'
import { WRAPPED_PATH } from '@l.x/lx/src/components/banners/shared/utils'
import { LuxWrapped2025Banner } from '@l.x/lx/src/components/banners/LuxWrapped2025Banner/LuxWrapped2025Banner'
import { selectHasDismissedLuxWrapped2025Banner } from '@l.x/lx/src/features/behaviorHistory/selectors'
import { setHasDismissedLuxWrapped2025Banner } from '@l.x/lx/src/features/behaviorHistory/slice'
import { useAppDispatch, useAppSelector } from '~/state/hooks'
import { InterfaceState } from '~/state/webReducer'

export function useRenderLuxWrapped2025Banner(): JSX.Element | null {
  const isFeatureFlagEnabled = useFeatureFlag(FeatureFlags.LuxWrapped2025)
  const hasDismissed = useAppSelector((state: InterfaceState) => selectHasDismissedLuxWrapped2025Banner(state))
  const { pathname } = useLocation()
  const isWrappedPage = pathname.startsWith(WRAPPED_PATH)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleDismiss = (): void => {
    dispatch(setHasDismissedLuxWrapped2025Banner(true))
  }

  const handlePress = (): void => {
    dispatch(setHasDismissedLuxWrapped2025Banner(true))
    navigate(WRAPPED_PATH)
  }

  if (isFeatureFlagEnabled && !hasDismissed && !isWrappedPage) {
    return <LuxWrapped2025Banner handleDismiss={handleDismiss} handlePress={handlePress} />
  }

  return null
}
