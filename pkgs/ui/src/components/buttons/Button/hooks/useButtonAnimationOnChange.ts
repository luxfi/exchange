import { useLayoutAnimationOnChange } from '@luxfi/ui/src/animations'

export const useButtonAnimationOnChange = ({
  shouldAnimateBetweenLoadingStates,
  loading,
}: {
  shouldAnimateBetweenLoadingStates?: boolean
  loading?: boolean
}): void => {
  useLayoutAnimationOnChange(shouldAnimateBetweenLoadingStates && loading)
}
