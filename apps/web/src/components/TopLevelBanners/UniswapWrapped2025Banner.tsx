import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { useLocation, useNavigate } from 'react-router'
import { WRAPPED_PATH } from 'lx/src/components/banners/shared/utils'
import { LXWrapped2025Banner } from 'lx/src/components/banners/LuxWrapped2025Banner/LuxWrapped2025Banner'
import { selectHasDismissedLxWrapped2025Banner } from 'lx/src/features/behaviorHistory/selectors'
import { setHasDismissedLxWrapped2025Banner } from 'lx/src/features/behaviorHistory/slice'
import { useAppDispatch, useAppSelector } from '~/state/hooks'
import { InterfaceState } from '~/state/webReducer'

export function useRenderLxWrapped2025Banner(): JSX.Element | null {
  const isFeatureFlagEnabled = useFeatureFlag(FeatureFlags.LXWrapped2025)
  const hasDismissed = useAppSelector((state: InterfaceState) => selectHasDismissedLxWrapped2025Banner(state))
  const { pathname } = useLocation()
  const isWrappedPage = pathname.startsWith(WRAPPED_PATH)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleDismiss = (): void => {
    dispatch(setHasDismissedLxWrapped2025Banner(true))
  }

  const handlePress = (): void => {
    dispatch(setHasDismissedLxWrapped2025Banner(true))
    navigate(WRAPPED_PATH)
  }

  if (isFeatureFlagEnabled && !hasDismissed && !isWrappedPage) {
    return <LXWrapped2025Banner handleDismiss={handleDismiss} handlePress={handlePress} />
  }

  return null
}
