<<<<<<< HEAD
import { useEvent } from '@l.x/utils/src/react/hooks'
=======
import { useEvent } from 'utilities/src/react/hooks'
>>>>>>> upstream/main
import { useAppSelector } from '~/state/hooks'
import { selectIsAtomicBatchingSupportedByChainId } from '~/state/walletCapabilities/reducer'

// used in function calls, not component bodies
export function useIsAtomicBatchingSupportedByChainIdCallback(): (chainId: number) => boolean | undefined {
  const isAtomicBatchingSupportedByChainId = useAppSelector(selectIsAtomicBatchingSupportedByChainId)
  return useEvent(isAtomicBatchingSupportedByChainId)
}
