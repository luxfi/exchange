import { PlatformSplitStubError } from '@l.x/utils/src/errors'

export const restart = (): void => {
  throw new PlatformSplitStubError('restart')
}
