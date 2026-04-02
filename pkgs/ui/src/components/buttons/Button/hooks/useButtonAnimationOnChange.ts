import { useLayoutAnimationOnChange } from '@l.x/ui/src/animations'

export const useButtonAnimationOnChange = ({
  shouldAnimateBetweenLoadingStates,
  loading,
}: {
  shouldAnimateBetweenLoadingStates?: boolean
  loading?: boolean
}): void => {
  useLayoutAnimationOnChange(shouldAnimateBetweenLoadingStates && loading)
}
