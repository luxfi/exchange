import { UseKeyDownProps } from '@l.x/utils/src/device/keyboard/types'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

/** On desktop, this will trigger a keyboard event listener. No-op on mobile. */
export const useKeyDown = (_: UseKeyDownProps): void => {
  throw new PlatformSplitStubError('useKeyDown')
}
