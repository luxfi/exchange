import { type ColorScheme } from '@l.x/lx/src/features/appearance/types'
import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export const useColorScheme = (): ColorScheme => {
  throw new PlatformSplitStubError('Use the correct hook for your platform')
}
