import { useSelector } from 'react-redux'
import { selectActivityVisibility } from 'lx/src/features/visibility/selectors'

export function useIsActivityHidden(transactionId: string): boolean {
  const activityVisibility = useSelector(selectActivityVisibility)
  return activityVisibility[transactionId]?.isVisible === false
}
